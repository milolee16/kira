<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>비밀번호 재설정</title>

  <style>
    @import url("https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&family=Gaegu:wght@300;400;700&display=swap");

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: "Gaegu", cursive;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f3e5dc;
      background-image:
              repeating-linear-gradient(
                      90deg,
                      rgba(160, 130, 100, 0.03) 0px,
                      rgba(160, 130, 100, 0.03) 1px,
                      transparent 1px,
                      transparent 40px
              ),
              radial-gradient(
                      circle at 70% 30%,
                      rgba(210, 180, 140, 0.15) 0%,
                      transparent 60%
              ),
              radial-gradient(
                      circle at 20% 80%,
                      rgba(210, 180, 140, 0.1) 0%,
                      transparent 50%
              ),
              linear-gradient(180deg, #f3e5dc 0%, #e2d2c2 100%);
      padding: 30px 15px;
      position: relative;
    }

    body::after {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.08);
      pointer-events: none;
    }

    .resetpw-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      position: relative;
      z-index: 1;
    }

    .resetpw-card {
      width: 100%;
      max-width: 500px;
      background: #fffdfa;
      padding: 35px 30px;
      border-radius: 14px;
      border: 1px solid #eee0d0;
      box-shadow:
              3px 4px 12px rgba(120, 100, 80, 0.08),
              inset 0 0 20px rgba(255, 255, 255, 1);
      position: relative;
      transform: rotate(-1deg);
    }

    .resetpw-card::before {
      content: "";
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%) rotate(2deg);
      width: 75px;
      height: 20px;
      background: rgba(100, 210, 190, 0.55);
      border: 1px solid rgba(80, 180, 160, 0.35);
      border-radius: 2px;
    }

    .resetpw-title {
      font-family: "Nanum Pen Script", cursive;
      font-size: 40px;
      color: #7a6b5c;
      text-align: center;
      margin-bottom: 8px;
    }

    .resetpw-subtitle {
      text-align: center;
      font-size: 15px;
      color: #9a8b7a;
      margin-bottom: 28px;
    }

    #resetPwForm {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-row label {
      font-size: 18px;
      color: #8a7b6a;
    }

    .form-row input {
      width: 100%;
      border: none;
      border-bottom: 2px solid #f7cfcd;
      background: transparent;
      padding: 10px 6px;
      font-family: "Gaegu", cursive;
      font-size: 20px;
      color: #5a4a3a;
      outline: none;
    }

    .form-row input::placeholder {
      color: #c0b0a0;
    }

    .form-row input:focus {
      border-bottom: 2px solid #ee99aa;
    }

    #resetPwBtn {
      margin-top: 10px;
      padding: 13px 20px;
      background: linear-gradient(135deg, #fceae8 0%, #f7cfcd 100%);
      color: #8a7a78;
      border: 1px solid #f2c0bd;
      border-radius: 24px;
      font-family: "Gaegu", cursive;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    #resetPwBtn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(180, 140, 130, 0.15);
    }

    input[type="hidden"] {
      display: none;
    }

    @media (max-width: 620px) {
      .resetpw-card {
        padding: 28px 20px;
      }
    }
  </style>
</head>
<body>

<div class="resetpw-wrapper">
  <div class="resetpw-card">
    <h1 class="resetpw-title">Reset Password</h1>
    <div class="resetpw-subtitle">새로운 비밀번호를 입력해주세요</div>

    <form id="resetPwForm">
      <input type="hidden" name="id" id="resetId">
      <input type="hidden" name="name" id="resetName">
      <input type="hidden" name="email" id="resetEmail">

      <div class="form-row">
        <label for="newPw">새 비밀번호</label>
        <input id="newPw" type="password" name="newPw" required placeholder="새 비밀번호 입력">
      </div>

      <div class="form-row">
        <label for="newPwChk">새 비밀번호 확인</label>
        <input id="newPwChk" type="password" name="newPwChk" required placeholder="새 비밀번호 다시 입력">
      </div>

      <button type="button" id="resetPwBtn">비밀번호 변경</button>
    </form>
  </div>
</div>

<script>
  window.appCtx = "${pageContext.request.contextPath}";
</script>
<script src="${pageContext.request.contextPath}/js/user/reset-pw.js"></script>
</body>
</html>