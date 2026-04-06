const ctx = window.appCtx;
const findIdForm = document.getElementById("findIdForm");

async function postFindId(url) {
    const res = await fetch(ctx + url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: new URLSearchParams(new FormData(findIdForm))
    });
    return await res.json();
}

document.getElementById("findIdEmailSendBtn").addEventListener("click", async () => {
    const data = await postFindId("/find-id-email-send");
    alert(data.message);

    document.getElementById("findIdEmailVerified").value = "N";
    document.getElementById("findIdVerifiedEmail").value = "";
});

document.getElementById("findIdEmailCheckBtn").addEventListener("click", async () => {
    const data = await postFindId("/find-id-email-check");
    alert(data.message);

    document.getElementById("findIdEmailVerified").value = data.success ? "Y" : "N";
    document.getElementById("findIdVerifiedEmail").value = data.success ? document.getElementById("findIdEmail").value : "";
});

document.getElementById("findIdBtn").addEventListener("click", async () => {
    const data = await postFindId("/find-id");
    alert(data.message);

    const area = document.getElementById("foundIdArea");
    if (data.success && data.foundId) {
        area.innerHTML = "<h3>찾은 아이디: " + data.foundId + "</h3>";
    } else {
        area.innerHTML = "";
    }
});

document.getElementById("findIdEmail").addEventListener("input", () => {
    document.getElementById("findIdEmailVerified").value = "N";
    document.getElementById("findIdVerifiedEmail").value = "";
});