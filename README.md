# 한국소매틱심리연구소 복제 사이트

원본: https://www.somaheart.org/

원본의 실제 데스크톱 및 모바일 HTML/CSS를 보존한 정적 복제본입니다. 이미지와 글꼴은 `dist/assets/`에 저장됩니다. Wix 실행 코드 대신 작은 JavaScript로 내부 이동과 모바일 메뉴를 구현했습니다.

## 실행

Node.js 22 이상에서:

```sh
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다. 이 작업 폴더에 받은 Node 실행 파일을 이용하려면 PowerShell에서:

```powershell
& '../.tools/node-v22.14.0-win-x64/node.exe' server.mjs
```

## 수정 및 재생성

- `source/`: 원본 데스크톱 및 모바일 페이지 스냅샷
- `replica.js`: 메뉴, 앵커 이동
- `replica.css`: 접근성 및 모바일 메뉴 스타일
- `build.mjs`: 정적 페이지 생성
- `dist/`: 게시할 파일

```sh
npm run build
node check.mjs
```

새 이미지나 글꼴 URL을 추가했다면 `node build.mjs --download`로 먼저 받아주세요.

홈, 상담 예약, 교육, SE 전문가, 워크샵, 활동 연혁, 도서, 게시글 2개를 포함합니다. 600px 이하에서는 원본 모바일 레이아웃으로 이동합니다. 상담 면담지 및 교육 신청은 원본의 외부 신청 서비스를 연결합니다. Wix 회원 인증·게시글 반응·댓글의 서버 기능은 포함하지 않습니다. 콘텐츠는 원본을 복제한 시점의 내용입니다.
