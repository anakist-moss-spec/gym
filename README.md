# 운동일지

빌드 도구 없이 파일만 나눈 웹앱입니다. 폴더째 GitHub Pages에 올리면 동작합니다.

## 구조
- `index.html` 화면 뼈대와 스크립트 로드 순서
- `css/style.css` 디자인
- `js/catalog.js` 부위와 기본 운동 목록 (데이터)
- `js/util.js` 공통 도구 (DOM, 날짜, 표시 형식)
- `js/store.js` 기록 상태, 저장, 데이터 버전(migrate)
- `js/views/log.js` 기록 화면 / `trend.js` 추이 / `history.js` 내역, 내보내기, 백업
- `js/main.js` 탭 전환, 시작
- `manifest.json`, `icons/` 홈 화면 설치 정보

## 수정 방법
- 운동 추가: `js/catalog.js`의 BASE에 이름 추가
- 기록 형식을 바꿀 때: `js/store.js`의 DATA_VERSION을 올리고 migrate()에 변환 코드를 추가 (기존 기록 보호)
- 배포할 때마다: `index.html`의 `?v=2`를 `?v=3`처럼 올리기 (폰이 옛 파일을 쓰는 것을 막음)
- 스크립트는 전역 변수를 공유하므로 `index.html`의 로드 순서를 유지할 것
