const frame = document.getElementById('notebook-frame');
const tabs = document.querySelectorAll('.nb-tab, .menu-item');
const notebook = document.querySelector('.notebook');

// ✅ 외부에서 호출 가능한 전역 함수로 분리
function switchTab(src) {
    frame.src = src;

    // nb-tab, menu-item 둘 다 active 동기화
    tabs.forEach(t => {
        t.classList.toggle('active', t.dataset.src === src);
    });

    // is-visitor 토글
    notebook.classList.toggle('is-visitor', src.includes('visitor'));
}

// 초기 로드 시 현재 src에 맞는 탭 활성화
switchTab(frame.getAttribute('src'));

// 탭 클릭
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        if (tab.dataset.src) switchTab(tab.dataset.src);
    });
});

// bgm 진입 요소들 (마퀴, 스마트폰 화면, 홈버튼)
document.querySelectorAll('[data-src="/bgm?ajax=true"]').forEach(el => {
    el.addEventListener('click', () => switchTab('/bgm?ajax=true'));
});