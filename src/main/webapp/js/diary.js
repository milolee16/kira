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

// 화면 갈아끼우기 함수
function loadPage(url) {
  if (!url) return;

  fetch(url)
    .then((response) => response.text())
    .then((htmlData) => {
      // 1. 도화지에 껍데기 넣기
      document.getElementById("notebook-content").innerHTML = htmlData;

      // 2. 수첩 CSS 초기화 (이전 페이지에서 붙은 특수 클래스 떼어내기)
      const notebook = document.getElementById("notebook");
      notebook.classList.remove("is-visitor"); // 나중에 특수 클래스가 늘어나면 배열로 관리해도 됩니다.

      // ⭐ 3. 라우터 맵을 뒤져서 URL에 맞는 세팅을 자동으로 실행! (if문 실종사건!)
      for (const path in pageRoutes) {
        if (url.includes(path)) {
          const route = pageRoutes[path]; // 일치하는 설정 꺼내기

          // 특수 CSS 클래스가 정의되어 있다면 수첩에 붙여줌
          if (route.cssClass) {
            notebook.classList.add(route.cssClass);
          }

          // 실행할 초기화 함수가 있다면 실행
          if (route.initFunc) {
            route.initFunc();
          }

          break; // 찾았으니 반복문 종료
        }
      }
    })
    .catch((error) => console.error("페이지 로드 실패:", error));
}

// 다이어리 내용을 비동기(fetch)로 불러와서 화면을 갈아끼우는 함수
function loadDiary(url = "/diary?ajax=true") {
  if (!url.includes("ajax=true")) {
    url += (url.includes("?") ? "&" : "?") + "ajax=true";
  }

  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("notebook-content").innerHTML = html;

      // ★ 새로 추가된 스크롤 마법 ★
      // 만약 URL에 'd=' (날짜 파라미터)가 있어서 일기 목록이 열렸다면?
      if (url.includes("d=")) {
        // 화면에 뜬 다이어리 보드(목록)를 찾아서
        const board = document.querySelector(".diary-board");
        if (board) {
          // 그 위치로 부드럽게 스르륵 스크롤 이동!
          board.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    })
    .catch((error) => console.error("다이어리 로드 실패:", error));
}

// 일기 작성 폼 데이터를 fetch로 서버에 몰래 보내는 함수
function submitDiaryForm() {
    // 1. 괄호 안을 비우고, 폼을 ID로 직접 낚아챕니다!
    const form = document.getElementById('diaryWriteForm');

    if (!form) {
        console.error("폼을 찾을 수 없습니다! JSP에 id='diaryWriteForm'이 있는지 확인하세요.");
        return;
    }

    // 2. 폼 안에 적힌 데이터(제목, 내용, 날짜 등)를 싹 긁어모음
    const formData = new FormData(form);
    const params = new URLSearchParams(formData); // 자바가 읽기 편하게 변환

    // 3. 서버의 'diary-write' 주소로 데이터를 슝 보냄
    fetch('diary-write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: params
    })
        .then(response => response.text())
        .then(data => {
            // 4. 작성이 끝났으면, 방금 글을 쓴 그 날짜의 일기 목록으로 화면을 쓱 바꿔줌
            const y = formData.get('d_year');
            const m = formData.get('d_month');
            const d = formData.get('d_date');

            loadDiary(`diary?y=${y}&m=${m}&d=${d}`);
        })
        .catch(error => console.error("일기 등록 통신 실패:", error));
}