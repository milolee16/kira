// bgm.js — bgm.jsp 안에서만 로드
// YouTube API, player.js 절대 로드 금지

// ── parent 안전 참조 ──────────────────────────────────────────
function getParent() {
    try {
        // 직접 URL 접속 방어
        return window.parent !== window ? window.parent : null;
    } catch (e) {
        return null;
    }
}

// ── 전체 목록 렌더링 ──────────────────────────────────────────
function renderQueue() {
    const par = getParent();
    if (!par) return;

    const playlist = par.playlist;
    const currentIndex = par.currentIndex || 0;

    if (!playlist || playlist.length === 0) {
        setTimeout(renderQueue, 500);  // 아직 로드 안 됐으면 재시도
        return;
    }

    const container = document.getElementById('bgm-queue-list');
    if (!container) return;

    container.innerHTML = '';
    playlist.forEach((track, i) => {
        const item = document.createElement('div');
        item.className = 'bgm-queue-item' + (i === currentIndex ? ' active' : '');
        item.innerHTML = `
            <img class="bgm-queue-thumb"
                 src="https://img.youtube.com/vi/${track.youtubeId}/mqdefault.jpg"
                 alt="${track.title}">
            <span class="bgm-queue-title">${track.title}</span>
            <span class="bgm-queue-duration">${formatTime(track.duration)}</span>
        `;
        item.addEventListener('click', () => {
            if (typeof par.playTrack === 'function') {
                par.playTrack(i);
            }
        });
        container.appendChild(item);
    });

    updateNowPlaying(playlist[currentIndex], currentIndex);
}

// ── 현재 재생 중 UI 갱신 ─────────────────────────────────────
function updateNowPlaying(track, index) {
    if (!track) return;

    const nowThumb = document.getElementById('now-thumb');
    const nowTitle = document.getElementById('now-title');
    const barFill  = document.getElementById('now-bar-fill');

    if (nowThumb) nowThumb.src          = 'https://img.youtube.com/vi/' + track.youtubeId + '/mqdefault.jpg';
    if (nowTitle) nowTitle.textContent  = track.title;

    // active 클래스 갱신
    document.querySelectorAll('.bgm-queue-item').forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });
}

// ── parent가 호출하는 콜백 (곡 변경 알림 수신) ──────────────────
window.onParentTrackChanged = function (index) {
    const par = getParent();
    if (!par || !par.playlist) return;
    updateNowPlaying(par.playlist[index], index);
};

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + String(s).padStart(2, '0');
}

// ── 진입점 ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    renderQueue();
});