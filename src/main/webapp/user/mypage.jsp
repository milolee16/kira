<%@ page contentType="text/html;charset=UTF-8" %>
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

    <div class="mypage-actions">

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
        <a href="javascript:void(0);" onclick="history.back()">← 메인으로 돌아가기</a>
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

</script>
</body>
</html>