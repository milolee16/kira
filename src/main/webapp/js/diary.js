/**
 * [최종] 다이어리 내용을 비동기로 불러오는 핵심 함수
 */
function loadDiary(url = "diary") {
    // 1. URL과 파라미터 분리
    let baseUrl = url.split('?')[0];
    let queryParams = new URLSearchParams(url.split('?')[1] || "");

    // 2. 비동기 필수 파라미터 추가
    queryParams.set("ajax", "true");

    // ★ index.js가 저장한 '방문 중인 홈피 주인 ID'를 가져옵니다.
    const currentHostId = sessionStorage.getItem("currentHostId");

    if (currentHostId) {
        // 방문 중인 주인 ID로 강제 교체
        queryParams.set("memberId", currentHostId);
    }

    // 아이디랑 날짜 다 정리했으니 서버가 데이터 가져오게 요청
    const finalUrl = baseUrl + "?" + queryParams.toString();
    console.log("📬 다이어리 서버 요청 주소:", finalUrl);

    fetch(finalUrl)
        .then((response) => response.text())
        .then((html) => {
            const contentArea = document.getElementById("notebook-content");
            if (contentArea) {
                contentArea.innerHTML = html;

                // 날짜 클릭 시 목록으로 스크롤
                if (queryParams.has("d")) {
                    setTimeout(() => {
                        const board = document.querySelector(".diary-board");
                        if (board) board.scrollIntoView({behavior: "smooth", block: "start"});
                    }, 50);
                } else {
                    window.scrollTo({top: 0, behavior: 'smooth'});
                }
            }
        })
        .catch((error) => console.error("❌ 다이어리 로드 실패:", error));
}

function submitDiaryForm() {
    const form = document.getElementById('diaryWriteForm');
    if (!form) return;
    const formData = new FormData(form);
    const params = new URLSearchParams(formData);
    fetch('diary-write', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        body: params
    })
        // ★ [수정] memberId를 함께 전달해야 남의 홈피에서 글 쓴 후 올바른 목록으로 돌아옴
        .then(() => loadDiary(`diary?y=${formData.get('d_year')}&m=${formData.get('d_month')}&d=${formData.get('d_date')}&memberId=${formData.get('memberId')}`));
}

function updateDiaryForm() {
    const form = document.getElementById('diaryUpdateForm');
    if (!form) return;
    const formData = new FormData(form);
    const params = new URLSearchParams(formData);
    fetch('diary-update', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        body: params
    })
        // ★ [수정] memberId를 함께 전달해야 수정 후 올바른 상세보기로 돌아옴
        .then(() => loadDiary(`diary-detail?no=${formData.get('no')}&y=${formData.get('d_year')}&m=${formData.get('d_month')}&d=${formData.get('d_date')}&memberId=${formData.get('memberId')}`));
}

function submitReply(no, y, m, d) {
    const form = document.getElementById('replyWriteForm');
    const input = form.querySelector('input[name="r_txt"]');
    if (!input.value.trim()) {
        alert("댓글 내용을 입력해주세요! 😊");
        return;
    }
    const params = new URLSearchParams(new FormData(form));
    fetch('diary-reply-write', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        body: params
    })
        .then(() => {
            input.value = "";
            loadDiary(`diary-detail?no=${no}&y=${y}&m=${m}&d=${d}`);
        });
}

function deleteReply(r_no, d_no, y, m, d) {
    if (!confirm("삭제할까요?")) return;
    fetch(`diary-reply-delete?r_no=${r_no}`).then(() => loadDiary(`diary-detail?no=${d_no}&y=${y}&m=${m}&d=${d}`));
}

let currentPickerYear = new Date().getFullYear();

function openQuickPicker(e) {
    e.stopPropagation(); //버튼을 눌렀을 때 클릭 이벤트가 부모 요소로 퍼지는 걸 막아서, 피커를 열자마자 닫히는 불상사를 방지.
    document.getElementById('quickDatePicker').style.display = 'block';
}

function updateQuickYear(val) {
    currentPickerYear = val;
}

function confirmQuickDate(month) {
    loadDiary(`diary?y=${currentPickerYear}&m=${month}`);
    document.getElementById('quickDatePicker').style.display = 'none';
}

window.addEventListener('click', function (e) {
    const picker = document.getElementById('quickDatePicker');
    if (picker && !picker.contains(e.target)) picker.style.display = 'none';
});

// =====================================
// [최종] 다이어리 전용 좋아요 토글 기능 (이름 충돌 방지)
// =====================================
function toggleDiaryLike(dNo) {
    const params = new URLSearchParams();
    params.append('d_no', dNo);

    fetch('diary-like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: params
    })
        .then(response => {
            if (!response.ok) {
                alert("로그인이 필요한 기능입니다!");
                throw new Error("로그인 필요");
            }
            return response.json();
        })
        .then(data => {
            const heartIcon = document.getElementById(`heart-icon-${dNo}`);
            const likeCountSpan = document.getElementById(`like-count-${dNo}`);

            if (heartIcon && likeCountSpan) {
                // HTML 엔티티를 사용하여 하트 상태 업데이트
                heartIcon.innerHTML = data.isLiked === 1 ? '&#10084;&#65039;' : '&#129293;';
                // 총 좋아요 개수 업데이트
                likeCountSpan.innerText = data.likeCount;
            }
        })
        .catch(error => console.error("좋아요 처리 실패:", error));
}