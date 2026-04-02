function showWriteForm() {
    document.getElementById('writeForm').style.display = 'block';

//폼을 열고 닫는 간단한 스크립트

    function showWriteForm() {
        const form = document.getElementById('writeForm');
        // 토글 방식: 누를 때마다 켜졌다 꺼졌다 함
        if (form.style.display === 'none') {
            form.style.display = 'block';
        } else {
            form.style.display = 'none';
        }
    }
}

// 년도/월 클릭 시 이동 입력창 토글
function toggleDateSelector() {
    const s = document.getElementById('dateSelector');
    s.style.display = (s.style.display === 'none') ? 'block' : 'none';
}

// 외부 클릭 시 선택창 닫기
window.onclick = function(event) {
    if (!event.target.matches('.cal-title') && !event.target.closest('.date-selector')) {
        const selector = document.getElementById('dateSelector');
        if (selector) selector.style.display = 'none';
    }
}
