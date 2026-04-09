// js/logout.js
document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.querySelector(".logout");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault(); // 기본 링크 이동 막기

            // 🔥 브라우저 저장소 삭제
            sessionStorage.clear();

            // 🔥 서버 로그아웃 요청
            location.href = this.href;
        });
    }
});