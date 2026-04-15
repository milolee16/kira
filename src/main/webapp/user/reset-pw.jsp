<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>비밀번호 재설정</title>
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/user/reset-pw.css">
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

        <div id="pwGuide" class="pw-guide">
          8자 이상 / 숫자 / 특수문자 포함
        </div>
        <div id="pwStrengthText" class="pw-strength-text"></div>
        <div class="pw-strength-wrap">
          <div id="pwStrengthBar" class="pw-strength-bar"></div>
        </div>
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