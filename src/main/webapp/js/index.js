document.addEventListener("DOMContentLoaded", function () {
    const savedId = sessionStorage.getItem("currentHostId");
    const savedNick = sessionStorage.getItem("currentHostNick");

    if (savedId && savedNick) {
        goSearchMain(savedId, savedNick);
    } else {
        loadPage("main.jsp"); // 기본 화면 로드

        // 🚨 [핵심 추가] 초기 진입 시에도 우측 위젯을 즉시 불러오도록 방아쇠를 당긴다.
        if (typeof loadRecentVisitors === "function") {
            loadRecentVisitors();
        }
    }

    // ... (이하 기존 이벤트 등록 코드 동일)

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
        cssClass: "",
    },
    // [핵심 수정] URL이 '/visitor?ajax=true' 이므로 'visitor'라는 단어만 잡도록 수정
    "visitor": {
        initFunc: () => initVisitorLog(),
        cssClass: "is-visitor",
    },
    "diary.jsp": {
        initFunc: () => loadDiary(),
        cssClass: "",
    },
};

// 화면(수첩 속지) 갈아끼우기 함수
function loadPage(url) {
    if (!url) return;

    // =====================================================================
    // 💡 [안전한 개조] 다른 코드에 피해를 주지 않고 URL에 주인 PK만 슬쩍 붙인다.
    // =====================================================================
    const savedOwnerPk = sessionStorage.getItem("currentHostId");

    // 파도타기 중이라 세션스토리지에 남의 PK가 있으면 그걸 쓰고,
    // 없으면 내 미니홈피니까 내 PK(전역변수)를 쓴다.
    const targetOwnerPk = savedOwnerPk ? savedOwnerPk : loginUserPk;

    let fetchUrl = url;
    if (targetOwnerPk) {
        // URL에 이미 ? 가 있으면 & 로 연결하고, 없으면 ? 로 연결해서 파라미터를 붙인다.
        fetchUrl += (fetchUrl.includes('?') ? '&' : '?') + 'ownerPk=' + targetOwnerPk;
    }
    // =====================================================================

    // 원래 url 대신, 꼬리표가 붙은 fetchUrl 로 통신한다!
    fetch(fetchUrl)
        .then((response) => {
            // 🔥 이게 핵심 (404, 500 잡기)
            if (!response.ok) {
                throw new Error(`HTTP 오류: ${response.status}`);
            }
            return response.text();
        })
        .then((htmlData) => {
            // 1. 도화지에 가져온 HTML 껍데기 넣기
            document.getElementById("notebook-content").innerHTML = htmlData;

            // 2. CSS 초기화
            const notebook = document.getElementById("notebook");
            notebook.classList.remove("is-visitor");

            // 3. 라우터 실행 (여기는 건드리지 않음. 완벽함)
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

// 파도타기 함수
function goSearchMain(id, nick) {
    document.getElementById("search-dropdown").classList.add("hidden");
    document.getElementById("live-search-input").value = "";

    sessionStorage.setItem("currentHostId", id);
    sessionStorage.setItem("currentHostNick", nick);

    const searchUrl = `/search-main?host_id=${id}`;
    fetch(searchUrl)
        .then((response) => response.json())
        .then((searchData) => {
            // [방어막 적용] searchData가 null일 경우를 완벽하게 대비한다.
            const hostTitle = searchData && searchData.hompy_title ? searchData.hompy_title : `${nick}님의 미니홈피`;
            const stMsg = searchData && searchData.st_message ? searchData.st_message : "반갑습니다!";
            const stYear = (searchData && searchData.st_date) ? searchData.st_date.substring(0, 4) : "2026";

            const profileName = document.querySelector(".profile-name");
            if (profileName) profileName.innerText = nick;

            const titleElement = document.querySelector("#host-title");
            if (titleElement) titleElement.innerText = `📖 ${hostTitle}`;

            const stElement = document.querySelector("#status-text");
            if (stElement) stElement.innerHTML = stMsg;

            const stDate = document.querySelector(".status-since");
            if (stDate) stDate.innerHTML = stYear;

            // 방아쇠 (우측 방문자 위젯 갱신 및 자동 발도장)
            if (typeof loadRecentVisitors === "function") {
                loadRecentVisitors();
            }

            // 홈 탭으로 화면 갱신
            const homeMenuItem = document.querySelector('.menu-item');
            if (homeMenuItem) {
                const homeUrl = homeMenuItem.getAttribute('data-src');
                loadPage(homeUrl);
            }
        })
        .catch((error) => {
            console.error("파도타기 데이터 로드 실패:", error);
            loadPage("main.jsp"); // 에러 나도 화면은 넘겨줌
        });
}