let globalCurrentPage = 1;

// 1. 방명록 작성 (POST 비동기)
document.addEventListener("submit", function (e) {
    if (e.target && e.target.id === "v-visitor-form") {
        e.preventDefault();

        const nameInput = document.getElementById("v-visitor-name");
        const emojiSelect = document.getElementById("v-visitor-emoji"); // 추가된 요소

        if (!nameInput.value.trim()) {
            alert("이름을 입력해주세요.");
            return;
        }

        // 서버로 전송할 데이터 묶음
        const requestData = new URLSearchParams({
            visitorName: nameInput.value,
            visitorEmoji: emojiSelect ? emojiSelect.value : "1", // 이모지 선택값 추출
            ownerId: "DongMin" // 주의: 향후 다중 사용자 지원 시 동적으로 변경해야 함
        });

        fetch("visitor", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: requestData
        })
            .then(response => {
                if (response.ok) {
                    nameInput.value = "";
                    fetchVisitors(1);
                    loadRecentVisitors();
                } else {
                    alert("등록에 실패했습니다. 서버 오류가 발생했습니다.");
                }
            })
            .catch(error => console.error("Error:", error));
    }
});

// 2. 방명록 목록 불러오기 (GET 비동기)
function fetchVisitors(page) {
    fetch(`visitor?reqType=json&p=${page}`)
        .then(response => response.json())
        .then(data => {
            globalCurrentPage = data.currentPage || page;
            renderPosts(data.visitorList);
            renderPaging(data.visitorList, globalCurrentPage);
        })
        .catch(error => console.error("Error:", error));
}

// 3. 방명록 삭제
function deleteVisitor(vId) {
    if (!confirm('삭제하시겠습니까?')) return;

    fetch(`visitorDel?vId=${vId}`, { method: "GET" })
        .then(response => {
            if (response.ok) fetchVisitors(globalCurrentPage);
            else alert("삭제에 실패했습니다.");
        })
        .catch(error => console.error("Error:", error));
}

// --- UI 함수들 ---
function renderPosts(visitorList) {
    const container = document.getElementById("v-posts-container");
    container.innerHTML = "";

    if (!visitorList || visitorList.length === 0) {
        container.innerHTML = `
            <div class="v-post-item" style="text-align:center; color:#aaa; padding:100px 0; font-size:20px;">
                아직 다녀간 사람이 없어요. 첫 발도장을 찍어주세요! 😊
            </div>`;
        return;
    }

    let html = "";
    visitorList.forEach(v => {
        let emoji = '✨';
        if (v.v_emoji == 1) emoji = '🐾';
        else if (v.v_emoji == 2) emoji = '👣';
        else if (v.v_emoji == 3) emoji = '🐱';
        else if (v.v_emoji == 4) emoji = '🐶';

        html += `
            <div class="v-post-item" style="display:flex; justify-content:space-between; align-items:center; padding:12px 20px; background:#fff; border-radius:10px; border:1px solid #f0eee5; box-shadow: 2px 2px 5px rgba(0,0,0,0.02);">
                <div style="display:flex; align-items:center; gap:15px;">
                    <span class="v-moving-emoji" style="font-size: 22px; display: inline-block;">${emoji}</span>
                    <span style="font-size:18px; color:#5a4a3a;">
                        <strong 
                            style="color:#f2a0a0; cursor:pointer; text-decoration:underline; text-underline-offset: 3px;" 
                            onclick="goToMinihome('${v.v_writer_id}')"
                            title="${v.v_writer_id}님의 홈피로 파도타기!">
                            ${v.v_writer_id}
                        </strong>님이 다녀갔습니다.
                    </span>
                </div>
                <div style="display:flex; align-items:center; gap:15px;">
                    <span style="font-size:13px; color:#c0b0a0;">${v.v_date}</span>
                    <a href="javascript:void(0);" onclick="deleteVisitor('${v.v_id}')" style="text-decoration:none; color:#ff9999; font-weight:bold; font-size:20px;">&times;</a>
                </div>
            </div>`;
    });
    container.innerHTML = html;
}

function renderPaging(visitorList, currentPage) {
    const container = document.getElementById("v-paging-container");
    let html = "";

    if (currentPage > 1) {
        html += `<button class="v-page-btn" onclick="fetchVisitors(${currentPage - 1})" style="background:#fff; border:1px solid #f2c0bd; border-radius:15px; padding:5px 15px; cursor:pointer; font-family:'Gaegu'; color:#8a7a78;">◀ 이전</button>`;
    } else {
        html += `<div style="width:70px;"></div>`;
    }

    html += `<span style="font-family:'Nanum Pen Script'; color:#8a7a78; font-size:22px;">Page ${currentPage}</span>`;

    if (visitorList && visitorList.length === 7) {
        html += `<button class="v-page-btn" onclick="fetchVisitors(${currentPage + 1})" style="background:#fff; border:1px solid #f2c0bd; border-radius:15px; padding:5px 15px; cursor:pointer; font-family:'Gaegu'; color:#8a7a78;">다음 ▶</button>`;
    } else {
        html += `<div style="width:70px;"></div>`;
    }

    container.innerHTML = html;
}

// 🌊 파도타기 & 모달 함수들
function goToMinihome(targetId) {
    customAlert(targetId + "님의 미니홈피로 파도타기 기능을 나중에 연결할 거예요! 🏄‍♂️");
}

function customAlert(message) {
    document.getElementById('v-custom-alert-message').innerText = message;
    document.getElementById('v-custom-modal').style.display = 'flex';
}

function closeCustomAlert() {
    document.getElementById('v-custom-modal').style.display = 'none';
}

// 🐾 우측 최근 방문자 로딩 함수 (완성)
function loadRecentVisitors() {
    fetch('visitor?reqType=recent')
        .then(response => response.json())
        .then(data => {
            const listContainer = document.getElementById('v-recent-list');
            listContainer.innerHTML = "";

            if (!data || data.length === 0) {
                listContainer.innerHTML = "<li class='v-empty'>아직 다녀간 사람이 없어요.</li>";
                return;
            }

            data.forEach(v => {
                let emoji = '✨';
                if (v.v_emoji == 1) emoji = '🐾';
                else if (v.v_emoji == 2) emoji = '👣';
                else if (v.v_emoji == 3) emoji = '🐱';
                else if (v.v_emoji == 4) emoji = '🐶';

                const li = document.createElement('li');
                li.innerHTML = `
                    <span style="display:flex; align-items:center; gap:5px;">
                        <span style="font-size: 11px;">${emoji}</span>
                        <strong style="cursor:pointer;" onclick="goToMinihome('${v.v_writer_id}')">${v.v_writer_id}</strong>
                    </span>
                    <span class="v-date-small">${v.v_date}</span>
                `;
                listContainer.appendChild(li);
            });
        })
        .catch(err => console.error("최근 방문자 로딩 실패:", err));
}

// 페이지 최초 로드 시 실행
document.addEventListener("DOMContentLoaded", function() {
    loadRecentVisitors();
});