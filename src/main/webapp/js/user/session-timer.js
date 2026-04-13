let sessionTimeLeft = 30 * 60;
let sessionTimerInterval = null;

function startSessionTimer() {
    const timerEl = document.getElementById("sessionTimer");
    if (!timerEl) return;

    function updateSessionTimer() {
        const min = Math.floor(sessionTimeLeft / 60);
        const sec = sessionTimeLeft % 60;

        timerEl.textContent =
            "남은 시간: " +
            String(min).padStart(2, "0") + ":" +
            String(sec).padStart(2, "0");

        sessionTimeLeft--;

        if (sessionTimeLeft < 0) {
            clearInterval(sessionTimerInterval);
            alert("세션이 만료되어 자동 로그아웃됩니다.");
            location.href = window.appCtx + "/logout";
        }
    }

    function resetSessionTimer() {
        sessionTimeLeft = 30 * 60;
    }

    if (sessionTimerInterval !== null) {
        clearInterval(sessionTimerInterval);
    }

    updateSessionTimer();
    sessionTimerInterval = setInterval(updateSessionTimer, 1000);

    document.addEventListener("click", resetSessionTimer);
    document.addEventListener("keydown", resetSessionTimer);

}

window.addEventListener("load", startSessionTimer);