// [1] 다이어리 내용을 비동기로 불러와서 화면을 갈아끼우는 핵심 함수
function loadDiary(url = "diary?ajax=true") {
    // 주소에 ajax=true가 없으면 붙여줌 (상태 유지용)
    if (!url.includes("ajax=true")) {
        url += (url.includes("?") ? "&" : "?") + "ajax=true";
    }

    // 브라우저 콘솔(F12)에서 실제 날아가는 주소를 확인할 수 있게 기록
    console.log("📬 요청 주소:", url);

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("네트워크 응답에 문제가 있습니다. 상태코드: " + response.status);
            }
            return response.text();
        })
        .then((html) => {
            // 서버에서 받은 HTML(diary.jsp 내용)을 속지 영역에 넣기
            const contentArea = document.getElementById("notebook-content");
            if (contentArea) {
                contentArea.innerHTML = html;
            }

            // 일기 목록(d=...)이 열린 경우 해당 위치로 스크롤
            if (url.includes("d=")) {
                const board = document.querySelector(".diary-board");
                if (board) {
                    board.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        })
        .catch((error) => {
            console.error("❌ 다이어리 로드 실패:", error);
        });
}

// [2] 일기 작성 (Create)
function submitDiaryForm() {
    const form = document.getElementById('diaryWriteForm');
    if (!form) return;

    const formData = new FormData(form);
    const params = new URLSearchParams(formData);

    fetch('diary-write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: params
    })
        .then(response => response.text())
        .then(data => {
            const y = formData.get('d_year');
            const m = formData.get('d_month');
            const d = formData.get('d_date');
            loadDiary(`diary?y=${y}&m=${m}&d=${d}`);
        })
        .catch(error => console.error("일기 등록 실패:", error));
}

// [3] 일기 수정 (Update)
function updateDiaryForm() {
    const form = document.getElementById('diaryUpdateForm');
    if (!form) return;

    const formData = new FormData(form);
    const params = new URLSearchParams(formData);

    fetch('diary-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: params
    })
        .then(response => response.text())
        .then(data => {
            const no = formData.get('no');
            const y = formData.get('d_year');
            const m = formData.get('d_month');
            const d = formData.get('d_date');
            // 수정 후 상세 페이지로 이동
            loadDiary(`diary-detail?no=${no}&y=${y}&m=${m}&d=${d}`);
        })
        .catch(error => console.error("일기 수정 실패:", error));
}

// [4] 댓글 등록
function submitReply(no, y, m, d) {
    const form = document.getElementById('replyWriteForm');
    const input = form.querySelector('input[name="r_txt"]');

    if (!input.value.trim()) {
        alert("댓글 내용을 입력해주세요!");
        return;
    }

    const formData = new FormData(form);
    const params = new URLSearchParams(formData);

    fetch('diary-reply-write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: params
    })
        .then(response => response.text())
        .then(data => {
            // 등록 후 상세 페이지 새로고침
            loadDiary(`diary-detail?no=${no}&y=${y}&m=${m}&d=${d}`);
        })
        .catch(error => console.error("댓글 등록 실패:", error));
}

// [5] 댓글 삭제
function deleteReply(r_no, d_no, y, m, d) {
    if (!confirm("이 댓글을 삭제할까요? 🗑️")) return;

    fetch(`diary-reply-delete?r_no=${r_no}`)
        .then(() => {
            loadDiary(`diary-detail?no=${d_no}&y=${y}&m=${m}&d=${d}`);
        })
        .catch(error => console.error("댓글 삭제 실패:", error));
}