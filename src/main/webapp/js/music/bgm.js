let syncTimer = null;


function renderQueue() {
    const par = window.parent;
    const playlist = par.playlist;
    const list = document.getElementById('bgm-queue-list');

    if (!playlist || playlist.length === 0) {
        list.innerHTML = '<div class="bgm-empty">재생목록이 비어있어요 🎵</div>';
        setTimeout(renderQueue, 500);
        return;
    }

    const currentIndex = par.currentIndex || 0;
    const currentTrack = playlist[currentIndex];

    // ── 상단 현재 재생 중 카드 ──
    document.getElementById('now-thumb').src = thumbUrl(currentTrack.youtubeId);
    document.getElementById('now-title').textContent = currentTrack.title;

    // ── 전체 목록 ──
    list.innerHTML = playlist.map((track, i) => {
        const isActive = i === currentIndex;
        return `
            <div class="bgm-track-item ${isActive ? 'active' : ''}"
                 onclick="playTrack(${i})">
                <div class="bgm-playing-icon">
                    <span></span><span></span><span></span>
                </div>
                <span class="bgm-track-num">${i + 1}</span>
                <img class="bgm-track-thumb"
                     src="${thumbUrl(track.youtubeId)}"
                     alt="${track.title}">
                <div class="bgm-track-info">
                    <div class="bgm-track-title">${track.title}</div>
                    <div class="bgm-track-duration">${formatTime(track.duration)}</div>
                </div>
            </div>
        `;
    }).join('');
}
// ── 썸네일 URL ──
function thumbUrl(youtubeId) {
    // return 'https://img.youtube.com/vi/' + youtubeId + '/mqdefault.jpg';
    return 'https://img.youtube.com/vi/' + "BnkhBwzBqlQ" + '/mqdefault.jpg';
}

// ── 시간 포맷 ──
function formatTime(sec) {
    if (!sec) return '0:00';
    const m = Math.floor(sec / 60);
    const s = String(sec % 60).padStart(2, '0');
    return m + ':' + s;
}

// ── 상단 "지금 재생 중" 업데이트 ──
function updateNowPlaying() {
    const par = window.parent;
    if (!par.playlist || par.playlist.length === 0) return;

    const idx = par.currentIndex || 0;
    const track = par.playlist[idx];
    const ytPlayer = par.ytPlayer;

    document.getElementById('now-thumb').src = thumbUrl(track.youtubeId);
    document.getElementById('now-title').textContent = track.title;

    // 진행바
    const cur = ytPlayer?.getCurrentTime ? Math.floor(ytPlayer.getCurrentTime()) : 0;
    const total = track.duration || 1;
    const pct = Math.min((cur / total) * 100, 100);
    document.getElementById('now-bar-fill').style.width = pct + '%';
}

// ── 트랙 목록 렌더링 ──
function renderQueue() {
    const par = window.parent;
    const playlist = par.playlist;
    const list = document.getElementById('bgm-queue-list');

    if (!playlist || playlist.length === 0) {
        list.innerHTML = '<div class="bgm-empty">재생목록이 비어있어요 🎵</div>';
        setTimeout(renderQueue, 500);  // 0.5초 후 재시도
        return;
    }

    const currentIndex = par.currentIndex || 0;
    const currentTrack = playlist[currentIndex];

    // ── 여기서 상단 now-title 채워줌 ──
    document.getElementById('now-title').textContent = currentTrack.title;
    document.getElementById('now-thumb').src = thumbUrl(currentTrack.youtubeId);

    // 목록 렌더링
    list.innerHTML = playlist.map((track, i) => {
        const isActive = i === currentIndex;
        return `
            <div class="bgm-track-item ${isActive ? 'active' : ''}"
                 onclick="playTrack(${i})">
                <div class="bgm-playing-icon">
                    <span></span><span></span><span></span>
                </div>
                <span class="bgm-track-num">${i + 1}</span>
                <img class="bgm-track-thumb"
                     src="${thumbUrl(track.youtubeId)}"
                     alt="${track.title}">
                <div class="bgm-track-info">
                    <div class="bgm-track-title">${track.title}</div>
                    <div class="bgm-track-duration">${formatTime(track.duration)}</div>
                </div>
            </div>
        `;
    }).join('');
}

// ── 트랙 클릭 시 재생 ──
function playTrack(index) {
    const par = window.parent;
    par.currentIndex = index;
    par.ytPlayer.loadVideoById(par.playlist[index].youtubeId);
    par.updateUI(index);
    renderQueue();
}

// ── 1초마다 동기화 ──
function startSync() {
    if (syncTimer) clearInterval(syncTimer);
    syncTimer = setInterval(() => {
        const par = window.parent;
        if (!par.playlist || par.playlist.length === 0) return;

        const currentIndex = par.currentIndex || 0;

        // 활성 트랙 표시 갱신
        document.querySelectorAll('.bgm-track-item').forEach((el, i) => {
            el.classList.toggle('active', i === currentIndex);
        });

        // 상단 재생 중 갱신
        updateNowPlaying();
    }, 1000);
}

window.addEventListener('beforeunload', () => {
    if (syncTimer) clearInterval(syncTimer);
});

renderQueue();
startSync();