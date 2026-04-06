const ctx = window.appCtx;
const findPwForm = document.getElementById("findPwForm");

async function postFindPw(url) {
    const res = await fetch(ctx + url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: new URLSearchParams(new FormData(findPwForm))
    });
    return await res.json();
}

document.getElementById("findPwEmailSendBtn").addEventListener("click", async () => {
    const data = await postFindPw("/find-pw-email-send");
    alert(data.message);

    document.getElementById("findPwEmailVerified").value = "N";
    document.getElementById("findPwVerifiedEmail").value = "";
});

document.getElementById("findPwEmailCheckBtn").addEventListener("click", async () => {
    const data = await postFindPw("/find-pw-email-check");
    alert(data.message);

    document.getElementById("findPwEmailVerified").value = data.success ? "Y" : "N";
    document.getElementById("findPwVerifiedEmail").value = data.success ? document.getElementById("findPwEmail").value : "";
});

document.getElementById("goResetPwBtn").addEventListener("click", async () => {
    const data = await postFindPw("/find-pw");
    alert(data.message);

    if (data.success && data.next) {
        sessionStorage.setItem("resetPwId", findPwForm.querySelector('[name="id"]').value);
        sessionStorage.setItem("resetPwName", findPwForm.querySelector('[name="name"]').value);
        sessionStorage.setItem("resetPwEmail", findPwForm.querySelector('[name="email"]').value);
        location.href = ctx + "/reset-pw";
    }
});

document.getElementById("findPwEmail").addEventListener("input", () => {
    document.getElementById("findPwEmailVerified").value = "N";
    document.getElementById("findPwVerifiedEmail").value = "";
});