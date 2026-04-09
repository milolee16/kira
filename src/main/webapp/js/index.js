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

// (이후 checkFriendStatus, handleFriendAction 등의 함수는 기존과 동일하게 유지)
// ==========================================
// 5. 일촌 상태 확인 (버튼 UI 자동 변경)
// ==========================================
function checkFriendStatus(targetPk) {
    const btn = document.getElementById("btn-friend-action");
    if (!btn) return;
    // 🚨 [강력한 방어막] targetPk가 내 PK와 같거나, 아예 없으면 무조건 숨김
    if (!targetPk || targetPk === loginUserPk || targetPk === "" || targetPk === "null") {
        btn.style.display = "none";
        return;
    }

    // 추적기 발동!
    console.log(`[일촌 확인] 타겟 PK: ${targetPk} 서버로 요청 보냄...`);

    fetch(`/friendview?action=status&targetPk=${targetPk}`)
        .then(res => {
            console.log(`[일촌 확인] 서버 응답 코드: ${res.status}`); // 여기서 404면 자바 설정 문제
            if (!res.ok) throw new Error("서버 에러");
            return res.text();
        })
        .then(text => {
            console.log(`[일촌 확인] 서버가 보낸 데이터: ${text}`); // 데이터가 잘 왔는지 확인

            btn.style.display = "inline-block";
            btn.dataset.target = targetPk;

            if (!text || text.trim() === "null") {
                btn.innerText = "일촌 신청";
                btn.dataset.action = "request";
                btn.style.background = "#ff7675";
                btn.style.color = "white";
                return;
            }

            const data = JSON.parse(text);

            if (data.f_status === 1) {
                btn.innerText = "일촌 끊기";
                btn.dataset.action = "delete";
                btn.style.background = "#fdcb6e";
                btn.style.color = "#555";
            } else if (data.f_status === 0) {
                if (data.f_requester === loginUserPk) {
                    btn.innerText = "수락 대기중";
                    btn.dataset.action = "pending";
                    btn.style.background = "#a29bfe";
                    btn.style.color = "white";
                } else {
                    btn.innerText = "일촌 수락";
                    btn.dataset.action = "accept";
                    btn.style.background = "#ff7675";
                    btn.style.color = "white";
                }
            }
        })
        .catch(err => console.error("[일촌 확인 에러]:", err));
}

// 6. 일촌 버튼 클릭 액션 처리

function handleFriendAction() {
    const btn = document.getElementById("btn-friend-action");
    const action = btn.dataset.action;
    const targetPk = btn.dataset.target;

    if (action === "pending") {
        alert("상대방의 수락을 기다리는 중입니다 💌");
        return;
    }

    let confirmMsg = "";
    if (action === "request") confirmMsg = "이 유저에게 일촌을 신청할까요? 🌱";
    else if (action === "accept") confirmMsg = "일촌 신청을 수락하시겠습니까? ✨";
    else if (action === "delete") confirmMsg = "정말 일촌을 끊으시겠습니까? 😢";

    if (!confirm(confirmMsg)) return;

    // 서버로 액션 명령 전송 (POST)
    const params = new URLSearchParams({
        action: action,
        targetPk: targetPk
    });

    fetch('/friendaction', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: params
    })
        .then(res => {
            if (res.ok) {
                // 통신 성공 시 버튼 상태를 다시 갱신한다.
                checkFriendStatus(targetPk);
            } else {
                alert("처리에 실패했습니다. 다시 시도해주세요.");
            }
        })
        .catch(err => console.error("일촌 액션 에러:", err));
}

// 나에게 온 일촌 신청 확인
// 나에게 온 일촌 신청 확인
function checkIncomingFriendRequests() {
    console.log("[알림 확인] 서버에 일촌 신청 목록 요청..."); // 🔍 추적기 1

    fetch(`/friendview?action=pendingList`)
        .then(res => {
            if(!res.ok) throw new Error("서버 응답 오류");
            return res.json();
        })
        .then(list => {
            console.log("[알림 확인] 서버에서 받은 목록:", list); // 🔍 추적기 2 (여기가 빈 배열 [] 이면 안 뜸)

            // 🚨 수정: profile-card 안쪽이 아니라 바깥쪽(.profile)에 안전하게 붙인다!
            const profileArea = document.querySelector(".profile");
            if(!profileArea) return;

            // 기존 알림창이 있다면 찌꺼기 제거
            const oldNotify = document.getElementById("friend-notify");
            if (oldNotify) oldNotify.remove();

            // 받은 신청이 1개라도 있으면 알림창 생성
            if (list && list.length > 0) {
                const notifyDiv = document.createElement("div");
                notifyDiv.id = "friend-notify";
                notifyDiv.style = "background:#fff5f5; border:1px solid #ff7675; padding:12px; border-radius:10px; margin-top:15px; font-size:13px; box-shadow: 2px 2px 5px rgba(0,0,0,0.03);";

                let html = `<p style="margin:0 0 8px 0; color:#ff7675; font-weight:bold; font-family:'Gaegu', cursive; font-size:16px;">💌 일촌 신청 도착!</p>`;

                list.forEach(req => {
                    html += `
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px dashed #f2c0bd; padding-bottom:5px;">
                            <span style="color:#5a4a3a;"><b>${req.nickname}</b>님</span>
                            <div style="display:flex; gap:5px;">
                                <button onclick="handleAccept('${req.requesterPk}')" style="background:#ff7675; color:white; border:none; border-radius:5px; cursor:pointer; padding:4px 8px; font-family:'Gaegu', cursive;">수락</button>
                                <button onclick="handleReject('${req.requesterPk}')" style="background:#f0eee5; color:#8a7a78; border:none; border-radius:5px; cursor:pointer; padding:4px 8px; font-family:'Gaegu', cursive;">거절</button>
                            </div>
                        </div>`;
                });
                notifyDiv.innerHTML = html;
                profileArea.appendChild(notifyDiv);
            }
        })
        .catch(err => console.error("[알림 확인 에러]:", err));
}

// 수락 버튼 함수
function handleAccept(requesterPk) {
    if (!confirm("일촌 신청을 수락할까요?")) return;
    executeFriendAction("accept", requesterPk);
}

// 거절 버튼 함수
function handleReject(requesterPk) {
    if (!confirm("신청을 거절하시겠습니까?")) return;
    executeFriendAction("delete", requesterPk);
}

// 공통 액션 실행기
function executeFriendAction(action, targetPk) {
    const params = new URLSearchParams({action: action, targetPk: targetPk});
    fetch('/friendaction', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: params
    }).then(res => {
        if (res.ok) {
            checkIncomingFriendRequests(); // 알림창 갱신
            alert(action === "accept" ? "이제 일촌입니다! ✨" : "거절되었습니다.");
        }
    });
}