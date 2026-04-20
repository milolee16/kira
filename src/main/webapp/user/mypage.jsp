<%@ page contentType="text/html;charset=UTF-8" %>
<script src="https://js.tosspayments.com/v2/standard"></script>
<script src="js/index.js"></script>
<script>
    const loginUserId = "${sessionScope.loginUserId}";
</script>

<!DOCTYPE html>
<html>
<head>
    <title>마이페이지</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/user/mypage.css">
</head>
<body>

<div class="mypage-container">
    <h2>마이페이지</h2>
    
    <div class="mypage-item">
        <span>이름</span>
        <div>${sessionScope.loginUserName}</div>
    </div>

    <div class="mypage-item">
        <span>아이디</span>
        <div>${sessionScope.loginUserId}</div>
    </div>

    <div class="mypage-item">
        <span>닉네임</span>
        <div>${sessionScope.loginUserNickname}</div>
    </div>

    <div class="mypage-item">
        <span>닉네임 변경권</span>
        <div>${sessionScope.loginUserNickTicket}개</div>
    </div>

    <div class="mypage-actions">

        <!-- 닉네임 변경 -->
        <button type="button" onclick="toggleNick()">닉네임 변경</button>

        <div id="nickBox" style="display:none;">
            <form id = "nickForm" action="${pageContext.request.contextPath}/change-nickname" method="post"
                  onsubmit="return validateNickForm();">

                <div class="inline-delete">
                    <input type="text" id="newNickname" name="newNickname"
                           placeholder="새 닉네임 입력" required maxlength="20">
                    <button type="button" onclick="checkNickname()">중복확인</button>
                </div>

                <input type="hidden" id="nickChecked" name="nickChecked" value="N">
                <input type="hidden" id="checkedNickname" name="checkedNickname" value="">

                <div id="nick-check-text"></div>

                <div style="margin-top:10px;">
                    <button type="submit">닉네임 변경하기</button>
                </div>
            </form>
        </div>

        <!-- 닉네임 변경권 구매 -->
        <button type="button" onclick="buyNickTicket()">닉네임 변경권 구매</button>


        <!-- 비밀번호 변경 버튼 -->
        <button type="button" onclick="togglePw()">비밀번호 변경</button>

        <!-- 비밀번호 변경 영역 -->
        <div id="pwBox" style="display:none;">
            <form action="${pageContext.request.contextPath}/change-pw" method="post">

                <input type="password" name="oldPw" placeholder="현재 비밀번호" required>

                <input type="password" id="newPw" name="newPw" placeholder="새 비밀번호" required>

                <div id="pw-strength">
                    <div class="pw-bar"></div>
                    <span class="pw-text">비밀번호를 입력하세요</span>
                </div>

                <div class="pw-hint">
                    8자 이상 / 문자 / 숫자 / 특수문자 포함
                </div>


                <div id="pw-match-text"></div>

                <div class="inline-pw-confirm">
                    <input type="password" id="newPwChk" name="newPwChk" placeholder="새 비밀번호 확인" required>
                    <button type="submit">변경하기</button>
                </div>
            </form>
        </div>


        <!-- 회원탈퇴 버튼 -->
        <button type="button" class="danger" onclick="toggleDelete()">회원탈퇴</button>

        <!-- 회원탈퇴 영역 -->
        <div id="deleteBox" style="display:none;">
            <form action="${pageContext.request.contextPath}/delete-user" method="post"
                  onsubmit="return confirm('정말 회원탈퇴 하시겠습니까?');">

                <div class="inline-delete">
                    <input type="password" name="pw" placeholder="비밀번호 입력" required>
                    <button type="submit" class="danger">탈퇴하기</button>
                </div>

            </form>
        </div>

        <%--프로필사진 수정 --%>
        <button type="button" class="danger" onclick="triggerProfileUpload()">프로필사진 수정</button>
        <input type="file" id="profile-file-input" style="display: none;" accept="image/*"
               onchange="uploadProfile(this)">
        <%--프로필사진 수정 --%>


    </div>

    <div class="mypage-back">
        <a href="javascript:void(0);" onclick="location.href='${pageContext.request.contextPath}/main'">
            ← 메인으로 돌아가기
        </a>
    </div>
</div>


<script>
    const pwInput = document.getElementById("newPw");
    const pwChkInput = document.getElementById("newPwChk");
    const bar = document.querySelector(".pw-bar");
    const text = document.querySelector(".pw-text");
    const matchText = document.getElementById("pw-match-text");
    const pwForm = document.querySelector("#pwBox form");

    // 강도 체크
    pwInput.addEventListener("input", function () {
        const pw = pwInput.value;
        let score = 0;

        if (pw.length >= 8) score++;
        if (/[A-Za-z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;

        bar.className = "pw-bar";

        if (pw.length === 0) {
            text.innerText = "비밀번호를 입력하세요";
            text.style.color = "";
            return;
        }

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

    // 일치 여부 체크
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

    // 제출 시 최종 검증
    pwForm.addEventListener("submit", function (e) {
        const pw = pwInput.value.trim();
        const pwChk = pwChkInput.value.trim();

        // 8자 이상 / 영문 / 숫자 / 특수문자 포함
        const pwRule = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;

        if (!pwRule.test(pw)) {
            alert("새 비밀번호는 8자 이상이며, 영문, 숫자, 특수문자를 모두 포함해야 합니다.");
            pwInput.focus();
            e.preventDefault();
            return;
        }

        if (pw !== pwChk) {
            alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            pwChkInput.focus();
            e.preventDefault();
        }
    });

    function togglePw() {
        const pwBox = document.getElementById("pwBox");
        const deleteBox = document.getElementById("deleteBox");

        if (pwBox.style.display === "none" || pwBox.style.display === "") {
            pwBox.style.display = "block";
            deleteBox.style.display = "none"; // 다른건 닫기
        } else {
            pwBox.style.display = "none";
        }
    }

    function toggleDelete() {
        const deleteBox = document.getElementById("deleteBox");
        const pwBox = document.getElementById("pwBox");

        if (deleteBox.style.display === "none" || deleteBox.style.display === "") {
            deleteBox.style.display = "block";
            pwBox.style.display = "none"; // 다른건 닫기
        } else {
            deleteBox.style.display = "none";
        }
    }

    // --------- tk 작성 --------
    function triggerProfileUpload() {
        // 본인 미니홈피일 때만 수정 가능하도록 체크 (필요 시)
        document.getElementById('profile-file-input').click();
    }

    async function uploadProfile(input) {
        if (!input.files || !input.files[0]) return;

        const file = input.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch('/supabase', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                alert('클라우드 업로드에 실패했습니다.');
                return;
            }

            const newImgUrl = await response.text(); // 업로드된 URL 텍스트

            // 2. DB 업데이트를 위한 서블릿 호출 (새로운 서블릿 필요)
            const dbResponse = await fetch('/updateProfile', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: 'imgUrl=' + encodeURIComponent(newImgUrl)
            });
            const text = await dbResponse.text()
            const row = parseInt(text);

            if (!dbResponse.ok) {
                alert('DB 저장에 실패했습니다.');
            }

            if(row > 0){
            alert('프로필 사진이 성공적으로 변경되었습니다! ✨');
            // 메인으로 이동하여 세션에 저장된 사진 확인
                sessionStorage.removeItem("currentHostId");
                sessionStorage.removeItem("currentHostNick");
                sessionStorage.removeItem("currentHostImg");

                location.href = '/main';
            }

        } catch (error) {
            console.error("Error:", error);
            alert('처리 중 오류가 발생했습니다.');
        }
    }


    // --------- tk 작성 --------

    // 닉네임 변경
    function toggleNick() {
        const nickBox = document.getElementById("nickBox");
        const pwBox = document.getElementById("pwBox");
        const deleteBox = document.getElementById("deleteBox");

        if (nickBox.style.display === "none" || nickBox.style.display === "") {
            nickBox.style.display = "block";
            pwBox.style.display = "none";
            deleteBox.style.display = "none";
        } else {
            nickBox.style.display = "none";
        }
    }

    async function checkNickname() {
        const nicknameInput = document.getElementById("newNickname");
        const nick = nicknameInput.value.trim();
        const resultText = document.getElementById("nick-check-text");

        if (nick === "") {
            alert("닉네임을 입력하세요.");
            nicknameInput.focus();
            return;
        }

        const res = await fetch("${pageContext.request.contextPath}/nickname-check", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: "nickname=" + encodeURIComponent(nick)
        });

        const data = await res.json();
        alert(data.message);

        if (data.success) {
            document.getElementById("nickChecked").value = "Y";
            document.getElementById("checkedNickname").value = nick;
            resultText.innerText = "사용 가능한 닉네임입니다.";
            resultText.style.color = "#4cd964";
        } else {
            document.getElementById("nickChecked").value = "N";
            document.getElementById("checkedNickname").value = "";
            resultText.innerText = "이미 사용 중인 닉네임입니다.";
            resultText.style.color = "#ff6b6b";
        }
    }

    function validateNickForm() {
        const nick = document.getElementById("newNickname").value.trim();
        const checked = document.getElementById("nickChecked").value;
        const checkedNick = document.getElementById("checkedNickname").value;

        if (nick.length < 2 || nick.length > 20) {
            alert("닉네임은 2자 이상 20자 이하로 입력하세요.");
            return false;
        }

        if (checked !== "Y" || checkedNick !== nick) {
            alert("닉네임 중복확인을 완료해주세요.");
            return false;
        }

        return true;
    }

    async function buyNickTicket() {
        const orderRes = await fetch("${pageContext.request.contextPath}/nickname-ticket-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        });

        const orderData = await orderRes.json();

        if (!orderData.success) {
            alert(orderData.message);
            return;
        }

        const clientKey = "test_ck_6BYq7GWPVv20ejRA9LnlVNE5vbo1"; // 예: test_ck_...
        const tossPayments = TossPayments(clientKey);
        const payment = tossPayments.payment({
            customerKey: "${sessionScope.loginUserId}"
        });

        await payment.requestPayment({
            method: "CARD",
            amount: {
                currency: "KRW",
                value: orderData.amount
            },
            orderId: orderData.orderId,
            orderName: orderData.orderName,
            successUrl: window.location.origin + "${pageContext.request.contextPath}/payment/success",
            failUrl: window.location.origin + "${pageContext.request.contextPath}/payment/fail"
        });

    }

    const nickForm = document.getElementById("nickForm");

    if (nickForm) {
        nickForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            if (!validateNickForm()) {
                return;
            }

            const res = await fetch("${pageContext.request.contextPath}/change-nickname", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: new URLSearchParams(new FormData(nickForm))
            });

            const data = await res.json();
            alert(data.message);

            if (data.success) {
                alert("닉네임이 변경되어 다시 로그인해주세요.");
                location.href = "${pageContext.request.contextPath}/login";
            } else {
                alert(data.message);
            }
        });
// 메인

    }





</script>
</body>
</html>