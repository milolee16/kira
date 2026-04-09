document.addEventListener("DOMContentLoaded", function () {
    const goMyHome = document.getElementById("goMyHome");

    if (goMyHome) {
        goMyHome.addEventListener("click", function () {

            // 🔥 타인 홈 상태 제거
            sessionStorage.removeItem("currentHostId");
            sessionStorage.removeItem("currentHostNick");

            // 🔥 내 홈으로 이동
            loadPage("/home?ajax=true");

            // 🔥 닉네임 즉시 변경
            const profileName = document.getElementById("profile-name");
            if (profileName) {
                profileName.textContent = loginUserNickname;
            }
        });
    }
});