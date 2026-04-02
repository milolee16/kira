// 현재 src 기준으로 초기 active 탭 설정
const frame = document.getElementById('notebook-frame');
const tabs = document.querySelectorAll('.nb-tab');
const notebook = document.querySelector('.notebook');

function setActiveTab(src) {
    tabs.forEach(t => {
        t.classList.toggle('active', t.dataset.src === src);
    });
    // is-visitor 클래스 처리
    notebook.classList.toggle('is-visitor', src.includes('visitor'));
}

// 초기 로드 시 현재 src에 맞는 탭 활성화
setActiveTab(frame.src.replace(location.origin, ''));

// 탭 클릭 시 iframe src만 교체
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const src = tab.dataset.src;
        frame.src = src;
        setActiveTab(src);
    });
});