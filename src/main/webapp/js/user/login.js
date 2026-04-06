const ctx = window.appCtx;
const loginForm = document.getElementById("loginForm");

document.getElementById("loginBtn").addEventListener("click", async () => {
    const res = await fetch(ctx + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: new URLSearchParams(new FormData(loginForm))
    });

    const data = await res.json();
    alert(data.message);

    if (data.success && data.redirectUrl) {
        location.href = ctx + data.redirectUrl;
    }
});