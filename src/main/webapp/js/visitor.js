document.addEventListener("DOMContentLoaded", function () {


// 현재 페이지 상태 저장
    let globalCurrentPage = 1;

// [핵심 추가] 현재 주소창(URL)에서 접속 중인 미니홈피 주인의 식별자를 추출한다.
// 예: http://localhost:8080/minihome?id=test123 접속 시 'test123' 추출
    const urlParams = new URLSearchParams(window.location.search);
    const currentOwnerPk = urlParams.get('id');

// 1. 방명록 작성 (POST 비동기)
    document.addEventListener("submit", function (e) {
        if (e.target && e.target.id === "v-visitor-form") {
            e.preventDefault();

            const emojiSelect = document.getElementById("v-visitor-emoji");

            // 접속 대상(주인)의 식별자가 없으면 에러 처리
            if (!currentOwnerPk) {
                alert("잘못된 접근입니다. (미니홈피 주인을 찾을 수 없음)");
                return;
            }

            // 서버로 전송할 데이터 묶음 (작성자 정보는 서버가 세션에서 알아서 꺼내므로 안 보냄)
            const requestData = new URLSearchParams({
                visitorEmoji: emojiSelect ? emojiSelect.value : "1",
                ownerPk: currentOwnerPk // 하드코딩 제거, 동적 식별자 전송
            });

            fetch("visitor", {
                method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: requestData
            })
                .then(response => {
                    if (response.ok) {
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
// 3. 방명록 목록 불러오기 (GET 비동기)

// 2. 방명록 목록 불러오기 (GET 비동기)
    function fetchVisitors(page) {
        if (!currentOwnerPk) return;

        // [핵심 수정] URL 끝에 &ownerPk=현재주인 식별자를 반드시 붙여서 보낸다.
        fetch(`visitor?reqType=json&p=${page}&ownerPk=${currentOwnerPk}`)
            .then(response => {
                if (!response.ok) throw new Error("서버 응답 오류");
                return response.json();
            })
            .then(data => {
                globalCurrentPage = data.currentPage || page;
                renderPosts(data.visitorList);
                renderPaging(data.visitorList, globalCurrentPage);
            })
            .catch(error => console.error("방명록 로딩 실패:", error));
    }

// 3. 방명록 삭제
    function deleteVisitor(vId) {
        if (!confirm('삭제하시겠습니까?')) return;

        fetch(`visitorDel?vId=${vId}`, {method: "GET"})
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

            // [주의] 백엔드 DTO가 v_writer_pk로 바뀌었으므로 변수명을 맞춘다.
            html += `
            <div class="v-post-item" style="display:flex; justify-content:space-between; align-items:center; padding:12px 20px; background:#fff; border-radius:10px; border:1px solid #f0eee5; box-shadow: 2px 2px 5px rgba(0,0,0,0.02);">
                <div style="display:flex; align-items:center; gap:15px;">
                    <span class="v-moving-emoji" style="font-size: 22px; display: inline-block;">${emoji}</span>
                    <span style="font-size:18px; color:#5a4a3a;">
                        <strong 
                            style="color:#f2a0a0; cursor:pointer; text-decoration:underline; text-underline-offset: 3px;" 
                            onclick="goToMinihome('${v.v_writer_pk}')"
                            title="파도타기!">
                            ${v.v_writer_pk}
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

// 🌊 파도타기 (비동기 방식)
    function goToMinihome(targetPk) {
        const hiddenInput = document.getElementById("hidden-owner-pk");

        // 1. 방어 로직: 클릭한 대상이 이미 현재 화면의 주인이라면 무시한다.
        if (hiddenInput && hiddenInput.value === targetPk) {
            alert("이미 현재 미니홈피에 머물고 있습니다.");
            return;
        }

        // 2. [핵심 스와핑] HTML에 숨겨둔 집주인 신분증(PK)을 '남의 PK'로 몰래 교체한다.
        if (hiddenInput) {
            hiddenInput.value = targetPk;
        } else {
            console.error("치명적 오류: hidden-owner-pk 요소를 찾을 수 없습니다.");
            return;
        }

        // 3. 주인이 바뀌었으므로, 현재 화면에 떠 있는 모든 데이터를 '새 주인'의 데이터로 싹 다 다시 불러온다 (새로고침 없이!).

        // - 새 주인의 방명록 1페이지 강제 로딩
        fetchVisitors(1);

        // - 새 주인의 우측 최근 방문자 위젯 갱신 (이 과정에서 백엔드로 '자동 발도장' 신호가 몰래 날아감)
        loadRecentVisitors();

        // ====================================================================
        // 🚨 멘토의 강력한 경고 (향후 추가해야 할 부분)
        // 지금은 방명록만 구현되어 있지만, 나중에 다이어리, 사진첩, 메인 프로필을 만들면
        // 파도타기를 했을 때 그 데이터들도 새 주인의 것으로 싹 다 바뀌어야 한다.
        // 비동기 통신을 담당하는 함수들을 만들고, 반드시 이 아래에 추가로 호출해라!
        // ====================================================================
        // loadProfile(targetPk);  // (예시) 새 주인의 프로필 사진과 상태메시지 로딩
        // loadDiary(targetPk);    // (예시) 새 주인의 다이어리 로딩
        // loadBgm(targetPk);      // (예시) 새 주인의 배경음악 로딩

        console.log("🌊 파도타기 완료! 현재 홈피 주인 PK:", targetPk);
    }

// 🐾 우측 최근 방문자 로딩 함수
    function loadRecentVisitors() {
        if (!currentOwnerPk) return;

        // [핵심 수정] 위젯 로딩 시에도 반드시 ownerPk를 보낸다.
        fetch(`visitor?reqType=recent&ownerPk=${currentOwnerPk}`)
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
                        <strong style="cursor:pointer;" onclick="goToMinihome('${v.v_writer_pk}')">${v.v_writer_pk}</strong>
                    </span>
                    <span class="v-date-small">${v.v_date}</span>
                `;
                    listContainer.appendChild(li);
                });
            })
            .catch(err => console.error("최근 방문자 로딩 실패:", err));
    }

// 페이지 최초 로드 시 실행
    document.addEventListener("DOMContentLoaded", function () {
        loadRecentVisitors();
        // 참고: 탭 이동 시 fetchVisitors(1)이 호출되도록 HTML 구조가 잡혀 있어야 함.
    });

});