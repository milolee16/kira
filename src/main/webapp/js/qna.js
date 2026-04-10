// 보기 모드 <-> 수정 모드 전환 함수
function toggleEditQnA() {
    const viewMode = document.getElementById("qna-view-mode");
    const editMode = document.getElementById("qna-edit-mode");

    if (viewMode.style.display === "none") {
        viewMode.style.display = "block";
        editMode.style.display = "none";
    } else {
        viewMode.style.display = "none";
        editMode.style.display = "block";
    }
}

// 답변 저장 (신규 작성 & 수정 공통 사용)
function saveQnA(mode) {
    // 신규 작성인지 수정인지에 따라 읽어올 textarea 아이디가 다름
    const textareaId = mode === 'edit' ? "qna-edit-answer" : "qna-answer";
    const answerText = document.getElementById(textareaId).value.trim();

    if (!answerText) {
        alert("답변을 입력해 주세요!");
        return;
    }

    // 서버로 데이터 전송
    fetch('/update-qna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `answer=${encodeURIComponent(answerText)}` // 로그인한 유저 세션은 서버에서 꺼냄!
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("문답이 저장되었습니다! 🍀");
                // 저장 성공 시 홈피를 다시 로드해서 텍스트가 바뀐 걸 보여줌
                loadPage("/home?ajax=true");
            } else {
                alert("저장에 실패했어요 😢");
            }
        })
        .catch(err => console.error("QnA 저장 에러:", err));
}