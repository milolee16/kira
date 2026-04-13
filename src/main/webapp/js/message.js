// 1. 현재 접속 중인 미니홈피 주인 ID 추적
function getCurrentOwnerId() {
    const hostId = sessionStorage.getItem("currentHostId");
    return hostId ? hostId : window.loginUserId;
}

// 2. 권한 검증
function isPageOwner() {
    if (!window.loginUserId) return false;
    return window.loginUserId === getCurrentOwnerId();
}

// 3. 쪽지함 초기화 함수 (index.js 라우터에서 호출됨)
function initMessage() {
    const tabReceived = document.getElementById('tab-received');
    const tabSent = document.getElementById('tab-sent');

    if (isPageOwner()) {
        if (tabReceived) tabReceived.style.display = 'inline-block';
        if (tabSent) tabSent.style.display = 'inline-block';
        loadMessages('received');
        checkUnreadMessages();
    } else {
        if (tabReceived) tabReceived.style.display = 'none';
        if (tabSent) tabSent.style.display = 'none';
        openWriteMessage();
    }
}

// 4. 쪽지함 목록 불러오기
function loadMessages(type) {
    if (!isPageOwner()) {
        alert("권한이 없습니다.");
        return;
    }

    document.getElementById('message-write-area').style.display = 'none';
    document.getElementById('message-list-area').style.display = 'block';

    document.querySelectorAll('.msg-tab-btn').forEach(tab => tab.classList.remove('active'));
    const activeTabId = type === 'received' ? 'tab-received' : 'tab-sent';
    const activeTab = document.getElementById(activeTabId);
    if (activeTab) activeTab.classList.add('active');

    if (type === 'received') {
        fetch('/messageaction', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({action: 'markRead'})
        }).then(() => {
            if (typeof checkUnreadMessages === "function") checkUnreadMessages();
        });
    }

    // 🚨 여기서 ownerId를 서버로 정확히 보냄
    const targetOwnerId = getCurrentOwnerId();
    fetch(`/messageview?action=${type}&ownerId=${targetOwnerId}`)
        .then(res => {
            // 🚨 403 에러가 뜨면 여기서 즉시 차단하여 forEach 에러를 방지함
            if (!res.ok) throw new Error("서버 에러");
            return res.json();
        })
        .then(list => {
            const area = document.getElementById("message-list-area");
            let html = "";

            if (!list || list.length === 0) {
                html = `<div style='text-align:center; padding:50px; color:#c0b0a0;'>쪽지가 없습니다. 텅~ 🍃</div>`;
            } else {
                list.forEach(m => {
                    const targetName = type === 'received' ? `From: ${m.target_nick}` : `To: ${m.target_nick}`;
                    html += `
                    <div style="border-bottom:1px dashed #f2c0bd; padding:10px 0; position:relative;">
                        <div style="font-size:13px; color:#a29bfe; font-weight:bold; cursor:pointer;" 
                             onclick="goSearchMain('${m.target_id}', '${m.target_nick}')">
                            ${targetName} <span style="color:#c0b0a0; font-weight:normal; font-size:11px; margin-left:10px;">${m.m_date}</span>
                        </div>
                        <div style="margin-top:8px; color:#5a4a3a; font-size:15px;">${m.m_content}</div>
                        <button onclick="deleteMsg('${m.m_pk}', '${type}')" style="position:absolute; right:5px; top:10px; border:none; background:none; cursor:pointer; color:#ff7675; font-size:14px;">✖</button>
                    </div>`;
                });
            }
            area.innerHTML = html;
        })
        .catch(err => {
            console.error(err);
            document.getElementById("message-list-area").innerHTML = `<div style='text-align:center; padding:50px; color:#ff7675;'>데이터를 불러올 수 없습니다.</div>`;
        });
}

// 5. 쪽지 쓰기 창 열기
function openWriteMessage() {
    document.getElementById('message-list-area').style.display = 'none';
    document.getElementById('message-write-area').style.display = 'block';

    document.querySelectorAll('.msg-tab-btn').forEach(tab => tab.classList.remove('active'));
    const writeTab = document.getElementById('tab-write');
    if (writeTab) writeTab.classList.add('active');

    const targetId = isPageOwner() ? "" : getCurrentOwnerId();

    // 🚨 만약 일촌 목록이 없어서 에러가 날 경우를 대비한 방어 로직 추가
    fetch('/friendview?action=list')
        .then(res => {
            if (!res.ok) throw new Error("일촌 목록을 불러올 수 없습니다.");
            return res.json();
        })
        .then(list => {
            const select = document.getElementById('msg-receiver-select');
            select.innerHTML = '<option value="">💌 받을 일촌을 선택하세요</option>';

            if (Array.isArray(list)) {
                list.forEach(f => {
                    const isSelected = (f.u_id === targetId) ? 'selected' : '';
                    select.innerHTML += `<option value="${f.u_id}" ${isSelected}>${f.u_nickname}</option>`;
                });
            }
        })
        .catch(err => console.error(err));
}

// 6. 쪽지 전송
function sendMessage() {
    const receiverId = document.getElementById('msg-receiver-select').value;
    const content = document.getElementById('msg-content').value;

    if (!receiverId) { alert('받을 사람(일촌)을 선택해주세요!'); return; }
    if (!content.trim()) { alert('내용을 입력해주세요!'); return; }

    const params = new URLSearchParams({action: 'send', receiverId: receiverId, content: content});

    fetch('/messageaction', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: params
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("쪽지가 슝~ 전송되었습니다! 🚀");
                document.getElementById('msg-content').value = '';
                if (isPageOwner()) loadMessages('sent');
            } else {
                alert(data.message || "발송 실패");
            }
        });
}

// 7. 쪽지 삭제
function deleteMsg(msgPk, type) {
    if (!isPageOwner()) return;
    if (!confirm("이 쪽지를 삭제할까요?")) return;

    const params = new URLSearchParams({action: 'delete', msgPk: msgPk, type: type});
    fetch('/messageaction', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: params
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) loadMessages(type);
            else alert("삭제 실패!");
        });
}

// 8. 안 읽은 쪽지 뱃지 처리
function checkUnreadMessages() {
    if (!isPageOwner()) return;

    const targetOwnerId = getCurrentOwnerId();
    fetch(`/messageview?action=unreadCount&ownerId=${targetOwnerId}`)
        .then(res => {
            if(!res.ok) throw new Error("알림 에러");
            return res.json();
        })
        .then(data => {
            const msgMenus = document.querySelectorAll('.menu-item[data-src*="message.jsp"], .nb-tab[data-src*="message.jsp"]');
            msgMenus.forEach(item => {
                const oldBadge = item.querySelector('.msg-badge');
                if (oldBadge) oldBadge.remove();

                if (data.count && data.count > 0) {
                    item.innerHTML += `<span class="msg-badge" style="background:#ff7675; color:white; border-radius:50%; padding:2px 6px; font-size:11px; margin-left:5px; box-shadow: 1px 1px 3px rgba(0,0,0,0.2); animation: pop 0.3s ease-in-out;">${data.count}</span>`;
                }
            });
        })
        .catch(err => console.error(err));
}