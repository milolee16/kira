<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>회원가입</title>

  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/user/join.css">
</head>
<body>

<div class="join-wrapper">
  <div class="join-card">
    <h1 class="join-title">Join</h1>
    <div class="join-subtitle">회원가입 정보를 입력해주세요</div>

    <form id="joinForm" autocomplete="off">
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
        <input id="pw" type="password" name="pw" required
               placeholder="비밀번호 입력"
               pattern="^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]).{8,}$"
               title="비밀번호는 8자 이상, 문자·숫자·특수문자를 모두 포함해야 합니다.">

        <!-- 강도 -->
        <div id="pw-strength">
          <div class="pw-bar"></div>
          <span class="pw-text">비밀번호를 입력하세요</span>
        </div>

        <!-- 조건 -->
        <div class="pw-hint">
          8자 이상 / 문자 / 숫자 / 특수문자 포함
        </div>
      </div>

      <div class="form-row">
        <label for="pwChk">비밀번호 확인</label>
        <input id="pwChk" type="password" name="pwChk" required placeholder="비밀번호 다시 입력">

        <!-- 일치 여부 -->
        <div id="pw-match-text"></div>
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

<script>
  window.appCtx = "${pageContext.request.contextPath}";
</script>
<script src="${pageContext.request.contextPath}/js/user/join.js"></script>
</body>
</html>