document.addEventListener("DOMContentLoaded", function () {
  // ⭐ 브라우저야, 너 아까 누구 홈피 보고 있었는지 메모한 거 있어?
  const savedId = sessionStorage.getItem("currentHostId");
  const savedNick = sessionStorage.getItem("currentHostNick");

  // 메모가 있으면 그 사람 홈피로 다시 돌려놓고, 없으면 내 홈피(main.jsp) 틀어줘
  if (savedId && savedNick) {
    goSearchMain(savedId, savedNick);
  } else {
    loadPage("main.jsp");
  }

  // 메뉴/탭 버튼 클릭 이벤트 등록
  document.querySelectorAll(".menu-item, .nb-tab").forEach((button) => {
    button.addEventListener("click", function () {
      const targetUrl = this.getAttribute("data-src");

      // 활성화 UI 처리
      document
        .querySelectorAll(".menu-item, .nb-tab")
        .forEach((el) => el.classList.remove("active"));

      // 왼쪽 메뉴와 상단 탭 모두 동기화 처리
      const correspondingTabs = document.querySelectorAll(
        `[data-src="${targetUrl}"]`,
      );
      correspondingTabs.forEach((el) => el.classList.add("active"));

      loadPage(targetUrl);
    });
  });

  // ==========================================
  // 2. 실시간 검색창 로직
  // ==========================================
  const searchInput = document.getElementById("live-search-input");
  const searchDropdown = document.getElementById("search-dropdown");

  // 혹시나 검색창이 없는 페이지에서 에러가 나는 것을 방지하는 안전장치
  if (searchInput && searchDropdown) {
    // 사용자가 타자를 칠 때마다 작동!
    searchInput.addEventListener("input", function () {
      const keyword = searchInput.value.trim();

      // 검색어가 다 지워지면 드롭다운 숨기기
      if (keyword === "") {
        searchDropdown.classList.add("hidden");
        searchDropdown.innerHTML = "";
        return;
      }

      // 검색어가 있으면 서버로 물어보러 가기
      renderDropdown(keyword);
    });

    // 서버에서 데이터 가져와서 화면에 그리는 함수
    function renderDropdown(keyword) {
      const targetUrl = `/search-users?keyword=${encodeURIComponent(keyword)}`;

      fetch(targetUrl)
        .then((response) => response.json())
        .then((showSearchR) => {
          searchDropdown.innerHTML = ""; // 그리기 전에 깔끔하게 도화지 비우기
          console.log(showSearchR);
          // 검색 결과가 0명일 때
          if (showSearchR.length === 0) {
            searchDropdown.innerHTML = `<div style="padding:15px; text-align:center; color:#c0b0a0; font-family:'Gaegu', cursive; font-size:14px;">결과가 없어요! 😢</div>`;
          } else {
            // 검색 결과가 있을 때 (예쁜 리스트 그리기)
            showSearchR.forEach((host) => {
              const searchHtmlTemp = `
                                <div class="search-item" onclick="goSearchMain('${host.u_id}','${host.u_nickname}')">
                                    <div class="search-item-title">${host.u_nickname} <span style="font-weight:normal; font-size:12px; color:#ff7675;">(${host.u_name})</span></div>
                                    <div class="search-item-desc">📧 ${host.u_email}</div>
                                </div>
                            `;
              searchDropdown.insertAdjacentHTML("beforeend", searchHtmlTemp);
            });
          }

          // 다 그렸으니 숨겨뒀던 드롭다운 짠! 하고 보여주기
          searchDropdown.classList.remove("hidden");
        })
        .catch((err) => console.error("검색 통신 에러:", err));
    }

    // 화면의 다른 곳을 클릭하면 센스있게 드롭다운 닫아주기
    document.addEventListener("click", function (e) {
      if (
        !searchInput.contains(e.target) &&
        !searchDropdown.contains(e.target)
      ) {
        searchDropdown.classList.add("hidden");
      }
    });
  }
});

// ==========================================
// 3. 공통 함수 및 라우터 설정 영역
// ==========================================

// ⭐ 라우터 맵: 어떤 페이지에서 어떤 함수/디자인을 쓸지 한 곳에 정리!
const pageRoutes = {
    "board.jsp": {
        initFunc: () => loadGuestBoard(),
        cssClass: ""               // 특별한 CSS가 필요 없으면 빈칸
    },
    "visitor.jsp": {
        initFunc: () => fetchVisitors(1),    // (나중에 만들 함수)
        cssClass: "is-visitor"     // 방문자 전용 CSS 클래스
    },
    "diary.jsp": {
        initFunc: () => loadDiary(),      // (나중에 만들 함수)
        cssClass: ""
    },
    "photo.jsp": {
        initFunc: () => loadPhoto(), // 사진첩 로드 후 실행할 초기화 함수 (필요시)
        cssClass: "is-photo"
        // 페이지가 늘어나면 여기에 한 줄씩만 추가하면 끝!
    }
}
// 화면(수첩 속지) 갈아끼우기 함수
function loadPage(url) {
  if (!url) return;

  fetch(url)
    .then((response) => {
        // 🔥 이게 핵심 (404, 500 잡기)
        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }
        return response.text();
    })
    .then(htmlData => {
      // 1. 도화지에 가져온 HTML 껍데기 넣기
      document.getElementById("notebook-content").innerHTML = htmlData;

      // 2. CSS 초기화
      const notebook = document.getElementById("notebook");
      notebook.classList.remove("is-visitor");

        // 3. 라우터 실행
        for (const path in pageRoutes) {
            if (url.includes(path)) {
                const route = pageRoutes[path];

                if (route.cssClass) {
                    notebook.classList.add(route.cssClass);
                }

                if (route.initFunc) {
                    route.initFunc();
                }

                break;
            }
        }
    })
      .catch(error => {
          console.error("페이지 로드 실패:", error);

          // 🔥 여기서 nb-error UI 띄우기
          document.getElementById('notebook-content').innerHTML = `
                <div class="nb-error">
                    😢 페이지를 불러올 수 없어요
                    <br>
                    <button onclick="loadPage('${url}')">다시 시도</button>
                </div>
            `;
      });
}


function goSearchMain(id, nick) {
  // 1. 클릭하는 순간 거추장스러운 검색 드롭다운 창 숨기기
  document.getElementById("search-dropdown").classList.add("hidden");
  document.getElementById("live-search-input").value = ""; // 검색어 비우기

  // ⭐ 새로고침 대비용 포스트잇 붙이기 (주소창 변경 없음!)
  sessionStorage.setItem("currentHostId", id);
  sessionStorage.setItem("currentHostNick", nick);

  const searchUrl = `/search-main?host_id=${id}`;
  fetch(searchUrl)
    .then((response) => response.json())
    .then((searchData) => {
      // 왼쪽 프로필 이름 변경
      document.querySelector(".profile-name").innerText = nick;
      // 상단 미니홈피 제목 변경 (예: 📖 김동민의 소소한 일상)
      const titleElement = document.querySelector("#host-title");
      if (titleElement) titleElement.innerText = `${searchData.hompy_title}`;

      // 왼쪽 프로필 상태메시지  변경
      const stElement = document.querySelector("#status-text");

      if (stElement) {
        stElement.innerHTML = `${searchData.st_message}`;
      }
      const stDate = document.querySelector(".status-since");
      if (searchData.st_date) {
        // "2026-03-31" 에서 앞 4글자("2026")만 자름!
        stDate.innerHTML = `${searchData.st_date.substring(0, 4)}`;
      }
    })
    .catch((error) => console.error("파도타기 데이터 로드 실패:", error));
}
