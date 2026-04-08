// 1. 상태메시지 수정 기능
function editStatus(host_id) {
    //기존 정보 저장
    const stmSpan = document.getElementById("status-text");
    const originalStm = stmSpan.innerText;

    //수정버튼 숨기기
    const originalEditBtn = document.querySelector(".status-edit-btn");
    originalEditBtn.style.display = "none";

    //확인 취소 버튼 , 입력창
    stmSpan.innerHTML = `
    <input type="text" id="edit-status-input" value="${originalStm}" style="width:150px; font-family:'Gaegu', cursive;">
    <button id="btn-confirm" class="status-edit-btn">[확인]</button>
    <button id="btn-cancel" class="status-edit-btn">[취소]</button>
    `;

    //취소버튼
    document.getElementById("btn-cancel").addEventListener("click", () => {
        stmSpan.innerText = originalStm;
        originalEditBtn.style.display = "inline-block";
    });

    //확인버튼
    document.getElementById("btn-confirm").addEventListener("click", () => {
        const editStM = document.getElementById('edit-status-input').value;
        if(editStM == originalStm){
            stmSpan.innerHTML = originalStm;
            originalEditBtn.style.display = "inline-block";
            return;
        }
        const encodedMsg = encodeURIComponent(editStM);
        fetch(`/editStMessage?host_id=${host_id}&editStM=${encodedMsg}`)
            .then(response => response.json())
            .then(editRes => {
                stmSpan.innerText = editStM;
                originalEditBtn.style.display = "inline-block";
            })
            .catch(error => {
                console.error('상태메세지 수정 실패:', error);
                stmSpan.innerText = originalStm;
                originalEditBtn.style.display = "inline-block";
            });
    })


}

// 2. 랜덤 문답 제출 기능
function submitQnA() {
    const answer = document.getElementById('qna-answer').value;

    if(answer.trim() === "") {
        alert("답변을 입력해주세요!");
        return;
    }

    // 추후 다이어리 insert 하는 fetch 로직 추가
    alert("다이어리에 성공적으로 기록되었습니다! 📝");
    document.getElementById('qna-answer').value = ""; // 입력창 비우기
}

// 3. 좋아요(하트) 토글 기능
let isLiked = false; // (임시) DB에서 가져올 내가 좋아요 누른 여부
let likeCount = 12;  // (임시) DB에서 가져올 총 좋아요 개수

function toggleLike() {
    isLiked = !isLiked;
    const icon = document.getElementById('like-icon');
    const count = document.getElementById('like-count');

    if (isLiked) {
        icon.innerText = '❤️';
        icon.style.transform = 'scale(1.2)'; // 뿅! 하고 커짐
        likeCount++;
    } else {
        icon.innerText = '🤍';
        icon.style.transform = 'scale(1)';   // 다시 원래대로
        likeCount--;
    }

    count.innerText = likeCount;

    // 추후 fetch로 좋아요 증감 내역을 DB에 저장하세요!
}