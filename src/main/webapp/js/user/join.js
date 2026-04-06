const ctx = window.appCtx;
const joinForm = document.getElementById("joinForm");

async function postJoin(url) {
    const res = await fetch(ctx + url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: new URLSearchParams(new FormData(joinForm))
    });
    return await res.json();
}

document.getElementById("idCheckBtn").addEventListener("click", async () => {
    const data = await postJoin("/id-check");
    alert(data.message);

    document.getElementById("idChecked").value = data.success ? "Y" : "N";
    document.getElementById("checkedId").value = data.success ? document.getElementById("id").value : "";
});

document.getElementById("nicknameCheckBtn").addEventListener("click", async () => {
    const data = await postJoin("/nickname-check");
    alert(data.message);

    document.getElementById("nicknameChecked").value = data.success ? "Y" : "N";
    document.getElementById("checkedNickname").value = data.success ? document.getElementById("nickname").value : "";
});

document.getElementById("emailSendBtn").addEventListener("click", async () => {
    const data = await postJoin("/email-send");
    alert(data.message);

    document.getElementById("emailVerified").value = "N";
    document.getElementById("verifiedEmail").value = "";
});

document.getElementById("emailCheckBtn").addEventListener("click", async () => {
    const data = await postJoin("/email-check");
    alert(data.message);

    document.getElementById("emailVerified").value = data.success ? "Y" : "N";
    document.getElementById("verifiedEmail").value = data.success ? document.getElementById("email").value : "";
});

document.getElementById("joinBtn").addEventListener("click", async () => {
    const data = await postJoin("/join");
    alert(data.message);

    if (data.success && data.redirectUrl) {
        location.href = ctx + data.redirectUrl;
    }
});

document.getElementById("id").addEventListener("input", () => {
    document.getElementById("idChecked").value = "N";
    document.getElementById("checkedId").value = "";
});

document.getElementById("nickname").addEventListener("input", () => {
    document.getElementById("nicknameChecked").value = "N";
    document.getElementById("checkedNickname").value = "";
});

document.getElementById("email").addEventListener("input", () => {
    document.getElementById("emailVerified").value = "N";
    document.getElementById("verifiedEmail").value = "";
});