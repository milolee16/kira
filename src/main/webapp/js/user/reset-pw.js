const ctx = window.appCtx;
const resetPwForm = document.getElementById("resetPwForm");

const resetId = document.getElementById("resetId");
const resetName = document.getElementById("resetName");
const resetEmail = document.getElementById("resetEmail");

const newPw = document.getElementById("newPw");
const newPwChk = document.getElementById("newPwChk");
const resetPwBtn = document.getElementById("resetPwBtn");

const pwStrengthText = document.getElementById("pwStrengthText");
const pwStrengthBar = document.getElementById("pwStrengthBar");

// 세션스토리지에 저장해둔 값 hidden input에 넣기
resetId.value = sessionStorage.getItem("resetPwId") || "";
resetName.value = sessionStorage.getItem("resetPwName") || "";
resetEmail.value = sessionStorage.getItem("resetPwEmail") || "";

// 비밀번호 강도 계산
function getPasswordStrength(pw) {
    let score = 0;

    if (pw.length >= 8) score++;                  // 길이
    if (/[A-Za-z]/.test(pw)) score++;            // 영문 포함
    if (/[0-9]/.test(pw)) score++;               // 숫자 포함
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pw)) score++; // 특수문자 포함

    return score;
}

// 비밀번호 강도 UI 표시
function updatePasswordStrengthUI(pw) {
    if (!pw) {
        pwStrengthText.innerText = "";
        pwStrengthBar.style.width = "0%";
        pwStrengthBar.style.backgroundColor = "transparent";
        return;
    }

    const score = getPasswordStrength(pw);

    if (score <= 1) {
        pwStrengthText.innerText = "비밀번호 강도: 약함";
        pwStrengthBar.style.width = "25%";
        pwStrengthBar.style.backgroundColor = "red";
    } else if (score === 2) {
        pwStrengthText.innerText = "비밀번호 강도: 보통";
        pwStrengthBar.style.width = "50%";
        pwStrengthBar.style.backgroundColor = "orange";
    } else if (score === 3) {
        pwStrengthText.innerText = "비밀번호 강도: 강함";
        pwStrengthBar.style.width = "75%";
        pwStrengthBar.style.backgroundColor = "dodgerblue";
    } else {
        pwStrengthText.innerText = "비밀번호 강도: 매우 강함";
        pwStrengthBar.style.width = "100%";
        pwStrengthBar.style.backgroundColor = "green";
    }
}

// 입력할 때마다 강도 표시
newPw.addEventListener("input", () => {
    updatePasswordStrengthUI(newPw.value);
});

// 버튼 클릭 시 최종 검증 + fetch 전송
resetPwBtn.addEventListener("click", async () => {
    const pw = newPw.value.trim();
    const pwChk = newPwChk.value.trim();

    // 8자 이상 + 숫자 1개 이상 + 특수문자 1개 이상
    const pwRule = /^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!pwRule.test(pw)) {
        alert("비밀번호는 8자 이상이며, 숫자와 특수문자를 포함해야 합니다.");
        newPw.focus();
        return;
    }

    if (pw !== pwChk) {
        alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        newPwChk.focus();
        return;
    }

    try {
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
    } catch (error) {
        alert("서버 요청 중 오류가 발생했습니다.");
        console.error(error);
    }
});