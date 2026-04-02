// router.js — BGM 라우팅 & 마퀴 제어

// ── 마퀴 텍스트 업데이트 ──
function updateMarquee() {
    const titleEl = document.getElementById('bgm-title');
    if (!titleEl || playlist.length === 0) return;

    // 전체 플레이리스트 제목을 이어붙여서 흘러가게
    const fullText = playlist
        .map((t, i) => (i === currentIndex ? '▶ ' : '♪ ') + t.title)
        .join('　　　　');

    titleEl.textContent = fullText;
}

// ── player.js의 updateUI를 감싸서 마퀴도 같이 갱신 ──
const _originalUpdateUI = updateUI;
function updateUI(index) {
    _originalUpdateUI(index);
    updateMarquee();
}

// ── 스마트폰 썸네일 업데이트 ──
function updatePhoneScreen(index) {
    const track = playlist[index];
    if (!track) return;

    const ytLink = document.getElementById('yt-link');
    if (ytLink) {
        ytLink.href = 'https://www.youtube.com/watch?v=' + track.youtubeId;
    }
}

// ── player.js의 playNext / playPrev 이후 훅 ──
const _originalPlayNext = playNext;
function playNext() {
    _originalPlayNext();
    updatePhoneScreen(currentIndex);
}

const _originalPlayPrev = playPrev;
function playPrev() {
    _originalPlayPrev();
    updatePhoneScreen(currentIndex);
}