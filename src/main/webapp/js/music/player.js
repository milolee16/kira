// player.js — index.jsp에서만 로드

let playlist = [];
let currentIndex = 0;
let ytPlayer = null;
let fetchDone = false;
let apiReady = false;
let playerReady = false;

const dummyPlaylist = [
    { title: 'Needygirl Overdose',       youtubeId: 'BnkhBwzBqlQ', duration: 214, trackOrder: 1 },
    { title: '차가운 상어 아가씨',          youtubeId: 'wZlv3qDPfjk', duration: 155, trackOrder: 2 },
    { title: '처형박수 (Execution Clap)', youtubeId: 'YcxhmHEykPg', duration: 194, trackOrder: 3 },
];

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + String(s).padStart(2, '0');
}

// ── index.jsp 미니플레이어 UI 갱신 ──────────────────────────────
function updateIndexNowPlaying() {
    if (!playlist.length) return;
    const track = playlist[currentIndex];

    const phoneThumb = document.getElementById('phone-thumb');
    const ytLink     = document.getElementById('yt-link');
    const bgmTitle   = document.getElementById('bgm-title');

    if (phoneThumb) phoneThumb.src    = 'https://img.youtube.com/vi/' + track.youtubeId + '/mqdefault.jpg';
    if (ytLink)     ytLink.href       = 'https://www.youtube.com/watch?v=' + track.youtubeId;
    if (bgmTitle)   bgmTitle.textContent = '♪ ' + track.title;

    const cur = (ytPlayer && typeof ytPlayer.getCurrentTime === 'function')
        ? Math.floor(ytPlayer.getCurrentTime()) : 0;

    const durationEl  = document.getElementById('bgm-duration');
    const currentEl   = document.getElementById('bgm-current');
    const progressBar = document.getElementById('bgm-progress-bar');

    if (durationEl)  durationEl.textContent  = formatTime(track.duration);
    if (currentEl)   currentEl.textContent   = formatTime(cur);
    if (progressBar) progressBar.style.width = Math.min((cur / track.duration) * 100, 100) + '%';
}

// ── bgm.jsp iframe에 현재 곡 변경 알림 ─────────────────────────
function notifyBgmFrame() {
    const iframe = document.getElementById('bgm-frame');
    if (!iframe || !iframe.contentWindow) return;
    try {
        if (typeof iframe.contentWindow.onParentTrackChanged === 'function') {
            iframe.contentWindow.onParentTrackChanged(currentIndex);
        }
    } catch (e) {}
}

// ── 재생 제어 (bgm.js에서도 window.parent.playTrack으로 호출) ──
function playTrack(index) {
    if (!playerReady) return;
    currentIndex = index;
    ytPlayer.loadVideoById(playlist[currentIndex].youtubeId);
    updateIndexNowPlaying();
    notifyBgmFrame();
}

function playNext() {
    if (!playerReady) return;
    currentIndex = (currentIndex + 1) % playlist.length;
    ytPlayer.loadVideoById(playlist[currentIndex].youtubeId);
    updateIndexNowPlaying();
    notifyBgmFrame();
}

function playPrev() {
    if (!playerReady) return;
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    ytPlayer.loadVideoById(playlist[currentIndex].youtubeId);
    updateIndexNowPlaying();
    notifyBgmFrame();
}

function togglePlay() {
    if (!playerReady) return;  // ✅ 핵심 수정
    ytPlayer.getPlayerState() === YT.PlayerState.PLAYING
        ? ytPlayer.pauseVideo()
        : ytPlayer.playVideo();
}

// ── 플레이어 초기화 (한 번만) ───────────────────────────────────
function initPlayer() {
    if (!playlist.length || !apiReady) return;

    ytPlayer = new YT.Player('yt-player-hidden', {
        width: '0', height: '0',
        videoId: playlist[currentIndex].youtubeId,
        playerVars: { autoplay: 1, controls: 0, rel: 0, playsinline: 1 },
        events: {
            onReady: (event) => {
                playerReady = true;
                event.target.playVideo();  // ✅ onReady 안에서 명시적으로 playVideo() 호출
                updateIndexNowPlaying();
                setInterval(updateIndexNowPlaying, 1000);
                notifyBgmFrame();
            },
            onStateChange: (e) => {
                if (e.data === YT.PlayerState.ENDED) playNext();
                const btn = document.getElementById('bgm-toggle');
                if (btn) btn.textContent = e.data === YT.PlayerState.PLAYING ? '⏸' : '▶';
                notifyBgmFrame();
            }
        }
    });
}

// ── 플레이리스트 로드 ─────────────────────────────────────────
function loadPlaylist(userId) {
    /* 실제 DB 연동 시:
    fetch('/api/bgm?userId=' + userId)
        .then(r => r.json())
        .then(tracks => {
            playlist = tracks;
            currentIndex = 0;
            fetchDone = true;
            if (apiReady) initPlayer();
        });
    return;
    */

    playlist = dummyPlaylist;
    currentIndex = 0;
    fetchDone = true;
    if (apiReady) initPlayer();
}

// ── YouTube API 준비 콜백 ─────────────────────────────────────
window.onYouTubeIframeAPIReady = function () {
    apiReady = true;
    if (fetchDone) initPlayer();
};

// ── 진입점 ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadPlaylist('dongmin');
    // playTrack(0) 호출 금지 — initPlayer → onReady에서 자동 시작
});