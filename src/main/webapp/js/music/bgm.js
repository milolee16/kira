// bgm.js — index.jsp에 include된 bgm.jsp용
// player.js와 같은 window를 공유하므로 직접 접근 가능

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + String(s).padStart(2, '0');
}

function updateNowPlaying(track, index) {
    if (!track) return;
    const nowThumb = document.getElementById('now-thumb');
    const nowTitle = document.getElementById('now-title');
    if (nowThumb) nowThumb.src = 'https://img.youtube.com/vi/' + track.youtubeId + '/mqdefault.jpg';
    if (nowTitle) nowTitle.textContent = track.title;

    document.querySelectorAll('.bgm-track-item').forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });
}

function renderQueue() {
    // ✅ 같은 window이므로 직접 접근
    // playlist 준비 안 됐으면 재시도
    if (!window.playlist || window.playlist.length === 0) {
        setTimeout(renderQueue, 300);
        return;
    }

    const container = document.getElementById('bgm-queue-list');
    if (!container) return;

    container.innerHTML = '';
    window.playlist.forEach((track, i) => {
        const item = document.createElement('div');
        item.className = 'bgm-track-item' + (i === window.currentIndex ? ' active' : '');
        item.innerHTML = `
    <div class="bgm-track-num">${i + 1}</div>
    <div class="bgm-playing-icon">
        <span></span><span></span><span></span>
    </div>
    <div class="bgm-track-thumb">
    <img src="https://img.youtube.com/vi/${track.youtubeId}/mqdefault.jpg" alt="${track.title}">
</div>
    <div class="bgm-track-info">
        <div class="bgm-track-title">${track.title}</div>
        <div class="bgm-track-duration">${formatTime(track.duration)}</div>
    </div>
    ${window.isDefaultPlaylist ? '' : '<button class="bgm-track-delete" title="삭제">✕</button>'}
`;
        // 🎵 트랙 클릭 → 재생
        // ✅ 변경: 삭제 버튼 클릭 시 재생 이벤트 막기
        item.addEventListener('click', (e) => {
            if (e.target.closest('.bgm-track-delete')) return; // 삭제 버튼이면 무시
            if (typeof window.playTrack === 'function') window.playTrack(i);
        });

        // ❗ 안전하게 삭제 버튼 이벤트 연결
        const deleteBtn = item.querySelector('.bgm-track-delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTrack(track.youtubeId, item, i);
            });
        }

        container.appendChild(item);
    });

    updateNowPlaying(window.playlist[window.currentIndex], window.currentIndex);
}

// ✅ 추가: 삭제 요청 함수
function deleteTrack(youtubeId, itemEl, index) {
    fetch('api/bgm?youtubeId=' + encodeURIComponent(youtubeId), {
        method: 'DELETE'
    })
        .then(r => r.json())
        .then(res => {
            if (res.result === 'ok') {
                // playlist에서 해당 곡 제거
                window.playlist.splice(index, 1);

                // 삭제한 곡이 현재 재생 중이거나 그 앞이면 인덱스 보정
                if (window.currentIndex >= window.playlist.length) {
                    window.currentIndex = Math.max(0, window.playlist.length - 1);
                }

                // fadeOut 후 리렌더링
                itemEl.style.transition = 'opacity 0.2s';
                itemEl.style.opacity = '0';
                setTimeout(renderQueue, 200);
            } else {
                alert(res.msg || '삭제에 실패했습니다.');
            }
        })
        .catch(err => console.error('삭제 실패:', err));
}

// ✅ player.js가 곡을 바꿀 때 호출하는 콜백
window.onTrackChanged = function(index) {
    updateNowPlaying(window.playlist[index], index);
};

document.addEventListener('DOMContentLoaded', renderQueue);

setTimeout(() => {
    renderQueue();
}, 0);