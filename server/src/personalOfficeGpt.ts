import type { FastifyInstance } from 'fastify';

const roleInstructions: Record<string, string> = {
  finance: '너는 개인 재무 정리 도우미다. 계산의 가정과 위험을 분명히 밝히고, 투자 수익이나 세금 결과를 보장하지 않는다.',
  daily: '너는 친절하고 실용적인 일상 계획 도우미다. 간결한 한국어로 답한다.',
  work: '너는 업무 기록 및 기술 문제 분석 도우미다. 검증된 사실과 추정을 구분하고 기밀 정보를 외부 공유하지 않도록 주의시킨다.',
  health: '너는 일반 건강 정보와 생활 습관 기록 도우미다. 진단을 단정하지 않고 필요한 경우 의료 전문가 상담을 권한다.',
};

type ChatBody = {
  role: string;
  message: string;
  context?: string[];
  history?: { role: 'user' | 'assistant'; content: string }[];
};

/** Register only on the standalone server, using its privileged bearer token. */
export function registerPersonalOfficeGpt(app: FastifyInstance, token: string): void {
  app.post<{ Body: ChatBody }>('/api/personal-office/chat', {
    bodyLimit: 24000,
    schema: { body: { type: 'object', required: ['role', 'message'], additionalProperties: false,
      properties: {
        role: { type: 'string', enum: Object.keys(roleInstructions) },
        message: { type: 'string', minLength: 1, maxLength: 4000 },
        context: { type: 'array', maxItems: 12, items: { type: 'string', maxLength: 1000 } },
        history: { type: 'array', maxItems: 10, items: { type: 'object', additionalProperties: false,
          required: ['role', 'content'], properties: {
            role: { type: 'string', enum: ['user', 'assistant'] },
            content: { type: 'string', maxLength: 2000 },
          } } },
      } } },
  }, async (request, reply) => {
    // The UI's privileged standalone URL already contains this capability.
    // Never accept a request from an unrelated browser origin.
    const origin = request.headers.origin;
    const host = request.headers.host;
    if (!origin || !host || new URL(origin).host !== host ||
      request.headers.authorization !== 'Bearer ' + token) {
      return reply.code(403).send({ error: '접근이 허용되지 않았습니다.' });
    }
    const key = process.env.OPENAI_API_KEY;
    if (!key) return reply.code(503).send({ error: 'OPENAI_API_KEY 환경변수를 먼저 설정해야 합니다.' });
    const { role, message, context = [], history = [] } = request.body;
    const input = [
      ...history.map((entry) => ({ role: entry.role, content: entry.content })),
      { role: 'user', content: message },
    ];
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    try {
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
          store: false,
          max_output_tokens: 900,
          instructions: '항상 한국어로 답하세요. 사용자 정보는 요청된 응답을 위해서만 사용하고 기억 저장을 주장하지 마세요. ' +
            roleInstructions[role] + '\n사용자가 선택하여 전달한 참고 기록:\n' + context.join('\n'),
          input,
        }),
        signal: controller.signal,
      });
      if (!response.ok) {
        return reply.code(response.status === 429 ? 429 : 502).send({
          error: response.status === 429 ? 'API 사용 한도에 도달했습니다.' : 'GPT API 요청에 실패했습니다. API 키, 모델 및 결제 설정을 확인하세요.',
        });
      }
      const data = await response.json() as { output?: { type?: string; content?: { type?: string; text?: string }[] }[] };
      const answer = data.output?.flatMap((item) => item.content ?? [])
        .filter((part) => part.type === 'output_text').map((part) => part.text ?? '').join('\n').trim();
      if (!answer) return reply.code(502).send({ error: 'GPT의 응답을 읽을 수 없습니다.' });
      return { answer };
    } catch {
      return reply.code(502).send({ error: 'GPT 연결 중 오류가 발생했습니다.' });
    } finally {
      clearTimeout(timer);
    }
  });
}
