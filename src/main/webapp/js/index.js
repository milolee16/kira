document.addEventListener("DOMContentLoaded", function () {

    // 1. 파도타기 세션 정보 확인
    //sessionStorage 에서 현재 방문한 페이지의 hostid와 nick 을 가져옴
    const savedId = sessionStorage.getItem("currentHostId");
    const savedNick = sessionStorage.getItem("currentHostNick");
    //프로필 사진 밑 닉네임을 가져옴
    const profileName = document.getElementById("profile-name");

    // 2. 세션 정보가 있으면(파도타기 중) 해당 유저 홈으로, 없으면 내 홈으로
    //만약 sessionStorage가 비어있다면 로그인한 자기 자신의 페이지 이므로 loadPage함수를, 비어있지않다면 상대방의 페이지를 열어줘야하기 때문에 goSearchMain함수를 실행해줌

    if (savedId != null && savedNick != null) {
        if (profileName) profileName.textContent = savedNick;
        goSearchMain(savedId, savedNick);
    } else {
        if (profileName)
            profileName.textContent =
                typeof loginUserNickname !== "undefined" ? loginUserNickname : "사용자";
        loadPage("/home?ajax=true");
    }
    //만약 닉네임이 있다면 보이게 해준다는 의미?
    // 닉네임을 담는 HTML 태그가 존재한다면, 숨겨뒀던 태그를 화면에 보여줌
    if (profileName) profileName.style.visibility = "visible";


    const goMyHomeBtn = document.getElementById("goMyHome");
    //버튼이 클릭되면 일단 sessionStorage 안에 있는 정보들을 초기화 해준다
    if (goMyHomeBtn) {
        goMyHomeBtn.addEventListener("click", function () {
            // 🚨 핵심: 남의 집 ID 기억을 삭제한다!
            sessionStorage.removeItem("currentHostId");
            sessionStorage.removeItem("currentHostNick");


            // 내 닉네임으로 다시 세팅
            const profileName = document.getElementById("profile-name");
            if (profileName) profileName.textContent = loginUserNickname;


            // 내 홈 화면 로드
            loadPage("/home?ajax=true");

            // 일촌 버튼 숨기기 (내 홈피니까)
            if (typeof checkFriendStatus === "function") {
                checkFriendStatus(loginUserId);
            }
        });
    }


    // 초기 위젯 및 알림 로드
    if (typeof loadRecentVisitors === "function") loadRecentVisitors();
    if (typeof checkIncomingFriendRequests === "function")
        checkIncomingFriendRequests();

    // 내 홈피라면 일촌 버튼 숨기기 (기본값)
    if (typeof checkFriendStatus === "function") {
        checkFriendStatus(typeof loginUserId !== "undefined" ? loginUserId : null);
    }

    // 메뉴 및 탭 이벤트 등록
    document.querySelectorAll(".menu-item, .nb-tab").forEach((button) => {
        button.addEventListener("click", function (e) {
            //"클릭 이벤트 전파 막기"**입니다. 내가 버튼을 클릭했을 때, 그 클릭 충격파가 버튼을 감싸고 있는 부모 태그들로 퍼져나가는 것(버블링)을 차단합니다. 엉뚱한 부모 태그의 클릭 이벤트가 같이 실행되는 것을 막아주는 방어 코드입니다.
            e.stopPropagation();
            //내가 방금 누른 바로 그 버튼(this)에 적혀있는 data-src 값을 가져와서 targetUrl이라는 상수에 저장합니다. (예: data-src="diary.jsp" 였다면 "diary.jsp"를 가져옵니다. 즉, 이동할 목적지를 파악하는 단계입니다.)
            const targetUrl = this.getAttribute("data-src");
            //기존 불빛 끄기(초기화)"**입니다. 새로운 메뉴에 불을 켜기 전에, 화면에 있는 모든 메뉴와 탭을 다시 다 찾아서 기존에 켜져 있던 active 클래스(선택된 디자인)를 전부 지워버립니다.
            document
                .querySelectorAll(".menu-item, .nb-tab")
                .forEach((el) => el.classList.remove("active"));
            //짝꿍 찾기"**입니다. 방금 클릭한 버튼과 목적지(data-src)가 똑같은 모든 태그를 찾아냅니다. 예를 들어 좌측 메뉴의 '다이어리'를 눌렀다면, 상단 탭에 있는 '다이어리' 탭도 목적지가 같을 테니 둘 다 찾아오게 됩니다.
            const correspondingTabs = document.querySelectorAll(
                `[data-src="${targetUrl}"]`,
            );
            //내가 클릭한 버튼에 active를 달아주어 효과주기
            correspondingTabs.forEach((el) => el.classList.add("active"));
            //targetUrl로 loadPage 함수 실행
            loadPage(targetUrl);
        });
    });

    // 실시간 검색창 로직
    const searchInput = document.getElementById("live-search-input");
    const searchDropdown = document.getElementById("search-dropdown");
    //둘다 존재한다면 input 이라는 이벤트가 발생했을때 함수를 실행

    if (searchInput && searchDropdown) {
        searchInput.addEventListener("input", function () {
            //input값을 keyword로 저장하고
            const keyword = searchInput.value.trim();
            //만약 암것도 없다면 dropdown창을 안보이게 해줌
            if (keyword === "") {
                searchDropdown.classList.add("hidden");
                searchDropdown.innerHTML = "";
                return;
            }
            //rederDropdown 함수 실행
            renderDropdown(keyword);
        });
        //위에서 받은 keyword값을 fetch 를 이용해 파라미터로 전송
        function renderDropdown(keyword) {
            fetch(`/search-users?keyword=${encodeURIComponent(keyword)}`)
                .then((res) => res.json())
                .then((data) => {
                    //답변 받았으면 dropdown 초기화
                    searchDropdown.innerHTML = "";
                    if (!data || data.length === 0) {
                        //답변받앗는데 내용이 없다면 이 결과를 보여줌
                        searchDropdown.innerHTML = `<div style="padding:15px; text-align:center; color:#c0b0a0; font-family:'Gaegu', cursive; font-size:14px;">결과가 없어요! 😢</div>`;
                    } else {
                        //답변받았고 내용도 있다면 foreach를 사용해 하나하나 씩 보여줌
                        data.forEach((host) => {
                            //보여준 리스트 중 하나를 클릭하면 goSearchMain을 실시해 그 사람의 main을 열어줌
                            const html = `
                                <div class="search-item" onclick="goSearchMain('${host.u_id}','${host.u_nickname}')">
                                    <div class="search-item-title">${host.u_nickname} <span style="font-weight:normal; font-size:12px; color:#ff7675;">(${host.u_name})</span></div>
                                    <div class="search-item-desc">📧 ${host.u_email}</div>
                                </div>`;
                            searchDropdown.insertAdjacentHTML("beforeend", html);
                        });
                    }
                    //그 다음엔 다시 없애줌
                    searchDropdown.classList.remove("hidden");
                })
                .catch((err) => console.error("검색 에러:", err));
        }

        document.addEventListener("click", (e) => {
            if (
                //해설: 여기가 핵심 로직입니다! e.target은 방금 마우스로 정확히 콕 찍은 바로 그 태그를 말합니다.
                // !searchInput.contains(e.target): 방금 클릭한 곳이 '검색어 입력창' 안쪽이 아니고 
                // !searchDropdown.contains(e.target): 방금 클릭한 곳이 '검색 결과 드롭다운 창' 안쪽도 아니라면!
                // 의미: "유저가 검색을 하려는 것도 아니고, 검색 결과를 누르려는 것도 아니네? 그냥 엉뚱한 바탕화면을 눌렀구나!" 하고 판단하는 조건문입니다.
                !searchInput.contains(e.target) &&
                !searchDropdown.contains(e.target)
            ) {
                searchDropdown.classList.add("hidden");
            }
        });
    }

    // 테마(스킨) 변경 코드
    const savedTheme = localStorage.getItem("myHompyTheme");
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }
    const themeBtns = document.querySelectorAll(".theme-btn");
    themeBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            const newTheme = this.getAttribute("data-theme");
            document.body.classList.remove("theme-pink", "theme-mint", "theme-purple");
            if (newTheme !== "theme-pink") {
                document.body.classList.add(newTheme);
            }
            localStorage.setItem("myHompyTheme", newTheme);
        });
    });
});

// ==========================================
// --- 전역 함수 영역 ---
// ==========================================

const pageRoutes = {
    "board.jsp": {
        initFunc: () => typeof loadGuestBoard === "function" && loadGuestBoard(),
        cssClass: "",
    },
    visitor: {
        initFunc: () => typeof initVisitorLog === "function" && initVisitorLog(),
        cssClass: "is-visitor",
    },
    "diary.jsp": {
        initFunc: () => typeof loadDiary === "function" && loadDiary(),
        cssClass: "",
    },
    "photo.jsp": {
        initFunc: () => typeof loadPhoto === "function" && loadPhoto(),
        cssClass: "",
    },
    "friend.jsp": {initFunc: () => loadFriendList(), cssClass: ""},
    // 🚨 [여기에 핵심 추가] 쪽지함 메뉴를 클릭했을 때 initMessage()를 실행하도록 라우터에 등록한다.
    "message.jsp": {
        initFunc: () => typeof initMessage === "function" && initMessage(),
        cssClass: "",
    }

};

function loadPage(url) {
    if (!url) return;

    const savedOwnerId = sessionStorage.getItem("currentHostId");
    const targetOwnerId = savedOwnerId ? savedOwnerId : loginUserId;

    let fetchUrl =
        url + (url.includes("?") ? "&" : "?") + "host_id=" + targetOwnerId;

    fetch(fetchUrl)
        .then((res) => {
            if (!res.ok) throw new Error(`HTTP 오류: ${res.status}`);
            return res.text();
        })
        .then((html) => {
            const content = document.getElementById("notebook-content");
            if (content) content.innerHTML = html;

            if (typeof checkStatusPermission === "function") {
                // 혹시 모를 숫자/문자 타입 불일치를 막기 위해 String으로 감싸서 보냅니다.
                checkStatusPermission(String(targetOwnerId));
            }

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
        .catch((err) => console.error("페이지 로드 실패:", err));
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
            document
                .querySelectorAll(".menu-item, .nb-tab")
                .forEach((el) => el.classList.remove("active"));
            document.querySelectorAll(".menu-item, .nb-tab").forEach((el) => {
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
                titleElement.innerText =
                    searchData.hompy_title || `📖 ${nick}님의 미니홈피`;
            }

            const stElement = document.querySelector("#status-text");
            if (stElement) {
                stElement.innerHTML = searchData.st_message || "반갑습니다. 😊";
            }

            const stDate = document.querySelector(".status-since");
            if (stDate && searchData.st_date) {
                stDate.innerHTML = `Since ${searchData.st_date.substring(0, 4)}`;
            }

            const latestGbElement = document.querySelector(
                ".gb-title + .update-text",
            );
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
            if (typeof checkStatusPermission === "function") checkStatusPermission(id);
        })
        .catch((error) => console.error("파도타기 데이터 로드 실패:", error));
}

function updateHitCount() {
    const savedOwnerPk = sessionStorage.getItem("currentHostId");
    const targetOwnerPk = savedOwnerPk ? savedOwnerPk : loginUserId;
    if (!targetOwnerPk) return;

    const noCache = new Date().getTime();
    fetch(`/visitor?reqType=hitCount&ownerPk=${targetOwnerPk}&t=${noCache}`)
        .then((res) => {
            if (!res.ok) throw new Error("서버 에러");
            return res.json();
        })
        .then((data) => {
            const todayEl = document.getElementById("v-today");
            const totalEl = document.getElementById("v-total");
            if (todayEl) todayEl.innerText = data.today;
            if (totalEl) totalEl.innerText = data.total;
        })
        .catch((err) => console.error("조회수 갱신 실패:", err));
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
    const textareaId = mode === "edit" ? "qna-edit-answer" : "qna-answer";
    const answerText = document.getElementById(textareaId).value.trim();

    if (!answerText) {
        alert("답변을 입력해 주세요! ✏️");
        return;
    }

    fetch("/update-qna", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: `answer=${encodeURIComponent(answerText)}`,
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                alert("문답이 저장되었습니다! 🍀");
                loadPage("/home?ajax=true"); // 텍스트 변경 확인을 위해 홈 리로드
            } else {
                alert("저장에 실패했어요 😢");
            }
        })
        .catch((err) => console.error("QnA 저장 에러:", err));
}

// 다이어리에 추가 버튼 (기능 추가 시 구현)
function addQnAToDiary() {
    alert("다이어리 연동 기능은 준비 중입니다! 🛠️");
}