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

function renderQueueHeader() {
    const header = document.getElementById('bgm-queue-header');
    const wrap = document.querySelector('.bgm-wrap');
    if (!header) return;

    // 1. 기존 JSP에 정적으로 선언된 버튼 (id="bgm-add-btn") 대응
    const staticAddBtn = document.getElementById('bgm-add-btn');
    if (staticAddBtn) {
        staticAddBtn.onclick = openBgmModal;
    }

    if (window.isDefaultPlaylist) {
        wrap.classList.remove('theme-personal');
        wrap.classList.add('theme-default');
        // 2. 동적으로 생성되는 헤더 안의 버튼에도 onclick 연결 확인
        header.innerHTML = `
            <div class="bgm-queue-status default">
                <span class="bgm-queue-status-label">🎵 기본 BGM</span>
                <span class="bgm-queue-hint">나만의 재생목록을 만들어봐요</span>
                <button class="bgm-add-btn" onclick="openBgmModal()">+ 추가</button>
            </div>
        `;
    } else {
        wrap.classList.remove('theme-default');
        wrap.classList.add('theme-personal');
        header.innerHTML = `
            <div class="bgm-queue-status personal">
                <span class="bgm-queue-status-label">🎶 내 재생목록</span>
                <span class="bgm-queue-count">${window.playlist.length}곡</span>
            </div>
        `;
    }
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
    renderQueueHeader();
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
// 기존의 deleteTrack 함수를 아래 내용으로 덮어씌우세요.
async function deleteTrack(youtubeId) {
    if (!confirm('정말 삭제할까요?')) return;

    try {
        const res = await fetch(`/api/bgm?youtubeId=${youtubeId}`, {
            method: 'DELETE'
        });
        const json = await res.json();

        if (json.result === 'ok') {
            // 1. 현재 재생 중인 곡이 삭제 대상인지 확인
            const currentTrack = window.playlist[window.currentIndex];
            const isPlayingDeleted = (currentTrack && currentTrack.youtubeId === youtubeId);

            // 2. 서버에서 최신 목록(재정렬된 목록) 다시 가져오기
            await reloadPlaylist();

            // 3. 만약 재생 중인 곡을 지웠다면?
            if (isPlayingDeleted) {
                alert('재생 중인 곡이 삭제되어 다음 곡을 재생합니다.');
                if (window.playlist.length > 0) {
                    // 현재 인덱스가 리스트 범위를 벗어나지 않게 조정 후 재생
                    window.currentIndex = window.currentIndex % window.playlist.length;
                    playTrack(window.currentIndex);
                } else {
                    // 남은 곡이 없으면 플레이어 중지
                    if (window.ytPlayer) window.ytPlayer.stopVideo();
                }
            }
        }
    } catch (e) {
        console.error("삭제 중 오류:", e);
    }
}
// ✅ player.js가 곡을 바꿀 때 호출하는 콜백
window.onTrackChanged = function(index) {
    updateNowPlaying(window.playlist[index], index);
};

document.addEventListener('DOMContentLoaded', renderQueue);

setTimeout(() => {
    renderQueue();
}, 0);

// ── 모달 열기/닫기 ──────────────────────────────
function openBgmModal() {
    document.getElementById('bgm-add-url').value = '';
    document.getElementById('bgm-duration-input-row').style.display = 'none'; // 재생시간 초기화
    document.getElementById('bgm-add-preview').style.display = 'none';
    document.getElementById('bgm-add-msg').style.display = 'none';
    document.getElementById('bgm-confirm-btn').style.display = 'none';
    document.getElementById('bgm-add-modal').style.display = 'flex';
    window._previewData = null;
}

function closeBgmModal() {
    document.getElementById('bgm-add-modal').style.display = 'none';
    window._previewData = null;
}

// 오버레이 클릭으로 닫기
document.getElementById('bgm-add-modal')
    .addEventListener('click', function(e) {
        if (e.target === this) closeBgmModal();
    });

// ── YouTube URL → ID 추출 ───────────────────────
function extractYoutubeId(url) {
    // 다양한 유튜브 URL 패턴을 처리하는 정규식
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=)|(shorts\/))([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[8].length === 11) {
        return match[8]; // 정확히 11자리 ID만 반환
    } else {
        // 정규식으로 안 잡히는 특수 케이스 대비
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === 'youtu.be') return urlObj.pathname.substring(1);
            return urlObj.searchParams.get("v");
        } catch (e) {
            return false;
        }
    }
}

// ── 미리보기 ────────────────────────────────────
async function bgmPreview() {
    const urlInput = document.getElementById('bgm-add-url');
    const ytId = extractYoutubeId(urlInput.value.trim());

    if (!ytId) {
        showAddMsg('올바른 유튜브 주소가 아닙니다.', 'error');
        return;
    }

    try {
        // oEmbed 호출 시 ID 뒤에 붙은 불필요한 파라미터가 없는지 확인
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`);
        const data = await res.json();

        // 썸네일 및 제목 표시
        document.getElementById('bgm-preview-thumb').src = `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`;
        document.getElementById('bgm-preview-title').textContent = data.title;

        // ✅ [시간 자동 입력 로직]
        // oEmbed는 정확한 초 단위 길이를 주지 않는 경우가 많으므로,
        // 기본값을 '1분 0초'로 세팅하거나 그냥 비워두지 않고 1을 채워줍니다.
        document.getElementById('bgm-input-min').value = 1;
        document.getElementById('bgm-input-sec').value = 0;

        document.getElementById('bgm-duration-input-row').style.display = 'flex';
        document.getElementById('bgm-add-preview').style.display = 'flex';
        document.getElementById('bgm-confirm-btn').style.display = 'inline-block';

        window._previewData = { youtubeId: ytId, title: data.title };
    } catch (e) {
        console.error("미리보기 에러 상세:", e);
        showAddMsg('유튜브에서 영상 정보를 가져오지 못했습니다.', 'error');
    }
}

// ── 추가 확정 → POST /api/bgm ───────────────────
// 2. 곡 추가 확정 함수 수정 (URLSearchParams 사용으로 특수문자 방어)
async function bgmConfirmAdd() {
    const minVal = document.getElementById('bgm-input-min').value;
    const secVal = document.getElementById('bgm-input-sec').value;

    // 값이 없으면 분은 1, 초는 0으로 처리 (기본값 60초)
    const min = parseInt(minVal || 1);
    const sec = parseInt(secVal || 0);
    const totalDuration = (min * 60) + sec;

    if (!window._previewData) return;

    // ✅ 안전한 전송을 위해 URLSearchParams 객체 생성
    const params = new URLSearchParams();
    params.append('youtubeId', window._previewData.youtubeId);
    params.append('title', window._previewData.title);
    params.append('duration', totalDuration);

    try {
        const res = await fetch('/api/bgm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString() // 자동으로 인코딩되어 전송됨
        });
        const json = await res.json();
        if (json.result === 'ok') {
            closeBgmModal();
            // ✅ 추가 후 목록을 다시 불러와서 새 곡을 포함한 정렬된 리스트 표시
            await reloadPlaylist();
        } else {
            showAddMsg(json.msg || '추가에 실패했어요.', 'error');
        }
    } catch (e) {
        console.error("추가 에러:", e);
        showAddMsg('서버 오류가 발생했어요.', 'error');
    }
}
// ── 재생목록 리로드 부분 수정 (wasDefault 정의) ─────────────
async function reloadPlaylist() {
    const wasDefault = window.isDefaultPlaylist; // 현재 상태 저장

    try {
        const res = await fetch('/api/bgm');
        const data = await res.json();

        if (data && data.length > 0) {
            window.playlist = data;
            window.isDefaultPlaylist = false;

            // 처음으로 곡을 추가해 '기본'에서 '개인'으로 전환된 경우 즉시 재생
            if (wasDefault && typeof window.playTrack === 'function') {
                window.playTrack(0);
            }
        }
        renderQueue();
    } catch (e) {
        console.error("재생목록 로드 실패:", e);
    }
}

// ── 메시지 표시 헬퍼 ────────────────────────────
function showAddMsg(text, type) {
    const el = document.getElementById('bgm-add-msg');
    el.textContent = text;
    el.className = 'bgm-add-msg ' + type;
    el.style.display = 'block';
}