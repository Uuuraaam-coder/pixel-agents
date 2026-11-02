# 치이카와 캐릭터 로컬 적용

선택한 소스: [heelee912/chiikawa-dots-pets](https://github.com/heelee912/chiikawa-dots-pets) — 비공식 팬 제작 스프라이트. 11명 캐릭터가 있으며 Codex pet v2 (8열 × 11행, 각 셀 192×208px) 규격입니다. 사용·재배포 조건을 확인하세요. 이 프로젝트는 스프라이트 파일을 GitHub에 포함하지 않습니다.

## Windows 설치

개인적으로 사용할 PC에서 포크 프로젝트의 작업 브랜치를 내려받은 뒤 PowerShell에서:

```powershell
.\scripts\install-personal-chiikawa.ps1
npm run build
node dist/cli.js --port 3100
```

PowerShell 실행정책에 따라 로컬 스크립트 실행이 차단될 수 있습니다. 이 경우 임의로 시스템 설정을 변경하지 말고 스크립트를 읽고 수동으로 아래 파일들을 배치하세요.

- `webview-ui/public/personal-characters/chiikawa.png`
- `webview-ui/public/personal-characters/hachiware.png`
- `webview-ui/public/personal-characters/usagi.png`
- `webview-ui/public/personal-characters/momonga.png`

해당 파일은 원작과 권리자의 승인 없이 재배포하지 마세요. 스프라이트가 없을 때는 앱에서 기본 이모지 캐릭터로 표시됩니다.

## 직원 배정
- 재무: 치이카와
- 일상: 하치와레
- 업무: 우사기
- 건강: 모몽가

현재 화면은 별도의 개인 오피스 패널에 스프라이트를 보여주며, 원본 Pixel Agents의 Canvas 엔진 캐릭터를 교체하지는 않습니다. 쉬기와 작업 상태의 기본 애니메이션이 적용되고, 추가 걷기/상호작용 동작은 후속 작업 대상입니다.

개인 PC에서만 사용하도록 설계한 기능입니다. 원본 저장소 및 배포물에 팬 제작 캐릭터 파일을 함께 올리지 않습니다.
