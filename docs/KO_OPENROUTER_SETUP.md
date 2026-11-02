# OpenRouter 연결 — Windows

Pixel AI 오피스의 재무·일상·업무·건강 네 직원은 하나의 OpenRouter API 키를 통해 대화합니다. **키를 채팅이나 GitHub에 올리지 마세요.**

## 시작하기

1. OpenRouter에서 충전한 계정의 API 키를 발급받으세요: https://openrouter.ai/settings/keys
2. GitHub의 `feature/korean-personal-office` 브랜치를 다운로드하거나 clone하세요.
3. Node.js 22 이상을 설치한 뒤 해당 프로젝트 폴더에서 **PowerShell**을 열고 실행하세요.

```powershell
$env:OPENROUTER_API_KEY = Read-Host "OpenRouter API key"
$env:OPENROUTER_MODEL = "openai/gpt-4.1-mini"
npm ci
npm run build
node dist/cli.js --port 3100
```

4. 터미널에 표시되는 **토큰 포함 로컬 URL**을 브라우저에서 여세요. '나의 AI 오피스'에서 직원 선택 후 메시지를 보낼 수 있습니다.

키를 입력한 PowerShell 창이 닫히면 이 세션의 환경변수가 사라집니다. 키가 들어간 URL이나 브라우저 화면을 공유하지 마세요.

## 비용 및 데이터

- OpenRouter는 API 호출량에 따라 요금이 발생합니다. 별도 OpenRouter 대시보드에서 키별 한도를 설정하는 것을 권장합니다.
- 기본 모델: `openai/gpt-4.1-mini`. `OPENROUTER_MODEL`로 다른 OpenRouter 모델 ID 지정 가능.
- 로컬 메모는 '저장 메모를 OpenRouter 모델에 전송'을 사용자가 선택할 때만 API 입력에 포함됩니다.
- 기존 대화 일부는 후속 요청 문맥에 포함되므로 민감한 내용을 입력하기 전에 확인하세요.
- 브라우저 localStorage 데이터는 기기/브라우저별로 분리되어 있고, 자동 동기화되지 않습니다.
- 별도 OpenRouter 계정 설정·사용료와 ChatGPT Plus 구독료는 서로 독립적입니다.

## 제한
- 이 버전의 API 채팅은 **standalone** 모드에서만 지원합니다. VS Code 확장 모드는 제외합니다.
- 원본 Pixel Agents의 Claude Code 에이전트 시각화는 독립 기능이며, OpenRouter 채팅이 이를 대체하지는 않습니다.
- 아직 개발 브랜치입니다. GitHub Actions 확인과 Windows 실행 검증 후 사용을 권장합니다.

공식 API 참고: https://openrouter.ai/docs/api/api-reference/chat/send-chat-completion-request
