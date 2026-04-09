<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <%-- 라이브러리 --%>
    <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"
    />
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script src="https://npmcdn.com/flatpickr/dist/l10n/ko.js"></script>

    <%-- CSS --%>
    <link rel="stylesheet" href="css/index.css"/>
    <link rel="stylesheet" href="css/visitor.css"/>
    <link rel="stylesheet" href="css/guestboard.css"/>
    <link rel="stylesheet" href="css/diary.css"/>
    <link rel="stylesheet" href="css/main.css"/>
    <link rel="stylesheet" href="css/search.css"/>
    <link rel="stylesheet" href="css/user/loginbox.css"/>
    <%-- JS --%>
    <script src="js/index.js"></script>
    <script src="js/guestboard.js"></script>
    <script src="js/diary.js"></script>
    <script src="js/visitor.js"></script>
    <script defer src="js/ajax.js"></script>
    <script defer src="js/main.js"></script>

    <title>Team Kira - Minihompy</title>
</head>
<body>
<div class="desk-wrapper">
    <div class="desk-surface">

        <!-- 로그인 박스 -->
        <div class="top-login-box">
            <div class="top-login-name" id="goMyHome" style="cursor:pointer;">
                ${sessionScope.loginUserNickname}님
            </div>
            <div class="top-login-text">환영합니다 🌷</div>

            <div class="top-login-btns">
                <a href="${pageContext.request.contextPath}/mypage" class="top-login-btn">마이페이지</a>
                <a href="${pageContext.request.contextPath}/logout" class="top-login-btn logout">로그아웃</a>
            </div>
        </div>
        <%-- ══ 왼쪽: 프로필 + 메뉴 + 색연필통 ══ --%>
        <div class="left-col">
            <div class="profile">
                <%-- profile-card 시작 (여기에 인라인 스타일 절대 넣지 마라!) --%>
                <div class="profile-card">

                    <%-- 🚨 [수정] 깔끔하게 클래스만 부여한 일촌 버튼 영역 --%>
                    <div class="friend-btn-wrapper">
                        <button id="btn-friend-action" class="friend-action-btn" style="display:none;" onclick="handleFriendAction()"></button>
                    </div>

                    <div class="profile-photo">🌬️</div>
                    <div class="profile-name" id="profile-name" style="visibility:hidden;"></div>
                    <div class="profile-mood">
                        햇살 가득한 오후,<br/>기분 좋은 바람... 🍃<br/>
                        <span style="font-size: 11px; color: #c0b0a0">since 2005</span>
                    </div>
                </div>
                <div class="menu-card">
                    <div class="menu-list">
                        <div
                                class="menu-item ${content eq 'main.jsp' ? 'active' : ''}"
                                data-src="${pageContext.request.contextPath}/home?ajax=true"
                        >
                            홈
                        </div>
                        <div
                                class="menu-item ${content eq 'diary/diary.jsp' ? 'active' : ''}"
                                data-src="${pageContext.request.contextPath}/diary?ajax=true"
                        >
                            다이어리
                        </div>
                        <div
                                class="menu-item ${content eq 'pic/pic.jsp' ? 'active' : ''}"
                                data-src="${pageContext.request.contextPath}/photo?ajax=true"
                        >
                            사진첩
                        </div>
                        <div
                                class="menu-item ${content eq 'board/board.jsp' ? 'active' : ''}"
                                data-src="${pageContext.request.contextPath}/board/board.jsp"
                        >
                            방명록
                        </div>
                    </div>
                </div>

            </div>

            <div class="pencil-jar-wrap">
                <div class="tools-out">
                    <div class="tool pencil1"></div>
                    <div class="tool pencil2"></div>
                    <div class="tool pencil3"></div>
                </div>
                <div class="jar"></div>
                <div class="jar-label">꾸미기</div>
            </div>
        </div>
        <%-- ══ /왼쪽 ══ --%> <%-- is-visitor는 switchTab()이 토글 --%>
        <div
                class="notebook ${content eq 'board/board.jsp' ? 'is-visitor' : ''}"
                id="notebook"
        >

            <div class="notebook-header">
                <h2><span id="host-title"> 📖 Team Kira의 소소한 일상</span></h2>
                <div class="mini-search-wrapper">
                    <input
                            type="text"
                            id="live-search-input"
                            placeholder="이름, 닉네임 검색 🌊"
                            autocomplete="off"
                    />
                    <span class="search-icon">🔍</span>


                    <div id="search-dropdown" class="search-dropdown hidden"></div>
                </div>
                <div class="visitor">Today <span id="v-today">0</span> | Total <span id="v-total">0</span></div>
            </div>
            <div class="nb-tabs">
                <div
                        class="nb-tab ${content eq 'main.jsp' ? 'active' : ''}"
                        data-src="/home?ajax=true"
                >
                    홈
                </div>
                <div
                        class="nb-tab ${content eq 'diary/diary.jsp' ? 'active' : ''}"
                        data-src="/diary?ajax=true"
                >
                    다이어리
                </div>
                <div
                        class="nb-tab ${content eq 'photo/photo.jsp' ? 'active' : ''}"
                        data-src="photo/photo.jsp"
                >
                    사진첩
                </div>
                <div
                        class="nb-tab ${content eq 'board/board.jsp' ? 'active' : ''}"
                        data-src="board/board.jsp"
                >
                    방명록
                </div>
            </div>

            <%-- ✅ iframe → AJAX 컨테이너로 교체 --%>
            <div
                    id="notebook-content"
                    class="notebook-content"
                    style="flex: 1; width: 100%; overflow-y: auto; padding: 10px"
            >
                <%-- 로딩 스피너 (초기 렌더링 전 표시) --%>
                <div class="nb-loading" id="nb-loading">
                    <div class="nb-spinner"></div>
                </div>
            </div>
        </div>
        <%-- ══ /가운데 ══ --%> <%-- ══ 오른쪽: MP3 + 스마트폰 + 포스트잇 ══
        --%>
        <div class="right-col">
            <div class="mp3">
                <div class="mp3-screen">
                    <div class="mp3-marquee">
                <span
                        id="bgm-title-mp3"
                        class="mp3-title-inner"
                        data-src="/bgm?ajax=true"
                        style="cursor: pointer"
                >
                  ♪ NeedygirlOverDose
                </span>
                    </div>
                    <div class="mp3-controls-row">
                        <div class="mp3-time" id="bgm-current">0:00</div>
                        <div class="mp3-bar-mini">
                            <div class="mp3-fill-mini" id="bgm-progress-bar"></div>
                        </div>
                        <div class="mp3-time" id="bgm-duration">0:00</div>
                    </div>
                </div>
                <div class="mp3-buttons">
                    <div class="mp3-btn" onclick="playPrev()">◀◀</div>
                    <div class="mp3-btn play" id="bgm-toggle" onclick="togglePlay()">
                        ⏸
                    </div>
                    <div class="mp3-btn" onclick="playNext()">▶▶</div>
                </div>
            </div>


            <!-- 스마트폰 영역 -->
            <div class="smartphone">
                <div class="phone-camera"></div>
                <div class="phone-screen" style="cursor: pointer">

                    <div class="phone-thumb-wrapper">
                        <img id="phone-thumb-blur" src="" alt="">

                        <img id="phone-thumb" src="https://img.youtube.com/vi//mqdefault.jpg"
                             alt="현재 재생 중 썸네일" />
                    </div>

                    <a id="yt-link" href="#" target="_blank" class="phone-yt-link">▶ YouTube에서 보기</a>
                    <div class="text" id="bgm-title-phone">♪ 곡 제목</div>
                </div>
                <div class="phone-home"
                     data-src="/bgm?ajax=true"
                     style="cursor: pointer">
                </div>
            </div>
            <%-- 방문자 보기도 iframe 방식으로 --%>

            <div class="v-recent-widget">
                <div class="v-widget-title">방문자</div>

                <ul id="v-recent-list">
                    <li class="v-empty">불러오는 중...</li>
                </ul>

                <div class="v-widget-btn" onclick="vloadPage('${pageContext.request.contextPath}/visitor?ajax=true')">
                    <span class="v-btn-text">방문자 보기 ▶</span>
                </div>
            </div>

        </div>
        <div class="postit">
            오늘도<br/>몽글몽글한<br/>하루 보내장🌤<br/>
            <span style="font-size: 12px; color: #8a8030">— 2026.03.31</span>
        </div>
    </div>
</div>
<div class="desk-front"></div>


<script>
    // 로그인 시 u_id, 비로그인 시 null
    const loginUserPk = "${sessionScope.loginUserPk}";
    // player.js나 다른 JS 파일들이 어떤 이름을 쓰더라도 호환되도록 별칭(Alias) 설정
    const loginUserId = "${sessionScope.loginUserId}";
    // 새로고침 닉네임
    const loginUserNickname = "${sessionScope.loginUserNickname}";
</script>

<div id="yt-player-hidden" style="display: none"></div>
<script src="https://www.youtube.com/iframe_api"></script>
<script src="js/music/player.js"></script>
<script src="js/music/router.js"></script>
<script src="js/photo.js"></script>
<script src="js/user/home.js"></script>
<script src="js/user/logout.js"></script>
</body>
</html>
