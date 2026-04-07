// player.js — index.jsp에서만 로드

// let playlist = [];
// let currentIndex = 0;
// let ytPlayer = null;
// let fetchDone = false;
// let apiReady = false;
// let playerReady = false;

window.playlist = [];
window.currentIndex = 0;
window.ytPlayer = null;
window.fetchDone = false;
window.apiReady = false;
window.playerReady = false;
window.isDefaultPlaylist = true;

const dummyPlaylist = [
    { title: 'Extras', youtubeId: 'MgWVEKk-KUY', duration: 338, trackOrder: 1 },
    { title: 'Needygirl Overdose', youtubeId: 'BnkhBwzBqlQ', duration: 214, trackOrder: 2 },
    { title: '차가운 상어 아가씨', youtubeId: 'wZlv3qDPfjk', duration: 155, trackOrder: 3 },
    { title: '처형박수 (Execution Clap)', youtubeId: 'YcxhmHEykPg', duration: 194, trackOrder: 4 },
    { title: 'Legend-Changer', youtubeId: 'Kpf2mmyzuMM', duration: 241, trackOrder: 5 },
];

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + String(s).padStart(2, '0');
}

function saveCurrentIndex() {
    localStorage.setItem('bgmCurrentIndex', String(currentIndex));
}

function restoreCurrentIndex(playlistLength) {
    const saved = parseInt(localStorage.getItem('bgmCurrentIndex') || '0', 10);
    return Math.min(saved, playlistLength - 1)
}

// ── index.jsp 미니플레이어 UI 갱신 ──────────────────────────────
function updateIndexNowPlaying() {
    if (!playlist.length) return;
    const track = playlist[currentIndex];

    const phoneThumb = document.getElementById('phone-thumb');
    const ytLink = document.getElementById('yt-link');
    const bgmTitleMp3 = document.getElementById('bgm-title-mp3');
    const bgmTitlePhone = document.getElementById('bgm-title-phone');

    if (phoneThumb) phoneThumb.src = 'https://img.youtube.com/vi/' + track.youtubeId + '/mqdefault.jpg';
    if (ytLink) ytLink.href = 'https://www.youtube.com/watch?v=' + track.youtubeId;
    if (bgmTitleMp3) bgmTitleMp3.textContent = '♪ ' + track.title;
    if (bgmTitlePhone) bgmTitlePhone.textContent = '♪ ' + track.title;

    const cur = (ytPlayer && typeof ytPlayer.getCurrentTime === 'function')
        ? Math.floor(ytPlayer.getCurrentTime()) : 0;

    const durationEl = document.getElementById('bgm-duration');
    const currentEl = document.getElementById('bgm-current');
    const progressBar = document.getElementById('bgm-progress-bar');

    if (durationEl) durationEl.textContent = formatTime(track.duration);
    if (currentEl) currentEl.textContent = formatTime(cur);
    if (progressBar) progressBar.style.width = Math.min((cur / track.duration) * 100, 100) + '%';
}

// (AJAX 방식) — 같은 window에 있으므로 직접 호출
function notifyBgmFrame() {
    if (typeof window.onTrackChanged === 'function') {
        window.onTrackChanged(currentIndex);
    }
}

// ── 재생 제어 (bgm.js에서도 window.playTrack으로 호출) ───────────
function playTrack(index) {
    if (!playerReady) return;
    currentIndex = index;
    ytPlayer.loadVideoById(playlist[currentIndex].youtubeId);
    updateIndexNowPlaying();
    notifyBgmFrame();
    saveCurrentIndex();
}

function playNext() {
    if (!playerReady) return;
    currentIndex = (currentIndex + 1) % playlist.length;
    ytPlayer.loadVideoById(playlist[currentIndex].youtubeId);
    updateIndexNowPlaying();
    notifyBgmFrame();
    saveCurrentIndex();
}

function playPrev() {
    if (!playerReady) return;
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    ytPlayer.loadVideoById(playlist[currentIndex].youtubeId);
    updateIndexNowPlaying();
    notifyBgmFrame();
    saveCurrentIndex();
}

function togglePlay() {
    if (!playerReady || !ytPlayer || typeof ytPlayer.getPlayerState !== 'function')
        return;  // ✅ 핵심 수정
    ytPlayer.getPlayerState() === YT.PlayerState.PLAYING
        ? ytPlayer.pauseVideo()
        : ytPlayer.playVideo();
}

// ── 플레이어 초기화 (한 번만) ───────────────────────────────────
function initPlayer() {
    if (!playlist.length || !apiReady) return;

    // ✅ 이전 플레이어 잔재 제거
    const holder = document.getElementById('yt-player-hidden');
    if (holder) holder.innerHTML = '';
    ytPlayer = null;
    playerReady = false;

    ytPlayer = new YT.Player('yt-player-hidden', {
        width: '0',
        height: '0',
        videoId: playlist[currentIndex].youtubeId,
        playerVars: { autoplay: 1, controls: 0, rel: 0, playsinline: 1 },
        events: {
            onReady: (event) => {
                playerReady = true;
                event.target.playVideo();
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

    currentIndex = restoreCurrentIndex(playlist.length);
/*
    // 1) 비로그인 사용자 → 기본 재생목록
    if (!userId || userId.trim() === '') {
        playlist = dummyPlaylist;
        window.isDefaultPlaylist = true;
        currentIndex = restoreCurrentIndex(dummyPlaylist.length); // playlist 확정 후 복원
        fetchDone = true;
        if (apiReady) initPlayer();
        return;
    }
*/
    // 2) 로그인 사용자 → 무조건 DB 조회
    fetch('/api/bgm')
        .then(r => r.json())
        .then(tracks => {
            // 3) DB에 재생목록이 0개면 기본 재생목록
            if (!tracks || tracks.length === 0) {
                playlist = dummyPlaylist;
                window.isDefaultPlaylist = true;
                currentIndex = restoreCurrentIndex(dummyPlaylist.length);
            } else {
                // 4) DB에 내 곡이 있으면 개인 재생목록
                playlist = tracks;
                window.isDefaultPlaylist = false;
                currentIndex = restoreCurrentIndex(tracks.length);
            }

            fetchDone = true;
            if (apiReady) initPlayer();
        })
        .catch(err => {
            console.error('플레이리스트 로드 실패:', err);

            // 5) DB 조회 실패 시 기본 재생목록으로 폴백
            playlist = dummyPlaylist;
            window.isDefaultPlaylist = true;
            currentIndex = restoreCurrentIndex(dummyPlaylist.length);
            fetchDone = true;
            if (apiReady) initPlayer();
        });
}

// ── YouTube API 준비 콜백 ─────────────────────────────────────
window.onYouTubeIframeAPIReady = function () {
    apiReady = true;
    if (fetchDone) initPlayer();
};

// ✅ API가 이미 로드된 상태면 직접 호출
if (window.YT && window.YT.Player) {
    window.onYouTubeIframeAPIReady();
}

// ── 페이지 이탈 직전 현재 곡/재생 위치 저장 ──────────────────────
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        playerReady = false;
        ytPlayer = null;

        if (fetchDone && apiReady) {
            initPlayer();
        }
    }
});

// playTrack(0) 호출 금지 — initPlayer → onReady에서 자동 시작
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadPlaylist(loginUserId);

        // ✅ 이전/다음 버튼 연결
        const prevBtn = document.getElementById('bgm-prev');
        const nextBtn = document.getElementById('bgm-next');

        if (prevBtn) prevBtn.addEventListener('click', playPrev);
        if (nextBtn) nextBtn.addEventListener('click', playNext);

    });
} else {
    loadPlaylist(loginUserId);

    // ✅ 이전/다음 버튼 연결
    const prevBtn = document.getElementById('bgm-prev');
    const nextBtn = document.getElementById('bgm-next');

    if (prevBtn) prevBtn.addEventListener('click', playPrev);
    if (nextBtn) nextBtn.addEventListener('click', playNext);
}