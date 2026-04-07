<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>재생목록</title>

    <link rel="stylesheet" href="<c:url value='/css/index.css' />">
    <link rel="stylesheet" href="<c:url value='/css/music.css' />">
    <link href="https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&family=Gaegu:wght@300;400;700&display=swap" rel="stylesheet">
</head>
<body>

<div class="bgm-wrap">

    <div class="bgm-header">🎵 현재 재생중</div>

    <div class="bgm-now">
        <img id="now-thumb" class="bgm-now-thumb"
             src="https://img.youtube.com/vi/BnkhBwzBqlQ/mqdefault.jpg"
             alt="현재 재생 중 썸네일">
        <div class="bgm-now-info">
            <div class="bgm-now-badge">▶ 재생 중</div>
            <div id="now-title" class="bgm-now-title">Needygirl Overdose</div>
            <div class="bgm-now-bar">
                <div id="now-bar-fill" class="bgm-now-bar-fill"></div>
            </div>
        </div>
    </div>

    <%-- ── 곡 추가 버튼 영역 ── --%>
    <div class="bgm-add-row">
        <span class="bgm-queue-label">재생목록</span>
        <br>
        <button class="bgm-add-btn" id="bgm-add-btn" title="곡 추가">
            ＋ 곡 추가
        </button>
    </div>

    <%-- ── 재생목록 ── --%>
    <div id="bgm-queue-list"></div>

    <%-- ── 곡 추가 모달 ── --%>
    <div id="bgm-modal-overlay" class="bgm-modal-overlay" style="display:none;">
        <div class="bgm-modal">
            <div class="bgm-modal-title">♪ 곡 추가</div>
            <input id="bgm-input-id"    class="bgm-modal-input" type="text" placeholder="YouTube ID (예: 5y_KJAg8bHI)">
            <input id="bgm-input-title" class="bgm-modal-input" type="text" placeholder="곡 제목">
            <input id="bgm-input-dur"   class="bgm-modal-input" type="number" placeholder="재생시간 (초)">
            <div class="bgm-modal-btns">
                <button class="bgm-modal-cancel" id="bgm-modal-cancel">취소</button>
                <button class="bgm-modal-submit" id="bgm-modal-submit">추가</button>
            </div>
        </div>
    </div>

</div>

<script src="<c:url value='/js/music/bgm.js' />"></script>

</body>
</html>