document.addEventListener("DOMContentLoaded", function () {
  // 1. 처음 켜졌을 때 메인 화면(main.jsp) 로드
  loadPage("main.jsp");

  // 2. 메뉴/탭 버튼 클릭 이벤트 등록
  document.querySelectorAll(".menu-item, .nb-tab").forEach((button) => {
    button.addEventListener("click", function () {
      const targetUrl = this.getAttribute("data-src");

      // 클릭한 탭 색상 활성화
      document
        .querySelectorAll(".menu-item, .nb-tab")
        .forEach((el) => el.classList.remove("active"));

      // 왼쪽 메뉴와 상단 탭 모두 동기화 처리 (선택사항)
      const correspondingTabs = document.querySelectorAll(
        `[data-src="${targetUrl}"]`,
      );
      correspondingTabs.forEach((el) => el.classList.add("active"));

      loadPage(targetUrl);
    });
  });
});

// ⭐ 1. 라우터 맵: 어떤 페이지에서 어떤 함수/디자인을 쓸지 한곳에 정리합니다.
// const pageRoutes = {
//   "board.jsp": {
//     initFunc: () => loadGuestBoard(),
//     cssClass: "", // 특별한 CSS가 필요 없으면 빈칸
//   },
//   "visitor.jsp": {
//     initFunc: () => fetchVisitors(1), // (나중에 만들 함수)
//     cssClass: "is-visitor", // 방문자 전용 CSS 클래스
//   },
//   "diary.jsp": {
//     initFunc: () => loadDiary(), // (나중에 만들 함수)
//     cssClass: "",
//   },
//   // 페이지가 늘어나면 여기에 한 줄씩만 추가하면 끝!
// };

// // 화면 갈아끼우기 함수
// function loadPage(url) {
//   if (!url) return;
//
//   fetch(url)
//     .then((response) => response.text())
//     .then((htmlData) => {
//       // 1. 도화지에 껍데기 넣기
//       document.getElementById("notebook-content").innerHTML = htmlData;
//
//       // 2. 수첩 CSS 초기화 (이전 페이지에서 붙은 특수 클래스 떼어내기)
//       const notebook = document.getElementById("notebook");
//       notebook.classList.remove("is-visitor"); // 나중에 특수 클래스가 늘어나면 배열로 관리해도 됩니다.
//
//       // ⭐ 3. 라우터 맵을 뒤져서 URL에 맞는 세팅을 자동으로 실행! (if문 실종사건!)
//       for (const path in pageRoutes) {
//         if (url.includes(path)) {
//           const route = pageRoutes[path]; // 일치하는 설정 꺼내기
//
//           // 특수 CSS 클래스가 정의되어 있다면 수첩에 붙여줌
//           if (route.cssClass) {
//             notebook.classList.add(route.cssClass);
//           }
//
//           // 실행할 초기화 함수가 있다면 실행
//           if (route.initFunc) {
//             route.initFunc();
//           }
//
//           break; // 찾았으니 반복문 종료
//         }
//       }
//     })
//     .catch((error) => console.error("페이지 로드 실패:", error));
// }

// 다이어리 내용을 비동기(fetch)로 불러와서 화면을 갈아끼우는 함수
function loadDiary(url = '/diary?ajax=true') {
  if (!url.includes('ajax=true')) {
    url += (url.includes('?') ? '&' : '?') + 'ajax=true';
  }

  fetch(url)
      .then(response => response.text())
      .then(html => {
        document.getElementById('notebook-content').innerHTML = html;

        // ★ 새로 추가된 스크롤 마법 ★
        // 만약 URL에 'd=' (날짜 파라미터)가 있어서 일기 목록이 열렸다면?
        if (url.includes('d=')) {
          // 화면에 뜬 다이어리 보드(목록)를 찾아서
          const board = document.querySelector('.diary-board');
          if (board) {
            // 그 위치로 부드럽게 스르륵 스크롤 이동!
            board.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      })
      .catch(error => console.error("다이어리 로드 실패:", error));
}