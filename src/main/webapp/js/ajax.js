// ──────────────────────────────────────────────
//  AJAX 탭 전환 핵심 로직
// ──────────────────────────────────────────────

/**
 * 탭/메뉴 클릭 시 서블릿에 fetch 요청 후
 * #notebook-content 에 HTML 삽입
 *
 * @param {string} url  - data-src 값 (예: /diary?ajax=true)
 */
async function switchTab(url) {
    const container = document.getElementById('notebook-content');
    const notebook = document.getElementById('notebook');
    const loadingEl = document.getElementById('nb-loading');

    // ── 1. 로딩 표시 ──
    container.innerHTML = '';
    if (loadingEl) {
        container.appendChild(loadingEl);
        loadingEl.style.display = 'flex';
    }

    // ── 2. is-visitor 토글 ──
    notebook.classList.toggle('is-visitor', url.includes('/board'));

    // ── 3. 탭 active 상태 업데이트 ──
    document.querySelectorAll('.nb-tab, .menu-item').forEach(el => {
        el.classList.toggle('active', el.dataset.src === url);
    });

    // ── 4. fetch 요청 ──
    try {
        const response = await fetch(url, {
            headers: {'X-Requested-With': 'XMLHttpRequest'}
        });

        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status}`);
        }

        const html = await response.text();

        // ── 5. 콘텐츠 삽입 ──
        container.innerHTML = html;

// ── 6. 스크립트 재실행 ──
        container.querySelectorAll('script').forEach(oldScript => {
            const newScript = document.createElement('script');
            [...oldScript.attributes].forEach(attr =>
                newScript.setAttribute(attr.name, attr.value)
            );
            newScript.textContent = oldScript.textContent;
            oldScript.replaceWith(newScript);
        });

    } catch (err) {
        container.innerHTML = `
            <div class="nb-error">
                <p>⚠️ 콘텐츠를 불러오지 못했어요.</p>
                <small>${err.message}</small>
                <button onclick="switchTab('${url}')">다시 시도</button>
            </div>`;
    }
}

// ──────────────────────────────────────────────
//  탭 / 메뉴 클릭 이벤트 위임
// ──────────────────────────────────────────────
document.addEventListener('click', e => {
    const target = e.target.closest('[data-src]');
    // MP3·스마트폰·BGM 클릭은 별도 처리이므로 노트북 탭만 가로챔
    if (
        target &&
        (target.classList.contains('nb-tab') ||
            target.classList.contains('menu-item') ||
            target.classList.contains('phone-screen') ||
            target.classList.contains('phone-home') ||
            target.id === 'bgm-title-phone')
    ) {
        e.preventDefault();

        // 1. bgm-title-phone (언제나 "내" 플레이리스트)
        if (target.id === 'bgm-title-phone') {
            e.preventDefault();
            switchTab(target.dataset.src);
            if (typeof loadPlaylist === 'function') {
                loadPlaylist(null); // 인자를 비워서 내 서블릿(/api/bgm) 호출
            }
            return;
        }

        // 2. phone-home (방문한 "페이지 주인"의 플레이리스트)
        if (target.classList.contains('phone-home')) {
            e.preventDefault();
            // Photo가 성공적으로 쓰고 있는 그 세션값(u_id)을 그대로 가져옴
            const currentHostId = sessionStorage.getItem('currentHostId');

            switchTab(target.dataset.src);
            if (typeof loadPlaylist === 'function') {
                // 이제 서버가 ID를 PK로 바꿔주므로, 그냥 이 값을 던지면 끝!
                loadPlaylist(currentHostId);
            }
            return;
        }
        switchTab(target.dataset.src);
    }
});

// ──────────────────────────────────────────────
//  초기 로드: 서버에서 내려준 content 값 또는 홈
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // EL 표현식으로 서버가 주입한 초기 경로를 JS 변수로 전달
    const initialSrc = '${not empty content ? "/home?ajax=true" : "/home?ajax=true"}';
    // content 값에 따라 올바른 ajax URL로 매핑
    const contentToUrl = {
        'main.jsp': '/home?ajax=true',
        'diary/diary.jsp': '/diary?ajax=true',
        'photo/photo.jsp': '/photo?ajax=true',
        'board/board.jsp': '/board?ajax=true',
        'bgm/bgm.jsp': '/bgm?ajax=true',
    };
    const startUrl = contentToUrl['${content}'] || '/home?ajax=true';
    switchTab(startUrl);

});