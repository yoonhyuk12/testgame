# 헬리콥터 게임

스페이스바로 조작하는 헬리콥터 게임입니다!

## 🎮 바로 플레이하기

### 방법 1: GitHub Pages (권장)
1. GitHub 저장소 설정으로 이동
2. 왼쪽 메뉴에서 **Pages** 클릭
3. Source에서 브랜치 선택: `claude/helicopter-game-dev-011CUL89Afjaz4e9Ea6tVV5N`
4. 루트 폴더 선택
5. Save 클릭
6. 몇 분 후 생성된 URL로 접속

### 방법 2: HTML Preview (즉시 테스트)
다음 링크를 클릭하면 바로 게임을 플레이할 수 있습니다:

**HTMLPreview.github.io 사용:**
```
https://htmlpreview.github.io/?https://github.com/yoonhyuk12/testgame/blob/claude/helicopter-game-dev-011CUL89Afjaz4e9Ea6tVV5N/index.html
```

**Raw.githack.com 사용:**
```
https://raw.githack.com/yoonhyuk12/testgame/claude/helicopter-game-dev-011CUL89Afjaz4e9Ea6tVV5N/index.html
```

## 🎯 게임 방법
- **스페이스바**: 헬리콥터를 위로 띄움
- **스페이스바 떼기**: 중력으로 떨어짐
- 위아래 장애물(종유석/석순)을 피하세요!
- 점수를 최대한 높이세요!

## 🛠️ 로컬 실행
```bash
# 프로젝트 폴더에서
python3 -m http.server 8000

# 브라우저에서 접속
http://localhost:8000
```

또는 `index.html` 파일을 브라우저에서 직접 열기

## 📁 파일 구조
- `index.html` - 게임 UI 및 구조
- `style.css` - 스타일링 및 디자인
- `game.js` - 게임 로직 (물리 엔진, 충돌 감지)
