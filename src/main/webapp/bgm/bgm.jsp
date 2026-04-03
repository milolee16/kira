<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="/css/index.css">
    <link rel="stylesheet" href="/css/music.css">
    <link href="https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&family=Gaegu:wght@300;400;700&display=swap" rel="stylesheet">
    <title>재생목록</title>
</head>
<body>

<div class="bgm-wrap">

    <%-- 헤더 --%>
    <div class="bgm-header">🎵 재생목록</div>

    <%-- 지금 재생 중 --%>
    <div class="bgm-now">
        <img id="now-thumb" class="bgm-now-thumb"
             src="https://img.youtube.com/vi/BnkhBwzBqlQ/mqdefault.jpg" alt="앨범아트">
        <div class="bgm-now-info">
            <div class="bgm-now-badge">▶ 재생 중</div>
            <div id="now-title" class="bgm-now-title">Needygirl Overdose</div>
            <div class="bgm-now-bar">
                <div id="now-bar-fill" class="bgm-now-bar-fill"></div>
            </div>
        </div>
    </div>

    <%-- 목록 라벨 --%>
    <div class="bgm-queue-label">🎶 전체 목록</div>

    <%-- 트랙 목록 (JS로 렌더링) --%>
    <div id="bgm-queue-list"></div>

</div>

<script src="/js/music/bgm.js"></script>
</body>
</html>