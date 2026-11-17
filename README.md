# skala-front

SKALA 과정에서 HTML, CSS, JavaScript를 실습한 결과물을 모아 둔 저장소다. 빌드 도구나 패키지 없이 정적 HTML 페이지, CSS, 순수 JavaScript로만 이루어져 있다. 1일차와 2일차의 개별 실습, 그리고 종합실습 4개가 들어 있다.

## 폴더 구성

| 경로 | 내용 |
|---|---|
| `html/index.html` | 허브 페이지. 소개, 수업 시간표, 휴일 계획, 여행 앨범, 회원가입 페이지로 연결된다 |
| `html/my*.html`, `html/signUp*.html` | 허브에서 연결되는 페이지 (자기소개, 강의 시간표, 휴일 일정표, 여행지, 회원가입과 결과) |
| `html/HTML_CSS_JS_DAY_1/Practice/` | 1일차 개별 실습 5개 |
| `html/HTML_CSS_JS_DAY_1/Comprehensive_Practice/` | 1일차 종합실습 2개 (회원가입, 제주도 여행지 소개) |
| `html/HTML_CSS_JS_DAY_2/Practice/` | 2일차 개별 실습 5개 |
| `html/HTML_CSS_JS_DAY_2/Comprehensive_Practice/` | 2일차 종합실습 2개 (상품 갤러리, 할 일 관리 앱) |
| `CSS/` | 스타일시트. `style.css`는 허브와 기본 페이지 공용이고 나머지는 종합실습별 파일이다 |
| `js/app.js`, `js/data.js` | 2일차 `04_dom_async_modules` 실습의 비동기·모듈 예제 |
| `js/todo/` | 할 일 관리 앱 모듈. `app.js`(렌더링), `storage.js`(localStorage 저장), `feedback.json`(완료율별 문구) |
| `media/` | 페이지에서 쓰는 이미지(jpg), 동영상(mp4), 음악(mp3) |

## 실습 목록

### 1일차 (`HTML_CSS_JS_DAY_1`)

- Practice: `01_web_workflow`(before, after 두 버전), `02_my_intro_page`(나의 소개 페이지), `03_shortcut_links`(새 탭 바로가기), `04_signUp`(회원가입), `05_myTrip`(나의 여행지)
- 종합실습 `01_signUp`: HTML5 자체 검증을 쓰는 회원가입 폼과, GET으로 넘어온 값을 `URLSearchParams`로 읽어 표로 보여 주는 결과 페이지
- 종합실습 `02_tripDestIntro`: 시맨틱 태그로 만든 제주도 여행 소개 원페이지. 명소 갤러리, 먹거리 슬라이더, 영상, 맨 위로 버튼이 있다

### 2일차 (`HTML_CSS_JS_DAY_2`)

- Practice: `01_css_styling`, `02_js_basic_programming`, `03_dom_event_practice`, `04_dom_async_modules`, `05_wrapup_quiz`
- 종합실습 `01_product_gallery`: 게임 판매 플랫폼 콘셉트의 반응형 상품 카드 갤러리. CSS 변수 기반 다크모드, 장바구니, 구매 모달이 있다
- 종합실습 `02_todo_app`: 월간 캘린더와 연동한 할 일 관리 앱. 필터, 인라인 수정, localStorage 저장, 완료율 피드백 문구가 있다

종합실습 폴더마다 `README.md`(구현 내용, 평가, 추가 구현)와 실행 화면을 담은 `screenshots/`가 있다.

## 실행 방법

대부분의 페이지는 HTML 파일을 브라우저로 바로 열면 된다. CSS, JS, 미디어를 `../../../../CSS/...` 같은 상대 경로로 불러오므로 폴더 구조를 바꾸지 않고 연다.

`type="module"` 스크립트를 쓰는 두 페이지(`02_todo_app.html`, `04_dom_async_modules.html`)는 로컬 서버로 열어야 한다. 할 일 앱은 `fetch`로 `js/todo/feedback.json`도 읽는다. 상대 경로가 저장소 루트까지 올라가므로 서버는 저장소 루트에서 띄운다.

```bash
cd skala-front
python3 -m http.server 8000
```

- 허브: http://localhost:8000/html/index.html
- 할 일 앱: http://localhost:8000/html/HTML_CSS_JS_DAY_2/Comprehensive_Practice/02_todo_app/02_todo_app.html

VS Code의 Live Server를 써도 된다(`02_todo_app/README.md` 참고).

## 참고

- 설치할 패키지는 없다. 브라우저와 로컬 서버(위 예시는 Python 내장 서버)만 있으면 된다.
- `.gitignore`는 macOS의 `.DS_Store`만 제외한다. `media/`의 동영상까지 모두 저장소에 들어 있어 클론 용량이 크다.
