<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <title>JSP - Hello World</title>
  <link rel="stylesheet" href="css/index.css">
  <link rel="stylesheet" href="css/visitor.css">
  <link rel="stylesheet" href="css/guestboard.css">
  <link rel="stylesheet" href="css/diary.css">
  <%-- JS는 defer로 통일, 중복 제거 --%>
  <script defer src="/js/minihome.js"></script>
  <script defer src="/js/ajax.js"></script>
  <script defer src="js/guestboard.js"></script>
  <script defer src="js/diary.js"></script>
</head>
<body>
<div class="desk-wrapper">
  <div class="desk-surface">

    <%-- ══ 왼쪽: 프로필 + 메뉴 + 색연필통 ══ --%>
    <div class="left-col">
      <div class="profile">
        <div class="profile-card">
          <div class="profile-photo">🌬️</div>
          <div class="profile-name">DongMin</div>
          <div class="profile-mood">
            햇살 가득한 오후,<br/>기분 좋은 바람... 🍃<br/>
            <span style="font-size: 11px; color: #c0b0a0">since 2005</span>
          </div>
        </div>
        <div class="menu-card">
          <div class="menu-list">
            <div class="menu-item ${content eq 'main.jsp' ? 'active' : ''}"
                 data-src="/home?ajax=true">홈
            </div>
            <div class="menu-item ${content eq 'diary/diary.jsp' ? 'active' : ''}"
                 data-src="/diary?ajax=true">다이어리
            </div>
            <div class="menu-item ${content eq 'pic/pic.jsp' ? 'active' : ''}"
                 data-src="/pic?ajax=true">사진첩
            </div>
            <div class="menu-item ${content eq 'board/board.jsp' ? 'active' : ''}"
                 data-src="/board?ajax=true">방명록
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
    <%-- ══ /왼쪽 ══ --%>

    <%-- is-visitor는 switchTab()이 토글 --%>
    <div class="notebook ${content eq 'board/board.jsp' ? 'is-visitor' : ''}"
         id="notebook">
      <div class="notebook-header">
        <h2>📖 DongMin의 소소한 일상</h2>
        <div class="visitor">Today 15 | Total 1,234</div>
      </div>

      <div class="nb-tabs">
        <div class="nb-tab ${content eq 'main.jsp' ? 'active' : ''}"
             data-src="/home?ajax=true">홈
        </div>
        <div class="nb-tab ${content eq 'diary/diary.jsp' ? 'active' : ''}"
             data-src="/diary?ajax=true">다이어리
        </div>
        <div class="nb-tab ${content eq 'photo/photo.jsp' ? 'active' : ''}"
             data-src="/photo?ajax=true">사진첩
        </div>
        <div class="nb-tab ${content eq 'board/board.jsp' ? 'active' : ''}"
             data-src="/board?ajax=true">방명록
        </div>
      </div>

      <%-- ✅ iframe → AJAX 컨테이너로 교체 --%>
      <div id="notebook-content" class="notebook-content">
        <%-- 로딩 스피너 (초기 렌더링 전 표시) --%>
        <div class="nb-loading" id="nb-loading">
          <div class="nb-spinner"></div>
        </div>
      </div>
    </div>
    <%-- ══ /가운데 ══ --%>

    <%-- ══ 오른쪽: MP3 + 스마트폰 + 포스트잇 ══ --%>
    <div class="right-col">

      <div class="mp3">
        <div class="mp3-screen">
          <div class="mp3-marquee">
                        <span id="bgm-title" class="mp3-title-inner"
                              data-src="/bgm?ajax=true"
                              style="cursor: pointer;">
                            ♪ Hype Boy - NewJeans &nbsp;&nbsp;&nbsp;&nbsp;
                            ♪ Attention - NewJeans
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
          <div class="mp3-btn play" id="bgm-toggle" onclick="togglePlay()">⏸</div>
          <div class="mp3-btn" onclick="playNext()">▶▶</div>
        </div>
      </div>

      <div class="smartphone">
        <div class="phone-camera"></div>
        <div class="phone-screen"
             data-src="/bgm?ajax=true"
             style="cursor: pointer;">
          <div id="yt-player">
            <img src="https://img.youtube.com/vi/BnkhBwzBqlQ/mqdefault.jpg">
          </div>
          <a id="yt-link" href="#" target="_blank" class="phone-yt-link">
            ▶ YouTube에서 보기
          </a>
        </div>
        <div class="phone-home"
             data-src="/bgm?ajax=true"
             style="cursor: pointer"></div>
      </div>

      <div class="visitor-btn-wrap"
           onclick="switchTab('/visitor?ajax=true')">
        <div class="visitor-btn-card">
          <span class="visitor-icon">🐾</span>
          <span class="visitor-text">방문자 보기</span>
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
</div>

<div id="yt-player-hidden" style="display:none;"></div>
<script src="https://www.youtube.com/iframe_api"></script>
<script src="/js/music/player.js"></script>
<script src="/js/music/router.js"></script>

</body>
</html>