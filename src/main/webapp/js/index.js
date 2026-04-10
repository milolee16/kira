document.addEventListener("DOMContentLoaded", function () {
    // 1. 파도타기 세션 정보 확인
    const savedId = sessionStorage.getItem("currentHostId");
    const savedNick = sessionStorage.getItem("currentHostNick");
    const profileName = document.getElementById("profile-name");

    // 2. 세션 정보가 있으면(파도타기 중) 해당 유저 홈으로, 없으면 내 홈으로
    if (savedId != null && savedNick != null) {
        if (profileName) profileName.textContent = savedNick;
        goSearchMain(savedId, savedNick);
    } else {
        if (profileName) profileName.textContent = typeof loginUserNickname !== 'undefined' ? loginUserNickname : "사용자";
        loadPage("/home?ajax=true");
    }

    if (profileName) profileName.style.visibility = "visible";

    // 🌟 [추가됨] '내 이름' 클릭 시 파도타기 세션 지우고 내 홈피로 복귀!
    const goMyHomeBtn = document.getElementById("goMyHome");
    if (goMyHomeBtn) {
        goMyHomeBtn.addEventListener("click", function() {
            sessionStorage.removeItem("currentHostId");
            sessionStorage.removeItem("currentHostNick");
            window.location.href = "/main"; // 메인 페이지 주소로 강제 이동 (새로고침 효과)
        });
    }

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
                                <div class="search-item" onclick="goSearchMain('${host.u_id}','${host.u_nickname}')">
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

// ==========================================
// --- 전역 함수 영역 ---
// ==========================================

const pageRoutes = {
    "board.jsp": {initFunc: () => typeof loadGuestBoard === "function" && loadGuestBoard(), cssClass: ""},
    "visitor": {initFunc: () => typeof initVisitorLog === "function" && initVisitorLog(), cssClass: "is-visitor"},
    "diary.jsp": {initFunc: () => typeof loadDiary === "function" && loadDiary(), cssClass: ""},
    "photo.jsp": {initFunc: () => typeof loadPhoto === "function" && loadPhoto(), cssClass: ""},
    "friend.jsp": {initFunc: () => loadFriendList(), cssClass: ""}
};

function loadPage(url) {
    if (!url) return;

    const savedOwnerId = sessionStorage.getItem("currentHostId");
    const targetOwnerId = savedOwnerId ? savedOwnerId : loginUserId;


    let fetchUrl = url + (url.includes('?') ? '&' : '?') + 'host_id=' + targetOwnerId ;

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
    // 1. UI 즉시 반응 (검색창 닫기)
    const dropdown = document.getElementById("search-dropdown");
    const searchInput = document.getElementById("live-search-input");
    if (dropdown) dropdown.classList.add("hidden");
    if (searchInput) searchInput.value = "";

    // 2. 세션에 새 주인 정보 저장 (가장 중요)
    sessionStorage.setItem("currentHostId", id);
    sessionStorage.setItem("currentHostNick", nick);

    // 3. 무조건 그 사람의 '홈' 화면으로 강제 이동
    loadPage(`/home?ajax=true`);

    // 4. 프로필 및 제목 데이터 동기화
    const searchUrl = `/search-main?host_id=${id}`;
    fetch(searchUrl)
        .then((response) => response.json())
        .then((searchData) => {


            // 5. 메뉴와 탭의 활성화 불빛(active)을 강제로 '홈'으로 옮기기
            document.querySelectorAll(".menu-item, .nb-tab").forEach((el) => el.classList.remove("active"));
            document.querySelectorAll(".menu-item, .nb-tab").forEach(el => {
                const src = el.getAttribute("data-src");
                if (src && src.includes("home")) {
                    el.classList.add("active");
                }
            });

            // [텍스트 업데이트]
            const profileName = document.querySelector(".profile-name");
            if (profileName) profileName.innerText = nick;

            const titleElement = document.querySelector("#host-title");
            if (titleElement) {
                titleElement.innerText = searchData.hompy_title || `📖 ${nick}님의 미니홈피`;
            }

            const stElement = document.querySelector("#status-text");
            if (stElement) {
                stElement.innerHTML = searchData.st_message || "반갑습니다. 😊";
            }

            const stDate = document.querySelector(".status-since");
            if (stDate && searchData.st_date) {
                stDate.innerHTML = `Since ${searchData.st_date.substring(0, 4)}`;
            }

            const latestGbElement = document.querySelector(".gb-title + .update-text");
            if (latestGbElement && searchData.latest_gb_content) {
                latestGbElement.innerText = searchData.latest_gb_content;
            }

            //프로필사진 업데이트  tk 수정 *********
            const profilePhoto = document.getElementById("profile-photo");
            profilePhoto.innerHTML = searchData.profileImgUrl
                ? `<img src="${searchData.profileImgUrl}" alt="프로필 사진" style="width:100%; height:100%; object-fit:cover; border-radius:5px;">`
                : `🌬️`;
            //프로필사진 업데이트 tk 수정***********


            // 부가 기능 로드
            if (typeof loadRecentVisitors === "function") loadRecentVisitors();
            if (typeof checkFriendStatus === "function") checkFriendStatus(id);

        })
        .catch((error) => console.error("파도타기 데이터 로드 실패:", error));
}

function updateHitCount() {
    const savedOwnerPk = sessionStorage.getItem("currentHostId");
    const targetOwnerPk = savedOwnerPk ? savedOwnerPk : loginUserPk;
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

// ==========================================
// --- 🎲 오늘의 문답 (QnA) 기능 영역 ---
// ==========================================

// 보기 모드 <-> 수정 모드 전환
function toggleEditQnA() {
    const viewMode = document.getElementById("qna-view-mode");
    const editMode = document.getElementById("qna-edit-mode");

    if (viewMode.classList.contains("qna-hidden")) {
        viewMode.classList.remove("qna-hidden");
        editMode.classList.add("qna-hidden");
    } else {
        viewMode.classList.add("qna-hidden");
        editMode.classList.remove("qna-hidden");
    }
}

// 답변 저장 (신규 작성 & 수정 공통 사용)
function saveQnA(mode) {
    const textareaId = mode === 'edit' ? "qna-edit-answer" : "qna-answer";
    const answerText = document.getElementById(textareaId).value.trim();

    if (!answerText) {
        alert("답변을 입력해 주세요! ✏️");
        return;
    }

    fetch('/update-qna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `answer=${encodeURIComponent(answerText)}`
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("문답이 저장되었습니다! 🍀");
                loadPage("/home?ajax=true"); // 텍스트 변경 확인을 위해 홈 리로드
            } else {
                alert("저장에 실패했어요 😢");
            }
        })
        .catch(err => console.error("QnA 저장 에러:", err));
}

// 다이어리에 추가 버튼 (기능 추가 시 구현)
function addQnAToDiary() {
    alert("다이어리 연동 기능은 준비 중입니다! 🛠️");
}