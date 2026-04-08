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
        <div id="bgm-queue-header" class="bgm-queue-header"></div>
<%--        <span class="bgm-queue-label">재생목록</span>--%>
        <br>
        <button class="bgm-add-btn" id="bgm-add-btn" title="곡 추가">
            ＋ 곡 추가
        </button>
    </div>

    <%-- ── 재생목록 ── --%>
    <div id="bgm-queue-list"></div>

    <%-- ── 곡 추가 모달 ── --%>
    <div id="bgm-add-modal" class="bgm-modal-overlay" style="display:none;">
        <div class="bgm-modal">
            <div class="bgm-modal-title">🎵 곡 추가하기</div>

            <input id="bgm-add-url" class="bgm-modal-input" type="text" placeholder="YouTube URL을 붙여넣어요" />

            <div id="bgm-duration-input-row" style="display:none; margin-top: 15px; margin-bottom: 10px; flex-direction: column; gap: 8px; align-items: center; font-family: 'Gaegu', sans-serif;">
                <div style="display: flex; gap: 8px; justify-content: center; align-items: center;">
                    <span style="font-size: 0.9em; color: #666;">재생 시간:</span>
                    <input id="bgm-input-min" type="number" min="0" placeholder="0" style="width: 45px; padding: 5px; border: 1px solid #ddd; border-radius: 5px; text-align: center;"> 분
                    <input id="bgm-input-sec" type="number" min="0" max="59" placeholder="0" style="width: 45px; padding: 5px; border: 1px solid #ddd; border-radius: 5px; text-align: center;"> 초
                </div>

                <div style="font-size: 0.85em; color: #88a; background: #f0f7ff; padding: 4px 10px; border-radius: 12px; margin-top: 5px; text-align: center; line-height: 1.4;">
                    💡 길이를 잘 모르면 1분인 상태로 그냥 추가하셔도 돼요!<br>
                    재생이 한번 실행된 이후에 자동적으로 맞춰진답니다!
                </div>
            </div>

            <div id="bgm-add-preview" class="bgm-add-preview" style="display:none;">
                <img id="bgm-preview-thumb" src="" alt="썸네일" class="bgm-preview-thumb" />
                <div class="bgm-preview-info">
                    <div id="bgm-preview-title" class="bgm-preview-title" style="font-weight: bold; margin-bottom: 5px;"></div>
                    <span id="bgm-preview-duration" class="bgm-preview-duration" style="font-size: 0.85em; color: #888;"></span>
                </div>
            </div>

            <div id="bgm-add-msg" class="bgm-add-msg" style="display:none; margin-top: 10px;"></div>

            <div class="bgm-modal-btns" style="margin-top: 20px;">
                <button id="bgm-preview-btn" class="bgm-add-btn" onclick="bgmPreview()">미리보기</button>
                <button id="bgm-confirm-btn" class="bgm-add-btn bgm-confirm-btn" style="display:none;" onclick="bgmConfirmAdd()">추가하기</button>
                <button class="bgm-cancel-btn" onclick="closeBgmModal()">닫기</button>
            </div>
        </div>
    </div>

</div>

<script src="<c:url value='/js/music/bgm.js' />"></script>

</body>
</html>