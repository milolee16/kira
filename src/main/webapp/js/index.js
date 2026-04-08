document.addEventListener("DOMContentLoaded", function () {
    const savedId = sessionStorage.getItem("currentHostId");
    const savedNick = sessionStorage.getItem("currentHostNick");

    if (savedId && savedNick) {
        goSearchMain(savedId, savedNick);
    } else {
        loadPage("/home?ajax=true");
    }

    // 초기 진입 시 우측 위젯 불러오기
    if (typeof loadRecentVisitors === "function") {
        loadRecentVisitors();
    }

    // 메뉴/탭 버튼 클릭 이벤트 등록
    document.querySelectorAll(".menu-item, .nb-tab").forEach((button) => {
        button.addEventListener("click", function () {
            const targetUrl = this.getAttribute("data-src");
            document.querySelectorAll(".menu-item, .nb-tab").forEach((el) => el.classList.remove("active"));
            const correspondingTabs = document.querySelectorAll(`[data-src="${targetUrl}"]`);
            correspondingTabs.forEach((el) => el.classList.add("active"));
            loadPage(targetUrl);
        });
    });

    // 실시간 검색창 로직
    const searchInput = document.getElementById("live-search-input");
    const searchDropdown = document.getElementById("search-dropdown");

    if (searchInput && searchDropdown) {
        searchInput.addEventListener("input", function () {
            const keyword = searchInput.value.trim();
            if (keyword === "") {
                searchDropdown.classList.add("hidden");
                searchDropdown.innerHTML = "";
                return;
            }
            renderDropdown(keyword);
        });

        function renderDropdown(keyword) {
            const targetUrl = `/search-users?keyword=${encodeURIComponent(keyword)}`;
            fetch(targetUrl)
                .then((response) => response.json())
                .then((showSearchR) => {
                    searchDropdown.innerHTML = "";
                    if (showSearchR.length === 0) {
                        searchDropdown.innerHTML = `<div style="padding:15px; text-align:center; color:#c0b0a0; font-family:'Gaegu', cursive; font-size:14px;">결과가 없어요! 😢</div>`;
                    } else {
                        showSearchR.forEach((host) => {
                            const searchHtmlTemp = `
                                <div class="search-item" onclick="goSearchMain('${host.u_id}','${host.u_nickname}')">
                                    <div class="search-item-title">${host.u_nickname} <span style="font-weight:normal; font-size:12px; color:#ff7675;">(${host.u_name})</span></div>
                                    <div class="search-item-desc">📧 ${host.u_email}</div>
                                </div>`;
                            searchDropdown.insertAdjacentHTML("beforeend", searchHtmlTemp);
                        });
                    }
                    searchDropdown.classList.remove("hidden");
                })
                .catch((err) => console.error("검색 통신 에러:", err));
        }

        document.addEventListener("click", function (e) {
            if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
                searchDropdown.classList.add("hidden");
            }
        });
    }
}); // <--- DOMContentLoaded 는 여기서 닫혀야 합니다.

// --- 여기서부터는 전역 함수들 ---

const pageRoutes = {
    "board.jsp": { initFunc: () => loadGuestBoard(), cssClass: "" },
    "visitor": { initFunc: () => initVisitorLog(), cssClass: "is-visitor" },
    "diary.jsp": { initFunc: () => loadDiary(), cssClass: "" },
};

function loadPage(url) {
    if (!url) return;
    const savedOwnerPk = sessionStorage.getItem("currentHostId");
    const targetOwnerPk = savedOwnerPk ? savedOwnerPk : loginUserPk;

    let fetchUrl = url;
    if (targetOwnerPk) {
        fetchUrl += (fetchUrl.includes('?') ? '&' : '?') + 'ownerPk=' + targetOwnerPk;
    }

    fetch(fetchUrl)
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP 오류: ${response.status}`);
            return response.text();
        })
        .then((htmlData) => {
            document.getElementById("notebook-content").innerHTML = htmlData;
            const notebook = document.getElementById("notebook");
            notebook.classList.remove("is-visitor");

            for (const path in pageRoutes) {
                if (url.includes(path)) {
                    const route = pageRoutes[path];
                    if (route.cssClass) notebook.classList.add(route.cssClass);
                    if (route.initFunc) route.initFunc();
                    break;
                }
            }
        })
        .catch(error => {
            console.error("페이지 로드 실패:", error);
            document.getElementById('notebook-content').innerHTML = `<div class="nb-error">😢 페이지를 불러올 수 없어요<br><button onclick="loadPage('${url}')">다시 시도</button></div>`;
        });
}

function goSearchMain(id, nick) {
    document.getElementById("search-dropdown").classList.add("hidden");
    document.getElementById("live-search-input").value = "";

    sessionStorage.setItem("currentHostId", id);
    sessionStorage.setItem("currentHostNick", nick);

    const searchUrl = `/search-main?host_id=${id}`;
    fetch(searchUrl)
        .then((response) => response.json())
        .then((searchData) => {
            // UI 초기화 및 홈 탭 활성화
            document.querySelectorAll(".menu-item, .nb-tab").forEach((el) => el.classList.remove("active"));
            document.querySelectorAll(".menu-item, .nb-tab").forEach(el => {
                const src = el.getAttribute("data-src");
                if (src && src.includes("home")) el.classList.add("active");
            });

            // 프로필 정보 업데이트
            document.querySelector(".profile-name").innerText = nick;

            const titleElement = document.querySelector("#host-title");
            if (titleElement) titleElement.innerText = `📖 ${searchData.hompy_title}`;

            const stElement = document.querySelector("#status-text");
            if (stElement) stElement.innerHTML = `${searchData.st_message}`;

            const stDate = document.querySelector(".status-since");
            if (stDate && searchData.st_date) {
                stDate.innerHTML = `Since ${searchData.st_date.substring(0, 4)}`;
            }

            // 우측 방문자 위젯 갱신
            if (typeof loadRecentVisitors === "function") {
                loadRecentVisitors();
            }

            // 화면을 해당 유저의 홈으로 이동
            loadPage(`/home?ajax=true&host_id=${id}`);
        })
        .catch((error) => {
            console.error("파도타기 데이터 로드 실패:", error);
        });
}

function updateHitCount() {
    const savedOwnerPk = sessionStorage.getItem("currentHostId");
    const targetOwnerPk = savedOwnerPk ? savedOwnerPk : loginUserPk;
    if (!targetOwnerPk) return;

    const noCache = new Date().getTime();
    fetch(`/visitor?reqType=hitCount&ownerPk=${targetOwnerPk}&t=${noCache}`)
        .then(res => res.json())
        .then(data => {
            const todayEl = document.getElementById("v-today");
            const totalEl = document.getElementById("v-total");
            if (todayEl) todayEl.innerText = data.today;
            if (totalEl) totalEl.innerText = data.total;
        })
        .catch(err => console.error("조회수 갱신 실패:", err));
}