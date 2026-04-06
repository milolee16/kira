const ctx = window.appCtx;
const resetPwForm = document.getElementById("resetPwForm");

document.getElementById("resetId").value = sessionStorage.getItem("resetPwId") || "";
document.getElementById("resetName").value = sessionStorage.getItem("resetPwName") || "";
document.getElementById("resetEmail").value = sessionStorage.getItem("resetPwEmail") || "";

document.getElementById("resetPwBtn").addEventListener("click", async () => {
    const res = await fetch(ctx + "/reset-pw", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: new URLSearchParams(new FormData(resetPwForm))
    });

    const data = await res.json();
    alert(data.message);

    if (data.success && data.redirectUrl) {
        sessionStorage.removeItem("resetPwId");
        sessionStorage.removeItem("resetPwName");
        sessionStorage.removeItem("resetPwEmail");
        location.href = ctx + data.redirectUrl;
    }
});