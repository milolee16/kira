let playlist = [];
let currentIndex = 0;
let ytPlayer = null;
let progressTimer = null;
let fetchDone = false;
let apiReady = false;

// ── fetch가 먼저 끝나도, API가 먼저 준비돼도 둘 다 될 때만 시작 ──
function loadPlaylist(userId) {
    fetch('/api/bgm?userId=' + userId)
        .then(res => res.json())
        .then(tracks => {
            playlist = tracks;
            fetchDone = true;
            if (apiReady) initPlayer();
        });
}

function onYouTubeIframeAPIReady() {
    apiReady = true;
    if (fetchDone) initPlayer();
}

function initPlayer() {
    if (playlist.length === 0) return;

    ytPlayer = new YT.Player('yt-player', {
        width: '100%', height: '100%',
        videoId: playlist[0].youtubeId,
        playerVars: { autoplay: 1, controls: 0, rel: 0, playsinline: 1 },
        events: {
            onReady: () => updateUI(0),
            onStateChange: onStateChange
        }
    });
}

function onStateChange(e) {
    if (e.data === YT.PlayerState.PLAYING) {
        document.getElementById('bgm-toggle').textContent = '⏸';
        startTimer();
    } else if (e.data === YT.PlayerState.PAUSED) {
        document.getElementById('bgm-toggle').textContent = '▶';
        clearInterval(progressTimer);
    } else if (e.data === YT.PlayerState.ENDED) {
        playNext();
    }
}

function updateUI(index) {
    const track = playlist[index];
    if (!track) return;
    document.getElementById('bgm-title').textContent = '♪ ' + track.title;
    document.getElementById('bgm-duration').textContent = formatTime(track.duration);
    document.getElementById('bgm-current').textContent = '0:00';
    document.getElementById('bgm-progress-bar').style.width = '0%';
    document.getElementById('yt-link').href =
        'https://www.youtube.com/watch?v=' + track.youtubeId;
}

function startTimer() {
    clearInterval(progressTimer);
    progressTimer = setInterval(() => {
        if (!ytPlayer?.getCurrentTime) return;
        const cur = Math.floor(ytPlayer.getCurrentTime());
        const total = playlist[currentIndex]?.duration || 1;
        document.getElementById('bgm-current').textContent = formatTime(cur);
        document.getElementById('bgm-progress-bar').style.width =
            Math.min((cur / total) * 100, 100) + '%';
    }, 1000);
}

function togglePlay() {
    if (!ytPlayer) return;
    ytPlayer.getPlayerState() === YT.PlayerState.PLAYING
        ? ytPlayer.pauseVideo() : ytPlayer.playVideo();
}

function playNext() {
    currentIndex = (currentIndex + 1) % playlist.length;
    ytPlayer.loadVideoById(playlist[currentIndex].youtubeId);
    updateUI(currentIndex);
}

function playPrev() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    ytPlayer.loadVideoById(playlist[currentIndex].youtubeId);
    updateUI(currentIndex);
}

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = String(sec % 60).padStart(2, '0');
    return m + ':' + s;
}