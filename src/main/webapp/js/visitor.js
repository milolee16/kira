let globalCurrentPage = 1;

// =========================================================================
// [핵심 함수] 현재 미니홈피의 주인이 누구인지(ownerPk) 알아내는 공통 함수
// =========================================================================
function getTargetOwnerPk() {
    // 1. 파도타기 중인지 확인 (세션 스토리지에 남의 PK가 메모되어 있는지 확인)
    const savedOwnerPk = sessionStorage.getItem("currentHostId");

    // 2. 메모가 있다면 파도타기 중(남의 홈피)이므로 그 사람의 PK를 반환하고,
    //    메모가 없다면 내 홈피이므로 JSP에 선언해둔 내 전역변수(loginUserPk)를 반환한다.
    return savedOwnerPk ? savedOwnerPk : loginUserPk;
}

// =========================================================================
// 1. 방명록 작성 (POST 비동기)
// =========================================================================
document.addEventListener("submit", function (e) {
    if (e.target && e.target.id === "v-visitor-form") {
        e.preventDefault();

        const emojiSelect = document.getElementById("v-visitor-emoji");
        const currentOwnerPk = getTargetOwnerPk(); // 핵심 함수 호출!

        // 접속 대상(주인)의 식별자가 없으면 에러 처리
        if (!currentOwnerPk) {
            alert("잘못된 접근입니다. (미니홈피 주인을 찾을 수 없음)");
            return;
        }

        const requestData = new URLSearchParams({
            visitorEmoji: emojiSelect ? emojiSelect.value : "1",
            ownerPk: currentOwnerPk // 서버로 확실하게 ownerPk를 보냄
        });

        fetch("visitor", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: requestData
        })
            .then(response => {
                if (response.ok) {
                    // 등록 성공 시 1페이지와 우측 위젯을 다시 새로고침
                    fetchVisitors(1);
                    loadRecentVisitors();
                } else if (response.status === 401) {
                    alert("로그인이 필요한 서비스입니다.");
                } else {
                    alert("등록에 실패했습니다. 서버 오류가 발생했습니다.");
                }
            })
            .catch(error => console.error("Error:", error));
    }
});
// =========================================================================
// 2. 방문자 목록 불러오기 (GET 비동기) - 캐시 차단 완벽 적용
// =========================================================================
function fetchVisitors(page) {
    const currentOwnerPk = getTargetOwnerPk();

    if (!currentOwnerPk) {
        console.error("주인 PK가 없어 목록을 불러올 수 없습니다.");
        return;
    }

    // [핵심] 리스트를 불러올 때도 무조건 최신 데이터를 가져오도록 시간값을 꼬리표로 붙임
    const noCache = new Date().getTime();

    // fetch URL 끝에 &t=시간 붙이고, 헤더로 캐시 금지 명령 추가
    fetch(`visitor?reqType=json&p=${page}&ownerPk=${currentOwnerPk}&t=${noCache}`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    })
        .then(response => {
            if (!response.ok) throw new Error("서버 응답 오류");
            return response.json();
        })
        .then(data => {
            console.log(data);
            globalCurrentPage = data.currentPage || page;
            renderPosts(data.visitorList);
            renderPaging(data.visitorList, globalCurrentPage);
        })
        .catch(error => console.error("방문자 목록 로딩 실패:", error));
}

// =========================================================================
// 3. 우측 최근 방문자 로딩 & 자동 발도장 (GET 비동기)
// =========================================================================
function loadRecentVisitors() {
    const currentOwnerPk = getTargetOwnerPk();

    if (!currentOwnerPk) return;

    const noCache = new Date().getTime();

    fetch(`visitor?reqType=recent&ownerPk=${currentOwnerPk}&t=${noCache}`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    })
        .then(response => response.json())
        .then(data => {
            const listContainer = document.getElementById('v-recent-list');
            listContainer.innerHTML = "";

            if (!data || data.length === 0) {
                listContainer.innerHTML = "<li class='v-empty'>아직 다녀간 사람이 없어요.</li>";
            } else {
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
                        <strong style="cursor:pointer;" onclick="goSearchMain('${v.v_writer_pk}', '${v.v_writer_nickname}')">${v.v_writer_nickname}</strong>
                    </span>
                    <span class="v-date-small">${v.v_date}</span>
                `;
                    listContainer.appendChild(li);
                });
            }

            // 🚨 [핵심 타이밍] 리스트를 화면에 다 그린 직후, 조회수를 갱신하는 방아쇠를 당긴다!
            if (typeof updateHitCount === "function") {
                updateHitCount();
            }
        })
        .catch(err => console.error("최근 방문자 로딩 실패:", err));
}
// =========================================================================
// 4. 방명록 삭제 로직
// =========================================================================
function deleteVisitor(vId) {
    if (!confirm('삭제하시겠습니까?')) return;

    fetch(`visitorDel?vId=${vId}`, {method: "GET"})
        .then(response => {
            if (response.ok) fetchVisitors(globalCurrentPage);
            else alert("삭제에 실패했습니다.");
        })
        .catch(error => console.error("Error:", error));
}

// =========================================================================
// 5. UI 렌더링 함수들 (이전과 동일)
// =========================================================================
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

        // [핵심 수정] 화면에 출력되는 이름과, goSearchMain의 두 번째 파라미터를 v_writer_nickname으로 교체했다.
        html += `
            <div class="v-post-item" style="display:flex; justify-content:space-between; align-items:center; padding:12px 20px; background:#fff; border-radius:10px; border:1px solid #f0eee5; box-shadow: 2px 2px 5px rgba(0,0,0,0.02);">
                <div style="display:flex; align-items:center; gap:15px;">
                    <span class="v-moving-emoji" style="font-size: 22px; display: inline-block;">${emoji}</span>
                    <span style="font-size:18px; color:#5a4a3a;">
                        <strong 
                            style="color:#f2a0a0; cursor:pointer; text-decoration:underline; text-underline-offset: 3px;" 
                            onclick="goSearchMain('${v.v_writer_pk}', '${v.v_writer_nickname}')"
                            title="파도타기!">
                            ${v.v_writer_nickname}
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
}// =========================================================================
// 6. 방문자(발도장) 초기 로딩 함수
// =========================================================================
function initVisitorLog() {
    // 1. 방문자 1페이지 리스트 불러오기
    fetchVisitors(1);

    // 2. 우측 최근 방문자 위젯 불러오기 (이때 백엔드에서 자동 발도장이 찍힘)
    loadRecentVisitors();
}

// 화면(수첩 속지) 갈아끼우기 함수
function vloadPage(url) {
    if (!url) return;

    // 1. 현재 미니홈피 주인의 PK를 가져온다.
    const savedOwnerPk = sessionStorage.getItem("currentHostId");
    const targetOwnerPk = savedOwnerPk ? savedOwnerPk : loginUserPk;

    // 2. URL에 꼬리표(ownerPk)를 붙인다.
    let fetchUrl = url;
    if (targetOwnerPk) {
        fetchUrl += (fetchUrl.includes('?') ? '&' : '?') + 'ownerPk=' + targetOwnerPk;
    }

    // 3. 서버 통신 (★ fetch는 반드시 이거 하나만 있어야 한다 ★)
    fetch(fetchUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP 오류: ${response.status}`);
            }
            return response.text();
        })
        .then((htmlData) => {
            document.getElementById("notebook-content").innerHTML = htmlData;

            const notebook = document.getElementById("notebook");
            if (notebook) notebook.classList.remove("is-visitor");

            // 라우터 실행 (여기가 실행되어야 리스트가 뜬다!)
            for (const path in pageRoutes) {
                if (url.includes(path)) {
                    const route = pageRoutes[path];
                    if (route.cssClass && notebook) notebook.classList.add(route.cssClass);
                    if (route.initFunc) route.initFunc();
                    break;
                }
            }
        })
        .catch(error => {
            console.error("페이지 로드 실패:", error);
            document.getElementById('notebook-content').innerHTML = `
                <div class="nb-error">
                    😢 페이지를 불러올 수 없어요<br>
                    <button onclick="loadPage('${url}')">다시 시도</button>
                </div>`;
        });

}