# GPT 연결 설정 (Windows)

이 분기에서는 Claude 대신 OpenAI GPT API로 네 역할(재무·일상·업무·건강)의 대화 패널을 사용할 수 있습니다. GPT 기능은 **standalone 브라우저 앱 모드에서만** 제공됩니다. 원본의 Claude Code 시각화 기능과 별개입니다.

## 사용자 준비

1. https://platform.openai.com/api-keys 에서 OpenAI API 키를 발급받습니다.
2. API Billing 설정을 확인하고 사용 한도를 지정합니다. ChatGPT Plus 비용과 API 과금은 별도입니다.
3. **PowerShell**에서 다음을 실행합니다(키를 GitHub·대화·스크린샷에 올리지 마세요).

```powershell
$env:OPENAI_API_KEY = Read-Host "OpenAI API Key"
$env:OPENAI_MODEL = "gpt-4.1-mini"
npm ci
npm run build
node dist/cli.js --port 3100
```

4. 터미널에 표시되는 **인증 토큰이 포함된 URL**을 같은 PC의 브라우저에서 열어 '나의 AI 오피스' → 담당 직원 → 'GPT에게 보내기'를 사용합니다. 토큰 URL은 공유하지 마세요.

PowerShell 창을 닫으면 해당 창의 API 키 환경변수는 사라집니다. 더 지속적인 운영을 원하면 키를 OS 비밀 저장소를 통해 주입하도록 구성하세요.

## 현재 동작과 한계

- GPT 요청은 서버에서 OpenAI Responses API로 전송되며 **API 키는 브라우저나 GitHub에 저장하지 않습니다**.
- 기본 모델은 `gpt-4.1-mini`이고 `OPENAI_MODEL`로 변경할 수 있습니다. 계정에서 이용 가능한 모델이어야 합니다.
- 각 역할의 최근 최대 10개 대화 메시지를 다음 API 호출 때 재전송합니다.
- 메모는 '저장 메모를 GPT에 전송' 체크박스를 켰을 때만 최대 12개 전송합니다. 민감한 내용을 체크 전에 검토하세요.
- 대화와 메모는 현재 브라우저 localStorage에만 저장됩니다. 외부 OpenAI API를 호출하기 때문에 데이터 처리 방식과 사용료를 확인하세요.
- 자동 동기화, SQLite 장기 기억, 클라우드 배포, VS Code 내 GPT 대화는 아직 구현되지 않았습니다.
- 이번 작업은 코드 변경이며, 로컬 실행·테스트 통과는 CI 결과로 확인해야 합니다.

## 문제 해결
- **OPENAI_API_KEY 관련 메시지**: 실행한 PowerShell 세션에 변수가 설정되어 있는지 확인합니다.
- **인증된 URL 메시지**: 터미널에 표시된 `?token=...`이 포함된 URL로 열어야 합니다.
- **API 한도 오류**: OpenAI Platform에서 Billing, Usage, Limits를 확인하세요.
- **모델 오류**: `OPENAI_MODEL`을 계정에서 이용 가능한 모델로 바꿉니다.
