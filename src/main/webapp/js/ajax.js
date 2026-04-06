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
    const container  = document.getElementById('notebook-content');
    const notebook   = document.getElementById('notebook');
    const loadingEl  = document.getElementById('nb-loading');

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
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status}`);
        }

        const html = await response.text();

        // ── 5. 콘텐츠 삽입 ──
        container.innerHTML = html;

        // ── 6. 삽입된 HTML 안의 <script> 태그 재실행 ──
        //    innerHTML로 넣은 스크립트는 자동 실행되지 않으므로 직접 처리
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
        target.id === 'bgm-title')
    ) {
        e.preventDefault();
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
        'main.jsp':            '/home?ajax=true',
        'diary/diary.jsp':     '/diary?ajax=true',
        'photo/photo.jsp':         '/photo?ajax=true',
        'board/board.jsp': '/board?ajax=true',
        'bgm/bgm.jsp':     '/bgm?ajax=true',
    };
    const startUrl = contentToUrl['${content}'] || '/home?ajax=true';
    switchTab(startUrl);

    // 음악 플레이리스트 초기화
    loadPlaylist(1); // 추후 → loadPlaylist(${loginUser.id})
});