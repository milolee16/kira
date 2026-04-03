// 현재 페이지 상태 저장
let globalCurrentPage = 1;

// 1. 페이지 로드 시 첫 페이지 데이터 불러오기
document.addEventListener("DOMContentLoaded", () => {
    fetchVisitors(1);
});

// 2. 방명록 작성 (POST 비동기)
document.getElementById("visitorForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const nameInput = document.getElementById("visitorName");

    fetch("visitor", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: new URLSearchParams({visitorName: nameInput.value})
    })
        .then(response => {
            if (response.ok) {
                nameInput.value = "";
                fetchVisitors(1);
            } else {
                alert("등록에 실패했습니다.");
            }
        })
        .catch(error => console.error("Error:", error));
});

// 3. 방명록 목록 불러오기 (GET 비동기)
function fetchVisitors(page) {
    // ⭐️ 수정: ajax=true 대신 reqType=json 사용! 역슬래시(\) 제거!
    fetch(`visitor?reqType=json&p=${page}`)
        .then(response => response.json())
        .then(data => {
            globalCurrentPage = data.currentPage || page;
            renderPosts(data.visitorList);
            renderPaging(data.visitorList, globalCurrentPage);
        })
        .catch(error => console.error("Error:", error));
}

// 4. 방명록 삭제
function deleteVisitor(vId) {
    if (!confirm('삭제하시겠습니까?')) return;

    // ⭐️ 역슬래시(\) 제거!
    fetch(`visitorDel?vId=${vId}`, {
        method: "GET"
    })
        .then(response => {
            if (response.ok) {
                fetchVisitors(globalCurrentPage);
            } else {
                alert("삭제에 실패했습니다.");
            }
        })
        .catch(error => console.error("Error:", error));
}

// --- UI 함수들 ---
function renderPosts(visitorList) {
    const container = document.getElementById("postsContainer");
    container.innerHTML = "";

    if (!visitorList || visitorList.length === 0) {
        container.innerHTML = `
            <div class="post-item" style="text-align:center; color:#aaa; padding:100px 0; font-size:20px;">
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

        // ⭐️ 역슬래시(\) 전부 제거!
        html += `
            <div class="post-item" style="display:flex; justify-content:space-between; align-items:center; padding:12px 20px; background:#fff; border-radius:10px; border:1px solid #f0eee5; box-shadow: 2px 2px 5px rgba(0,0,0,0.02);">
                <div style="display:flex; align-items:center; gap:15px;">
                    <span class="moving-emoji" style="font-size: 22px; display: inline-block;">${emoji}</span>
                    <span style="font-size:18px; color:#5a4a3a;">
                        <strong style="color:#f2a0a0;">${v.v_writer_id}</strong>님이 다녀갔습니다.
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
    const container = document.getElementById("pagingContainer");
    let html = "";

    // ⭐️ 역슬래시(\) 전부 제거!
    if (currentPage > 1) {
        html += `<button class="page-btn" onclick="fetchVisitors(${currentPage - 1})" style="background:#fff; border:1px solid #f2c0bd; border-radius:15px; padding:5px 15px; cursor:pointer; font-family:'Gaegu'; color:#8a7a78;">◀ 이전</button>`;
    } else {
        html += `<div style="width:70px;"></div>`;
    }

    html += `<span style="font-family:'Nanum Pen Script'; color:#8a7a78; font-size:22px;">Page ${currentPage}</span>`;

    if (visitorList && visitorList.length === 7) {
        html += `<button class="page-btn" onclick="fetchVisitors(${currentPage + 1})" style="background:#fff; border:1px solid #f2c0bd; border-radius:15px; padding:5px 15px; cursor:pointer; font-family:'Gaegu'; color:#8a7a78;">다음 ▶</button>`;
    } else {
        html += `<div style="width:70px;"></div>`;
    }

    container.innerHTML = html;
}