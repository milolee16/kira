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