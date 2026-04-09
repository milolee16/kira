<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html>
<head>
    <title>test-title</title>
</head>
<body>
<div class="nb-body home-wrapper">

    <div class="home-status-board">
        <div class="status-left">
            <span class="d-day">✈️ 도쿄 출국 D-100</span>
            <div class="home-status-msg">
                <span id="status-text">${searchMain.st_message}</span>
                <button onclick="editStatus('${sessionScope.loginUserId}')" class="status-edit-btn">[수정]</button>
            </div>
            <div class="post-text">
              기능 구현 준비 완료! 이 자리에 DB 데이터를 뿌려주세요. 😊
            </div>
          </div>
        </div>
        <span class="status-since">Since 2026.03.31</span>
    </div>

    <div class="home-visual">
        <span class="visual-placeholder">${searchMain.main_img}</span>

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
                <p class="update-text">${searchMain.latest_gb_content}</p>
            </div>
        </div>

        <div class="home-qna">
            <h3 class="qna-title">🎲 오늘의 문답</h3>
            <p class="qna-question">Q. ${question}</p>

            <div class="qna-input-area">
                <textarea id="qna-answer" placeholder="다이어리에 기록해 보세요! ✏️"></textarea>
                <button onclick="submitQnA()" class="qna-submit-btn">다이어리 추가 ✍️</button>
            </div>
        </div>

    </div>

</div>


</body>
</html>
