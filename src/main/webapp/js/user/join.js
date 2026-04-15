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

    const pw = document.getElementById("pw").value;

    const regex = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!regex.test(pw)) {
        alert("비밀번호는 8자 이상, 문자·숫자·특수문자를 모두 포함해야 합니다.");
        document.getElementById("pw").focus();
        return;
    }

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

const pwInput = document.getElementById("pw");
const pwChkInput = document.getElementById("pwChk");

const bar = document.querySelector(".pw-bar");
const text = document.querySelector(".pw-text");
const matchText = document.getElementById("pw-match-text");

pwInput.addEventListener("input", function () {
    const pw = pwInput.value;
    let score = 0;

    if (pw.length >= 8) score++;
    if (/[A-Za-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    bar.className = "pw-bar";

    if (pw.length === 0) {
        bar.style.width = "0";
        text.innerText = "비밀번호를 입력하세요";
        text.style.color = "#999";
        checkMatch();
        return;
    }

    bar.style.width = "";

    if (score <= 1) {
        bar.classList.add("weak");
        text.innerText = "약함";
        text.style.color = "#ff6b6b";
    } else if (score <= 3) {
        bar.classList.add("medium");
        text.innerText = "보통";
        text.style.color = "#ffb84d";
    } else {
        bar.classList.add("strong");
        text.innerText = "강함";
        text.style.color = "#4cd964";
    }

    checkMatch();
});

pwChkInput.addEventListener("input", checkMatch);

function checkMatch() {
    const pw = pwInput.value;
    const pwChk = pwChkInput.value;

    if (pwChk.length === 0) {
        matchText.innerText = "";
        return;
    }

    if (pw === pwChk) {
        matchText.innerText = "비밀번호가 일치합니다";
        matchText.style.color = "#4cd964";
    } else {
        matchText.innerText = "비밀번호가 일치하지 않습니다";
        matchText.style.color = "#ff6b6b";
    }
}

const joinBtn = document.getElementById("joinBtn");

function checkMatch() {
    const pw = pwInput.value;
    const pwChk = pwChkInput.value;

    if (pwChk.length === 0) {
        matchText.innerText = "";
        joinBtn.disabled = true;
        return;
    }

    if (pw === pwChk) {
        matchText.innerText = "비밀번호가 일치합니다";
        matchText.style.color = "#4cd964";
        joinBtn.disabled = false;
    } else {
        matchText.innerText = "비밀번호가 일치하지 않습니다";
        matchText.style.color = "#ff6b6b";
        joinBtn.disabled = true;
    }
}