document.addEventListener("DOMContentLoaded", function () {
    //여기서 세션스토리지에 저장된 아이디와 닉네임이 있는지 조회함
    const savedId = sessionStorage.getItem("currentHostId");
    const savedNick = sessionStorage.getItem("currentHostNick");
    const profileName = document.getElementById("profile-name");
    //세션 스토리지에 저장된 아이디와 닉네임이 있다면, 다른 사람의 페이지를 보고있었던 것이므로 새로고침할 때
    //그 페이지를 다시 불러와줌
    if (savedId && savedNick) {
        profileName.textContent = savedNick;
        goSearchMain(savedId, savedNick);
    } else {
        //자기 페이지였다면 host_id에 로그인 아이디를 넘겨주어 자기 페이지를 다시 불러와줌
        profileName.textContent = loginUserNickname;
        const userUrl ="/home?ajax=true&host_id="+loginUserId;
        loadPage(userUrl);
    }
    //이름 다시 띄우기
    profileName.style.visibility = "visible";

    // 초기 진입 시 우측 위젯 불러오기
    if (typeof loadRecentVisitors === "function") {
        loadRecentVisitors();
    }

    // 🚨 [여기에 추가!] 내 홈피 로드 시 내 PK를 던져서 일촌 버튼을 숨긴다.
    if (typeof checkFriendStatus === "function") {
        checkFriendStatus(loginUserPk);
    }
    // 🚨 [여기에 추가!] 로그인 직후 나에게 온 일촌 신청이 있는지 확인해서 알림 띄우기
    if (typeof checkIncomingFriendRequests === "function") {
        checkIncomingFriendRequests();
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
    "board.jsp": {initFunc: () => loadGuestBoard(), cssClass: ""},
    "visitor": {initFunc: () => initVisitorLog(), cssClass: "is-visitor"},
    "diary.jsp": {initFunc: () => loadDiary(), cssClass: ""},
    "photo.jsp": {initFunc: () => loadPhoto(), cssClass: ""},
};

function loadPage(url) {
    if (!url) return;
    const savedOwnerId = sessionStorage.getItem("currentHostId");
    const targetOwnerId = savedOwnerId ? savedOwnerId : loginUserId;

    let fetchUrl = url;
    if (targetOwnerId) {
        fetchUrl += (fetchUrl.includes('?') ? '&' : '?') + 'host_id=' + targetOwnerId;
    }

    // 캐시 방지 (항상 최신 데이터 가져오기)
    fetchUrl += (fetchUrl.includes('?') ? '&' : '?') + 't=' + new Date().getTime();

    return fetch(fetchUrl)
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP 오류: ${response.status}`);
            return response.text(); // ⭐ 딱지(Header) 안 믿음! 일단 무조건 텍스트로 다 받음!
        })
        .then((textData) => {
            // ⭐ [무적의 검사기] 텍스트가 JSON인지 HTML인지 직접 파싱 시도해보기!
            try {
                // JSON으로 변환이 성공하면? 아하, 벽돌(JSON 데이터)이구나!
                const jsonData = JSON.parse(textData);
                return { type: 'json', payload: jsonData };
            } catch (e) {
                // JSON 변환 중 에러가 나면? 아하, 이건 다이어리 같은 완성된 햄버거(HTML)구나!
                return { type: 'html', payload: textData };
            }
        })
        .then((result) => {
            const notebookContent = document.getElementById("notebook-content");
            const notebook = document.getElementById("notebook");
            notebook.classList.remove("is-visitor");

            // ⭐ 내용물에 따라 정확하게 분기 처리!
            if (result.type === 'html') {
                // HTML이면 예전처럼 화면에 통째로 붓기 (다이어리, 방명록 등)
                notebookContent.innerHTML = result.payload;
            } else if (result.type === 'json') {
                // JSON이면 우리가 만든 요리사 함수를 호출해서 예쁘게 HTML로 조립하기!
                if (typeof renderHomeTemplate === "function") {
                    renderHomeTemplate(result.payload, notebookContent);
                } else {
                    console.error("renderHomeTemplate 함수가 없습니다!");
                }
            }

            // 라우팅 처리
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
            document.getElementById('notebook-content').innerHTML = `<div class="nb-error">😢 페이지를 불러올 수 없어요</div>`;
        });
}

function renderHomeTemplate(data, container) {
    if (!data) {
        container.innerHTML = `<div class="nb-error">데이터를 불러올 수 없습니다.</div>`;
        return;
    }

    // 기존 main.jsp에 있던 HTML 구조를 자바스크립트로 그대로 옮겨옵니다.
    // JSP의 ${searchMain.st_message} 였던 부분을 자바스크립트의 ${data.st_message} 로 바꿉니다.
    const html = `
    <div class="nb-body home-wrapper">
        <div class="home-status-board">
            <div class="status-left">
                <span class="d-day">✈️ 도쿄 출국 D-100</span>
                <div class="home-status-msg">
                    <span id="status-text">${data.st_message || "반갑습니다. 😊"}</span>
                    <button onclick="editStatus('${loginUserId}')" class="status-edit-btn">[수정]</button>
                </div>
            </div>
            <span class="status-since">Since ${data.st_date ? data.st_date.substring(0, 4) : '2026'}</span>
        </div>

        <div class="home-visual">
            <span class="visual-placeholder">${data.main_img || '기본 미니미'}</span>
            <div onclick="toggleLike()" class="like-btn">
                <span id="like-icon">🤍</span>
                <span id="like-count">12</span>
            </div>
        </div>

        <div class="home-bottom-row">
            <div class="home-updates">
                <div class="update-box">
                    <h4 class="update-title diary-title">📝 최근 다이어리</h4>
                    <p class="update-text">오늘 자바스크립트 버그 드디어 잡았다...</p>
                </div>
                <div class="update-box">
                    <h4 class="update-title gb-title">🐾 최근 방명록</h4>
                    <p class="update-text">${data.latest_gb_content || "작성된 방명록이 없습니다."}</p>
                </div>
            </div>

            <div class="home-qna">
                <h3 class="qna-title">🎲 오늘의 문답</h3>
                <p class="qna-question">Q. 최근 가장 몰입했던 일은?</p>
                <div class="qna-input-area">
                    <textarea id="qna-answer" placeholder="다이어리에 기록해 보세요! ✏️"></textarea>
                    <button onclick="submitQnA()" class="qna-submit-btn">다이어리 추가 ✍️</button>
                </div>
            </div>
        </div>
    </div>
    `;

    // 완성된 HTML 문자열을 화면에 꽂아 넣습니다!
    container.innerHTML = html;
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

    // ⭐ 3. 무조건 그 사람의 '홈' 화면으로 강제 이동! (방명록 유지 안 함)
    loadPage(`/home?ajax=true`);

    // 4. 프로필 및 제목 데이터 동기화
    const searchUrl = `/search-main?host_id=${id}`;
    fetch(searchUrl)
        .then((response) => response.json())
        .then((searchData) => {

            // ⭐ 5. 메뉴와 탭의 활성화 불빛(active)을 강제로 '홈'으로 옮기기
            document.querySelectorAll(".menu-item, .nb-tab").forEach((el) => el.classList.remove("active"));
            document.querySelectorAll(".menu-item, .nb-tab").forEach(el => {
                const src = el.getAttribute("data-src");
                // 주소에 'home'이 들어간 메뉴/탭에만 불을 켭니다.
                if (src && src.includes("home")) {
                    el.classList.add("active");
                }
            });

            // [텍스트 업데이트]
            const profileName = document.querySelector(".profile-name");
            if (profileName) profileName.innerText = nick;

            // 🚨 [방어막] searchData가 아예 null이어도 절대 터지지 않음
            const titleElement = document.querySelector("#host-title");

            if (titleElement) {
                titleElement.innerText = searchData.hompy_title || `📖 ${nick}님의 미니홈피`;
            }

            const stElement = document.querySelector("#status-text");
            if (stElement) {
                stElement.innerHTML = searchData.st_message || "반갑습니다. 😊";
            }


            const stDate = document.querySelector(".status-since");
            if (searchData.st_date) {
                stDate.innerHTML = `Since ${searchData.st_date.substring(0, 4)}`;
            }

            const latestGbElement = document.querySelector(".gb-title + .update-text");
            if (searchData.latest_gb_content) {
                latestGbElement.innerText = searchData.latest_gb_content;
            }



            // ==========================================================
            // 🚨 위에서 에러가 안 나야만 아래의 방아쇠들이 무사히 당겨진다!
            // ==========================================================
            if (typeof loadRecentVisitors === "function") loadRecentVisitors();

            // 일촌 버튼 띄우기 (드디어 실행됨!)
            if (typeof checkFriendStatus === "function") checkFriendStatus(id);


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

function handleAccept(requesterPk) {
    if (!confirm("일촌 신청을 수락할까요?")) return;
    executeFriendAction("accept", requesterPk);
}

function handleReject(requesterPk) {
    if (!confirm("신청을 거절하시겠습니까?")) return;
    executeFriendAction("delete", requesterPk);
}

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