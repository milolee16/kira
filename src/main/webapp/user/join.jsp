<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>회원가입</title>

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

    .join-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      position: relative;
      z-index: 1;
    }

    .join-card {
      width: 100%;
      max-width: 560px;
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

    .join-card::before {
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

    .join-title {
      font-family: "Nanum Pen Script", cursive;
      font-size: 40px;
      color: #7a6b5c;
      text-align: center;
      margin-bottom: 8px;
    }

    .join-subtitle {
      text-align: center;
      font-size: 15px;
      color: #9a8b7a;
      margin-bottom: 28px;
    }

    #joinForm {
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

    .inline-check {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .inline-check input {
      flex: 1;
    }

    .sub-btn {
      flex-shrink: 0;
      padding: 10px 14px;
      border: 1px solid #e8d5bf;
      border-radius: 18px;
      background: #fff8ef;
      color: #8a7a78;
      font-family: "Gaegu", cursive;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      white-space: nowrap;
    }

    .sub-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(180, 150, 120, 0.12);
    }

    #joinBtn {
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

    #joinBtn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(180, 140, 130, 0.15);
    }

    .bottom-link {
      margin-top: 22px;
      padding-top: 16px;
      border-top: 1px dashed #e8d5bf;
      text-align: center;
    }

    .bottom-link a {
      color: #8a7a78;
      text-decoration: none;
      font-size: 17px;
    }

    .bottom-link a:hover {
      color: #ee99aa;
    }

    input[type="hidden"] {
      display: none;
    }

    @media (max-width: 620px) {
      .join-card {
        padding: 28px 20px;
      }

      .inline-check {
        flex-direction: column;
        align-items: stretch;
      }

      .sub-btn {
        width: 100%;
      }
    }
  </style>
</head>
<body>

<div class="join-wrapper">
  <div class="join-card">
    <h1 class="join-title">Join</h1>
    <div class="join-subtitle">회원가입 정보를 입력해주세요</div>

    <form id="joinForm">
      <div class="form-row">
        <label for="name">이름</label>
        <input id="name" name="name" required placeholder="이름 입력">
      </div>

      <div class="form-row">
        <label for="birth">생년월일</label>
        <input id="birth" type="date" name="birth" required>
      </div>

      <div class="form-row">
        <label for="id">아이디</label>
        <div class="inline-check">
          <input name="id" id="id" required placeholder="아이디 입력">
          <button type="button" id="idCheckBtn" class="sub-btn">중복확인</button>
        </div>
      </div>

      <div class="form-row">
        <label for="pw">비밀번호</label>
        <input id="pw" type="password" name="pw" required placeholder="비밀번호 입력">
      </div>

      <div class="form-row">
        <label for="pwChk">비밀번호 확인</label>
        <input id="pwChk" type="password" name="pwChk" required placeholder="비밀번호 다시 입력">
      </div>

      <div class="form-row">
        <label for="nickname">닉네임</label>
        <div class="inline-check">
          <input name="nickname" id="nickname" required placeholder="닉네임 입력">
          <button type="button" id="nicknameCheckBtn" class="sub-btn">중복확인</button>
        </div>
      </div>

      <div class="form-row">
        <label for="email">이메일</label>
        <div class="inline-check">
          <input name="email" id="email" required placeholder="이메일 입력">
          <button type="button" id="emailSendBtn" class="sub-btn">인증번호 받기</button>
        </div>
      </div>

      <div class="form-row">
        <label for="emailCode">인증번호</label>
        <div class="inline-check">
          <input name="emailCode" id="emailCode" placeholder="인증번호 입력">
          <button type="button" id="emailCheckBtn" class="sub-btn">인증확인</button>
        </div>
      </div>

      <input type="hidden" name="idChecked" id="idChecked" value="N">
      <input type="hidden" name="checkedId" id="checkedId">

      <input type="hidden" name="nicknameChecked" id="nicknameChecked" value="N">
      <input type="hidden" name="checkedNickname" id="checkedNickname">

      <input type="hidden" name="emailVerified" id="emailVerified" value="N">
      <input type="hidden" name="verifiedEmail" id="verifiedEmail">

      <button type="button" id="joinBtn">회원가입</button>
    </form>

    <div class="bottom-link">
      <a href="${pageContext.request.contextPath}/login">로그인으로 돌아가기</a>
    </div>
  </div>
</div>

</body>
</html>