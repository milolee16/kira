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
            if (!res.ok) throw new Error("서버 응답 오류");
            return res.json();
        })
        .then(list => {
            console.log("[알림 확인] 서버에서 받은 목록:", list); // 🔍 추적기 2 (여기가 빈 배열 [] 이면 안 뜸)

            // 🚨 수정: profile-card 안쪽이 아니라 바깥쪽(.profile)에 안전하게 붙인다!
            const profileArea = document.querySelector(".profile");
            if (!profileArea) return;

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

// 3. [핵심] 일촌 목록 불러오기 (검문 로직 수정 완료)
function loadFriendList() {
    let savedOwnerPk = sessionStorage.getItem("currentHostId");

    // "null", "undefined" 등 쓰레기 문자열 처리
    if (savedOwnerPk === "null" || savedOwnerPk === "undefined" || !savedOwnerPk) {
        savedOwnerPk = null;
    }

    // 🚨 판별 로직: savedOwnerPk가 없거나, 로그인한 내 PK와 일치하면 내 홈피!
    // String()으로 감싸서 비교하는 게 가장 확실해.
    const isMyHomePage = (savedOwnerPk === null || String(savedOwnerPk) === String(loginUserPk));

    console.log("[검문소] 현재 집주인 PK:", savedOwnerPk, "| 내 PK:", loginUserPk, "| 결과:", isMyHomePage);

    const container = document.getElementById("friend-list-container");
    if (!container) return;

    if (!isMyHomePage) {
        // 남의 집이면 목록 대신 잠금 화면 표시
        container.innerHTML = `
            <div style="text-align:center; color:#c0b0a0; padding:60px 20px; font-size:18px;">
                <span style="font-size:30px; display:block; margin-bottom:10px;">🔒</span>
                타인의 일촌 목록은 비공개입니다.
            </div>`;
        return;
    }

    // --- 이하 내 목록을 불러오는 로직 (함수 안으로 완전히 들어와야 함) ---
    container.innerHTML = `<div style="text-align:center; padding:20px;">일촌 목록을 불러오는 중...</div>`;

    fetch(`/friendview?action=list`)
        .then(res => res.json())
        .then(list => {
            container.innerHTML = "";
            if (!list || list.length === 0) {
                container.innerHTML = `<div style="text-align:center; color:#c0b0a0; padding:30px;">아직 일촌이 없어요. 😢</div>`;
                return;
            }

            list.forEach(f => {
                const html = `
                    <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:15px; border-radius:10px; border:1px solid #f2c0bd; margin-bottom:10px;">
                        <div>
                            <span style="font-size:18px; cursor:pointer;" onclick="goSearchMain('${f.friend_pk}', '${f.u_nickname}')">
                                🌱 <b>${f.u_nickname}</b>
                            </span>
                            <div style="font-size:11px; color:#c0b0a0;">일촌 맺은 날: ${f.f_date}</div>
                        </div>
                        <div style="display:flex; gap:5px;">
                            <button onclick="goToWriteMessage('${f.friend_pk}')" style="background:#a29bfe; color:white; border:none; padding:5px 12px; border-radius:15px; cursor:pointer; font-family:'Gaegu', cursive;">쪽지</button>
                            <button onclick="deleteFriendFromList('${f.friend_pk}')" style="background:#ff7675; color:white; border:none; padding:5px 12px; border-radius:15px; cursor:pointer; font-family:'Gaegu', cursive;">끊기</button>
                        </div>
                    </div>`;
                container.insertAdjacentHTML('beforeend', html);
            });
        })
        .catch(err => {
            console.error("일촌 로딩 실패:", err);
            container.innerHTML = "데이터 로딩 에러";
        });
}

// 9. 리스트에서 일촌 끊기 (기존과 동일)
function deleteFriendFromList(targetPk) {
    if (!confirm("정말 이 유저와 일촌을 끊으시겠습니까? 😢")) return;

    const params = new URLSearchParams({action: "delete", targetPk: targetPk});
    fetch('/friendaction', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: params
    }).then(res => {
        if (res.ok) {
            loadFriendList();
        } else {
            alert("삭제에 실패했습니다.");
        }
    });
}

// 일촌 목록에서 쪽지 버튼을 눌렀을 때의 동작
function goToWriteMessage(targetPk) {
    // 1. 네 index.jsp에 있는 쪽지함 메뉴(또는 탭)를 찾아서 강제로 클릭시킨다!
    // (이러면 경로 꼬일 일이 절대 없다)
    const msgMenu = document.querySelector('.menu-item[data-src*="message.jsp"]') || document.querySelector('.nb-tab[data-src*="message.jsp"]');

    if (msgMenu) {
        msgMenu.click();
    } else {
        alert("쪽지함 메뉴를 찾을 수 없습니다. index.jsp에 쪽지함을 추가해주세요!");
        return;
    }

    // 2. 화면이 불려오기를 0.4초 정도 넉넉히 기다린 뒤, '쪽지 쓰기' 화면을 열고 친구를 고정한다.
    setTimeout(() => {
        if (typeof openWriteMessage === "function") {
            openWriteMessage(targetPk);
        } else {
            console.error("message.js 파일이 아직 로딩되지 않았습니다!");
        }
    }, 400);
}