document.addEventListener("DOMContentLoaded", function () {
    const savedId = sessionStorage.getItem("currentHostId");
    const savedNick = sessionStorage.getItem("currentHostNick");
    const profileName = document.getElementById("profile-name");

    // 세션 정보가 있으면 해당 유저 홈으로, 없으면 내 홈으로
    if (savedId && savedNick) {
        if (profileName) profileName.textContent = savedNick;
        goSearchMain(savedId, savedNick);
    } else {
        if (profileName) profileName.textContent = typeof loginUserNickname !== 'undefined' ? loginUserNickname : "사용자";
        loadPage("/home?ajax=true");
    }

    if (profileName) profileName.style.visibility = "visible";

    // 초기 위젯 및 알림 로드
    if (typeof loadRecentVisitors === "function") loadRecentVisitors();
    if (typeof checkIncomingFriendRequests === "function") checkIncomingFriendRequests();

    // 내 홈피라면 일촌 버튼 숨기기 (기본값)
    if (typeof checkFriendStatus === "function") {
        checkFriendStatus(typeof loginUserPk !== 'undefined' ? loginUserPk : null);
    }

    // 메뉴 및 탭 이벤트 등록
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
            fetch(`/search-users?keyword=${encodeURIComponent(keyword)}`)
                .then((res) => res.json())
                .then((data) => {
                    searchDropdown.innerHTML = "";
                    if (!data || data.length === 0) {
                        searchDropdown.innerHTML = `<div style="padding:15px; text-align:center; color:#c0b0a0; font-family:'Gaegu', cursive; font-size:14px;">결과가 없어요! 😢</div>`;
                    } else {
                        data.forEach((host) => {
                            const html = `
                                <div class="search-item" onclick="goSearchMain('${host.u_pk}','${host.u_nickname}')">
                                    <div class="search-item-title">${host.u_nickname} <span style="font-weight:normal; font-size:12px; color:#ff7675;">(${host.u_name})</span></div>
                                    <div class="search-item-desc">📧 ${host.u_email}</div>
                                </div>`;
                            searchDropdown.insertAdjacentHTML("beforeend", html);
                        });
                    }
                    searchDropdown.classList.remove("hidden");
                })
                .catch((err) => console.error("검색 에러:", err));
        }

        document.addEventListener("click", (e) => {
            if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
                searchDropdown.classList.add("hidden");
            }
        });
    }
});

// --- 전역 함수 ---

const pageRoutes = {
    "board.jsp": {initFunc: () => typeof loadGuestBoard === "function" && loadGuestBoard(), cssClass: ""},
    "visitor": {initFunc: () => typeof initVisitorLog === "function" && initVisitorLog(), cssClass: "is-visitor"},
    "diary.jsp": {initFunc: () => typeof loadDiary === "function" && loadDiary(), cssClass: ""},
    "photo.jsp": {initFunc: () => typeof loadPhoto === "function" && loadPhoto(), cssClass: ""},
    "friend.jsp": {initFunc: () => loadFriendList(), cssClass: ""} // 🚨 추가됨
};

function loadPage(url) {
    if (!url) return;
    const savedOwnerPk = sessionStorage.getItem("currentHostId");
    const targetOwnerPk = savedOwnerPk ? savedOwnerPk : (typeof loginUserPk !== 'undefined' ? loginUserPk : null);

    let fetchUrl = url;
    if (targetOwnerPk) {
        fetchUrl += (fetchUrl.includes('?') ? '&' : '?') + 'ownerPk=' + targetOwnerPk;
    }

    fetch(fetchUrl)
        .then((res) => {
            if (!res.ok) throw new Error(`HTTP 오류: ${res.status}`);
            return res.text();
        })
        .then((html) => {
            const content = document.getElementById("notebook-content");
            if (content) content.innerHTML = html;

            const notebook = document.getElementById("notebook");
            if (notebook) {
                notebook.classList.remove("is-visitor");
                for (const path in pageRoutes) {
                    if (url.includes(path)) {
                        const route = pageRoutes[path];
                        if (route.cssClass) notebook.classList.add(route.cssClass);
                        if (route.initFunc) route.initFunc();
                        break;
                    }
                }
            }
        })
        .catch(err => console.error("페이지 로드 실패:", err));
}

function goSearchMain(id, nick) {
    // 1. UI 정리
    const dropdown = document.getElementById("search-dropdown");
    const searchInput = document.getElementById("live-search-input");
    if (dropdown) dropdown.classList.add("hidden");
    if (searchInput) searchInput.value = "";

    // 2. 세션 저장
    sessionStorage.setItem("currentHostId", id);
    sessionStorage.setItem("currentHostNick", nick);

    // 3. 데이터 로드 및 UI 업데이트
    fetch(`/search-main?host_id=${id}`)
        .then((res) => res.json())
        .then((searchData) => {
            // 메뉴 불빛 처리
            document.querySelectorAll(".menu-item, .nb-tab").forEach((el) => el.classList.remove("active"));
            document.querySelectorAll(".menu-item, .nb-tab").forEach(el => {
                const src = el.getAttribute("data-src");
                if (src && src.includes("home")) el.classList.add("active");
            });

            // 프로필 텍스트 업데이트
            const profileName = document.querySelector(".profile-name");
            if (profileName) profileName.innerText = nick;

            // 🚨 핵심 수정: 옵셔널 체이닝(?.)을 사용하여 데이터가 null이어도 코드가 죽지 않게 보호함
            const titleElement = document.querySelector("#host-title");
            if (titleElement) {
                titleElement.innerText = searchData?.hompy_title || `📖 ${nick}님의 미니홈피`;
            }

            const stElement = document.querySelector("#status-text");
            if (stElement) {
                stElement.innerHTML = searchData?.st_message || "반갑습니다. 😊";
            }

            const stDate = document.querySelector(".status-since");
            if (stDate && searchData?.st_date) {
                stDate.innerHTML = `Since ${searchData.st_date.substring(0, 4)}`;
            }

            // 🚨 위에서 에러가 안 나야만 아래 로직들이 정상 작동함!
            if (typeof loadRecentVisitors === "function") loadRecentVisitors();

            // 일촌 버튼 상태 확인 함수 호출
            if (typeof checkFriendStatus === "function") checkFriendStatus(id);

            // 마지막으로 페이지 내용 불러오기
            loadPage(`/home?ajax=true&host_id=${id}`);
        })
        .catch((err) => {
            console.error("데이터 로드 에러:", err);
            // 에러 시에도 최소한 홈 화면은 띄워줌
            loadPage(`/home?ajax=true&host_id=${id}`);
        });
}

// ==========================================
// 조회수(Today/Total) 갱신 함수 (절대 지우면 안 됨!)
// ==========================================
function updateHitCount() {
    const savedOwnerPk = sessionStorage.getItem("currentHostId");
    const targetOwnerPk = savedOwnerPk ? savedOwnerPk : loginUserPk; // 로그인 변수 확인
    if (!targetOwnerPk) return;

    const noCache = new Date().getTime();
    fetch(`/visitor?reqType=hitCount&ownerPk=${targetOwnerPk}&t=${noCache}`)
        .then(res => {
            if (!res.ok) throw new Error("서버 에러");
            return res.json();
        })
        .then(data => {
            const todayEl = document.getElementById("v-today");
            const totalEl = document.getElementById("v-total");
            if (todayEl) todayEl.innerText = data.today;
            if (totalEl) totalEl.innerText = data.total;
        })
        .catch(err => console.error("조회수 갱신 실패:", err));
}
