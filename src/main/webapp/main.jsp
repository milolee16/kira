<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html>
<head>

    <title>Minihome</title>

    <link rel="stylesheet" href="/css/index.css">

    <script defer src="/js/minihome.js"></script>

</head>

<body style="margin: 0; padding: 0">

<div class="nb-body" style="min-height: 100vh;">


<div class="nb-tabs">
    <div class="nb-tab active">홈</div>
    <div class="nb-tab">다이어리</div>
    <div class="nb-tab">사진첩</div>
    <div class="nb-tab">방명록</div>
</div>

<div class="nb-body">
    <div class="write-row">
        <input class="write-input" placeholder="지금 기분은 어때요? ✏️"/>
        <button class="write-btn">기록</button>
    </div>

    <div class="posts">
        <div class="post-item">
            <div class="post-header">
                <span class="post-user">DongMin</span>
                <span class="post-date">2026.03.31</span>
            </div>
            <div class="post-text">
                기능 구현 준비 완료! 이 자리에 DB 데이터를 뿌려주세요. 😊
            </div>
        </div>
    </div>
</div>


</body>


</html>