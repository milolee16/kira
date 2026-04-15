const ctx = window.appCtx;
const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");

function showToast(message, type = "success") {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.className = "toast show " + type;

    setTimeout(() => {
        toast.className = "toast";
    }, 2000);
}

loginForm.addEventListener("submit", async (e   ) => {
    e.preventDefault();
    try {
        const res = await fetch(ctx + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: new URLSearchParams(new FormData(loginForm))
        });

        const data = await res.json();

        if (data.success) {
            showToast(data.message, "success");

            if (data.redirectUrl) {
                setTimeout(() => {
                    location.href = ctx + data.redirectUrl;
                }, 800);
            }
        } else {
            showToast(data.message, "error");
        }
    } catch (e) {
        showToast("로그인 중 오류가 발생했습니다.", "error");
        console.error(e);
    }
});