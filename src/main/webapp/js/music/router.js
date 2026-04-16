// router.js — 마퀴 & 스마트폰 화면 갱신 전담
// player.js 로드 이후에 실행되어야 함

// ── 마퀴 텍스트 업데이트 ──────────────────────────────────────
// ✅ 현재 곡만 표시
// [FIX 6] innerHTML → DOM 조작으로 XSS 방지
function updateMarquee() {
    const titleEl = document.getElementById('bgm-title-mp3');
    if (!titleEl || !window.playlist || window.playlist.length === 0) return;

    // ✅ 핵심: currentIndex 대신 currentTrackId로 트랙 찾기
    const track = window.playlist.find(t => t.youtubeId === window.currentTrackId);
    if (!track) return;

    // 기존: titleEl.innerHTML = `<span class="marquee">...<span>${track.title}</span>...</span>`;
    // 수정: textContent 로 삽입
    const inner = document.createElement('span');
    inner.className = 'marquee-inner';
    inner.textContent = '▶ ' + track.title; // XSS 안전

    const outer = document.createElement('span');
    outer.className = 'marquee';
    outer.appendChild(inner);

    titleEl.innerHTML = '';
    titleEl.appendChild(outer);
}

// ── 스마트폰 썸네일 + 링크 + 제목 갱신 ──────────────────────────
function updatePhoneScreen() {
    if (!window.playlist || window.playlist.length === 0) return;

    // ✅ 핵심: currentIndex 대신 currentTrackId로 트랙 찾기
    const track = window.playlist.find(t => t.youtubeId === window.currentTrackId);
    if (!track) return;

    const phoneThumb  = document.getElementById('phone-thumb');
    const ytLink      = document.getElementById('yt-link');
    const titlePhone  = document.getElementById('bgm-title-phone');

    if (phoneThumb) phoneThumb.src       = 'https://img.youtube.com/vi/' + track.youtubeId + '/mqdefault.jpg';
    if (ytLink)     ytLink.href          = 'https://www.youtube.com/watch?v=' + track.youtubeId;
    // if (titlePhone) titlePhone.textContent = '♪ ' + track.title;
}

// ── player.js의 updateIndexNowPlaying에 훅 추가 ──────────────────
// player.js가 먼저 로드되어야 하므로 DOMContentLoaded 이후에 래핑
(function hookPlayerUpdate() {
    const _orig = window.updateIndexNowPlaying;
    if (typeof _orig !== 'function') {
        // player.js가 아직 안 로드됐으면 재시도
        setTimeout(hookPlayerUpdate, 100);
        return;
    }
    window.updateIndexNowPlaying = function () {
        _orig();
        updateMarquee();
        updatePhoneScreen();
    };
})();

// ✅ bgm 페이지가 AJAX로 로드됐을 때 큐 렌더링
window.onBgmPageLoaded = function () {
    if (typeof renderQueue === 'function') renderQueue();
};