/**
 * [최종] 다이어리 중앙 통제 함수 (내부 스크롤 제어)
 */
function loadDiary(url = "diary") {
    let baseUrl = url.split('?')[0];
    let queryParams = new URLSearchParams(url.split('?')[1] || "");

    // 비동기 요청임을 서버에 알림
    queryParams.set("ajax", "true");

    // 세션에서 현재 홈피 주인 ID 가져오기
    const currentHostId = sessionStorage.getItem("currentHostId");
    if (currentHostId) {
        queryParams.set("memberId", currentHostId);
    }

    const finalUrl = baseUrl + "?" + queryParams.toString();
    console.log("📬 서버 요청:", finalUrl);

    fetch(finalUrl)
        .then((response) => response.text())
        .then((html) => {
            const contentArea = document.getElementById("notebook-content");
            if (contentArea) {
                contentArea.innerHTML = html;
                contentArea.scrollTop = 0; // 페이지 전환 시 스크롤 상단 리셋

                // 특정 날짜 선택 시 해당 위치로 부드러운 스크롤 이동
                if (queryParams.has("d")) {
                    setTimeout(() => {
                        const board = document.querySelector(".diary-board");
                        if (board) {
                            const targetPos = board.offsetTop;
                            contentArea.scrollTo({
                                top: targetPos - 10,
                                behavior: "smooth"
                            });
                        }
                    }, 50);
                }
            }
        })
        .catch((error) => console.error("❌ 로드 실패:", error));
}

/**
 * [추가] 일기 수정 화면으로 전환
 */
function updateDiary(no, y, m, d, memberId) {
    loadDiary(`diary-update?no=${no}&y=${y}&m=${m}&d=${d}&memberId=${memberId}`);
}

/**
 * [핵심] 일기 수정 처리 (비동기 POST)
 */
function updateDiaryForm() {
    const form = document.getElementById('diaryUpdateForm');
    if (!form) return;

    const formData = new FormData(form);
    const no = formData.get('no');
    const y = formData.get('d_year');
    const m = formData.get('d_month');
    const d = formData.get('d_date');
    const memberId = formData.get('memberId');

    fetch('diary-update', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        body: new URLSearchParams(formData)
    })
        .then(res => {
            alert("일기가 수정되었습니다! ✨");
            // 수정 완료 후 상세 보기 화면으로 복귀
            loadDiary(`diary-detail?no=${no}&y=${y}&m=${m}&d=${d}&memberId=${memberId}`);
        })
        .catch(error => console.error("❌ 수정 실패:", error));
}

/**
 * 일기 새 글 등록
 */
function submitDiaryForm() {
    const form = document.getElementById('diaryWriteForm');
    if (!form) return;
    const formData = new FormData(form);

    fetch('diary-write', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        body: new URLSearchParams(formData)
    }).then(() => {
        loadDiary(`diary?y=${formData.get('d_year')}&m=${formData.get('d_month')}&d=${formData.get('d_date')}&memberId=${formData.get('memberId')}`);
    });
}

/**
 * 댓글 등록 (비동기 처리)
 */
function submitReply(no, y, m, d) {
    const form = document.getElementById('replyWriteForm');
    if (!form) return;

    const input = form.querySelector('input[name="r_txt"]');
    if (!input || !input.value.trim()) {
        alert("댓글 내용을 입력해주세요! 😊");
        return;
    }

    const formData = new FormData(form);

    fetch('diary-reply-write', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        body: new URLSearchParams(formData)
    })
        .then(() => {
            input.value = "";
            loadDiary(`diary-detail?no=${no}&y=${y}&m=${m}&d=${d}`);
        })
        .catch(error => console.error("❌ 댓글 등록 에러:", error));
}

/**
 * 댓글 수정 (Prompt 활용)
 */
function updateReply(rNo, dNo) {
    const replySpan = document.getElementById(`reply-text-${rNo}`);
    const oldTxt = replySpan.innerText;
    let newTxt = prompt("댓글을 수정하시겠습니까?", oldTxt);

    if (newTxt === null || newTxt.trim() === "" || newTxt === oldTxt) return;

    fetch(`diary-reply-update?r_no=${rNo}&r_txt=${encodeURIComponent(newTxt)}&d_no=${dNo}`)
        .then(res => res.json())
        .then(data => {
            if(data.result === "success") {
                replySpan.innerText = newTxt;
            }
        });
}

/**
 * 댓글 삭제
 */
function deleteReply(r_no, d_no, y, m, d) {
    if (!confirm("삭제할까요?")) return;
    fetch(`diary-reply-delete?r_no=${r_no}`).then(() => {
        loadDiary(`diary-detail?no=${d_no}&y=${y}&m=${m}&d=${d}`);
    });
}

/**
 * 좋아요 토글
 */
function toggleDiaryLike(dNo) {
    const params = new URLSearchParams();
    params.append('d_no', dNo);
    fetch('diary-like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: params
    })
        .then(res => res.json())
        .then(data => {
            document.getElementById(`heart-icon-${dNo}`).innerHTML = data.isLiked === 1 ? '&#10084;&#65039;' : '&#129293;';
            document.getElementById(`like-count-${dNo}`).innerText = data.likeCount;
        });
}

/**
 * 1. 빠른 날짜 선택기(팝업) 열기/닫기
 */
function openQuickPicker(event) {
    // 팝업을 열 때 이벤트가 문서 전체로 퍼져서 즉시 닫히는 것을 막습니다.
    event.stopPropagation();

    const picker = document.getElementById("quickDatePicker");
    if (picker) {
        // 숨겨져 있으면 보여주고, 보이고 있으면 숨깁니다.
        if (picker.style.display === "block") {
            picker.style.display = "none";
        } else {
            picker.style.display = "block";
        }
    }
}

/**
 * 2. 연도 선택 셀렉트 박스 변경 시
 */
function updateQuickYear(year) {
    // 사용자가 연도를 바꿨을 때의 동작입니다.
    // 보통 연도만 바꿨을 때는 바로 이동하지 않고, 아래 '월' 버튼을 누를 때까지 대기합니다.
    console.log("선택된 연도: " + year + "년 (월을 클릭하면 이동합니다.)");
}

/**
 * 3. 월 버튼 클릭 시 최종 이동
 */
function confirmQuickDate(month) {
    const yearSelect = document.getElementById("quickYearSelect");
    if (!yearSelect) return;

    // 셀렉트 박스에서 현재 선택된 연도를 가져옵니다.
    const selectedYear = yearSelect.value;

    // 팝업을 다시 예쁘게 닫아줍니다.
    const picker = document.getElementById("quickDatePicker");
    if (picker) picker.style.display = "none";

    // 선택한 연도(y)와 월(m)을 가지고 다이어리를 비동기 로드합니다!
    // (loadDiary 함수 내부에 이미 memberId 처리 로직이 있으므로 y, m만 넘겨도 완벽하게 작동합니다)
    loadDiary(`diary?y=${selectedYear}&m=${month}`);
}

/**
 * 4. 💡 [디테일] 바탕(다른 곳) 클릭 시 팝업 스르륵 닫기
 */
document.addEventListener("click", function(e) {
    const picker = document.getElementById("quickDatePicker");
    // 팝업이 열려 있을 때
    if (picker && picker.style.display === "block") {
        // 내가 클릭한 곳이 팝업창 내부가 아니라면? -> 팝업을 닫아라!
        if (!picker.contains(e.target)) {
            picker.style.display = "none";
        }
    }
});