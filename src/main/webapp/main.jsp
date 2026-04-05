<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html>
<head>
    <title>미니홈피 홈</title>
</head>
<body>
<div class="nb-body home-wrapper">

    <div class="home-status-board">
        <div class="status-left">
            <span class="d-day">✈️ 도쿄 출국 D-100</span>
            <div class="home-status-msg">
                <span id="status-text">요즘 코딩이 제일 재밌어요! 💻✨</span>
                <button onclick="editStatus()" class="status-edit-btn">[수정]</button>
            </div>
        </div>
        <span class="status-since">Since 2026.03.31</span>
    </div>

    <div class="home-visual">
        <span class="visual-placeholder">(예쁜 미니룸 이미지나 커버 사진)</span>

        <div onclick="toggleLike()" class="like-btn">
            <span id="like-icon">🤍</span>
            <span id="like-count">12</span>
        </div>
    </div>

    <div class="home-bottom-row">

        <div class="home-updates">
            <div class="update-box">
                <h4 class="update-title diary-title">📝 최근 다이어리</h4>
                <p class="update-text">오늘 자바스크립트 버그 드디어 잡았다...</p>
            </div>
            <div class="update-box">
                <h4 class="update-title gb-title">🐾 최근 방명록</h4>
                <p class="update-text">안녕하세요! 파도타고 왔어요~</p>
            </div>
        </div>

        <div class="home-qna">
            <h3 class="qna-title">🎲 오늘의 문답</h3>
            <p class="qna-question">Q. 타임머신을 타고 갈 수 있다면?</p>

            <div class="qna-input-area">
                <textarea id="qna-answer" placeholder="다이어리에 기록해 보세요! ✏️"></textarea>
                <button onclick="submitQnA()" class="qna-submit-btn">다이어리 추가 ✍️</button>
            </div>
        </div>

    </div>

</div>


</body>
</html>