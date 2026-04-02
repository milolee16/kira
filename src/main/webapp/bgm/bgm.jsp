<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="/css/index.css">
    <link rel="stylesheet" href="/css/music.css">
    <link href="https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&family=Gaegu:wght@300;400;700&display=swap"
          rel="stylesheet">
    <title></title>
</head>
<body style="margin:0; padding:0;
display:flex; flex-direction:column;
align-items:flex-start; justify-content:flex-start;
min-height:100%;">

<div class="bgm-wrap">
    <div class="bgm-header">🎵 재생목록</div>
    <div id="bgm-queue-list"></div>
</div>

<script src="/js/music/bgm.js"></script>

</body>
</html>