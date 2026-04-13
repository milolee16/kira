/**
 * [최종] 다이어리 내부 스크롤 전용 loadDiary
 */
function loadDiary(url = "diary") {
    // 1. URL과 파라미터 분리
    let baseUrl = url.split('?')[0];
    let queryParams = new URLSearchParams(url.split('?')[1] || "");

    // 2. 비동기 필수 파라미터 추가
    queryParams.set("ajax", "true");

    // index.js가 저장한 '방문 중인 홈피 주인 ID'를 가져와서 세팅
    const currentHostId = sessionStorage.getItem("currentHostId");
    if (currentHostId) {
        queryParams.set("memberId", currentHostId);
    }

    const finalUrl = baseUrl + "?" + queryParams.toString();
    console.log("📬 다이어리 서버 요청 주소:", finalUrl);

    fetch(finalUrl)
        .then((response) => response.text())
        .then((html) => {
            const contentArea = document.getElementById("notebook-content");
            if (contentArea) {
                // 새로운 HTML 주입
                contentArea.innerHTML = html;

                // [핵심] 브라우저 window가 아니라 '다이어리 종이 상자' 내부 스크롤만 맨 위로!
                contentArea.scrollTop = 0;

                // 날짜 클릭 시 게시판 목록 시작점으로 내부 스크롤만 부드럽게 이동
                if (queryParams.has("d")) {
                    setTimeout(() => {
                        const board = document.querySelector(".diary-board");
                        if (board) {
                            // 상자(contentArea) 내에서의 상대 위치 계산
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
        .catch((error) => console.error("❌ 다이어리 로드 실패:", error));
}

/**
 * 일기 등록 (POST 후 해당 날짜 목록으로 비동기 이동)
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
 * 댓글 수정 (비동기 처리 - prompt 활용)
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
 * 댓글 등록 (비동기 처리)
 */
function submitReply(no, y, m, d) {
    const form = document.getElementById('replyWriteForm');
    const input = form.querySelector('input[name="r_txt"]');
    if (!input.value.trim()) return;

    fetch('diary-reply-write', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        body: new URLSearchParams(new FormData(form))
    }).then(() => {
        input.value = "";
        loadDiary(`diary-detail?no=${no}&y=${y}&m=${m}&d=${d}`);
    });
}

/**
 * 댓글 삭제 (비동기 처리)
 */
function deleteReply(r_no, d_no, y, m, d) {
    if (!confirm("삭제할까요?")) return;
    fetch(`diary-reply-delete?r_no=${r_no}`).then(() => {
        loadDiary(`diary-detail?no=${d_no}&y=${y}&m=${m}&d=${d}`);
    });
}

/**
 * 다이어리 좋아요 토글 (비동기 처리)
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