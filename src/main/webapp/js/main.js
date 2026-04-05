// 1. 상태메시지 수정 기능
function editStatus() {
    const currentStatus = document.getElementById('status-text').innerText;
    const newStatus = prompt("새로운 상태 메시지를 입력하세요:", currentStatus);

    // 사용자가 취소를 누르지 않았고 빈칸이 아닐 때만 작동
    if (newStatus !== null && newStatus.trim() !== "") {
        document.getElementById('status-text').innerText = newStatus;
        // 추후 fetch로 DB에 상태메시지 수정 내역을 보내세요!
    }
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