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

    list.innerHTML = playlist.map((track, i) => {
        const isPlaying = i === currentIndex;
        const numHtml = isPlaying
            ? '<span class="bgm-now-playing">♪</span>'
            : String(i + 1);
        return `
            <div class="bgm-track ${isPlaying ? 'playing' : ''}"
                 onclick="playTrack(${i})">
                <div class="bgm-track-num">${numHtml}</div>
                <div class="bgm-track-info">
                    <div class="bgm-track-title">${track.title}</div>
                </div>
                <div class="bgm-track-duration">${formatTime(track.duration)}</div>
            </div>
        `;
    }).join('');
}

function playTrack(index) {
    const par = window.parent;
    par.currentIndex = index;
    par.ytPlayer.loadVideoById(par.playlist[index].youtubeId);
    par.updateUI(index);
    renderQueue();
}

function formatTime(sec) {
    if (!sec) return '0:00';
    const m = Math.floor(sec / 60);
    const s = String(sec % 60).padStart(2, '0');
    return m + ':' + s;
}

function startSync() {
    if (syncTimer) clearInterval(syncTimer);
    syncTimer = setInterval(() => {
        const par = window.parent;
        const currentIndex = par.currentIndex || 0;
        document.querySelectorAll('.bgm-track').forEach((el, i) => {
            const isPlaying = i === currentIndex;
            el.classList.toggle('playing', isPlaying);
            const numEl = el.querySelector('.bgm-track-num');
            numEl.innerHTML = isPlaying
                ? '<span class="bgm-now-playing">♪</span>'
                : String(i + 1);
        });
    }, 1000);
}

window.addEventListener('beforeunload', () => {
    if (syncTimer) clearInterval(syncTimer);
});

renderQueue();
startSync();