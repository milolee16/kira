<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>회원가입</title>
</head>
<body>

<h2>회원가입</h2>

<%
  String msg = (String) request.getAttribute("msg");
  if (msg != null) {
%>
<script>
  alert("<%= msg %>");
</script>
<%
  }
%>

<form action="${pageContext.request.contextPath}/join" method="post">
  <div>
    이름:
    <input name="name" maxlength="30" required value="${name}">
  </div>
  <br>

  <div>
    생년월일:
    <input type="date" name="birth" required value="${birth}">
  </div>
  <br>

  <div>
    아이디:
    <input name="id" maxlength="30" required value="${id}">
    <button type="submit" formnovalidate
            formaction="${pageContext.request.contextPath}/id-check"
            formmethod="post">중복확인</button>
  </div>
  <br>

  <div>
    비밀번호:
    <input type="password" name="pw" maxlength="30" required value="${pw}">
  </div>
  <br>

  <div>
    비밀번호 확인:
    <input type="password" name="pwChk" maxlength="30" required value="${pwChk}">
  </div>
  <br>

  <div>
    닉네임:
    <input name="nickname" maxlength="30" required value="${nickname}">
    <button type="submit" formnovalidate
            formaction="${pageContext.request.contextPath}/nickname-check"
            formmethod="post" >중복확인</button>
  </div>
  <br>

  <div>
    이메일:
    <input name="email" maxlength="100" required value="${email}"
           placeholder="example@gmail.com or example@naver.com">
    <button type="submit"
            formaction="${pageContext.request.contextPath}/email-send"
            formmethod="post">인증번호 받기</button>
  </div>
  <br>

  <div>
    인증번호:
    <input name="emailCode" maxlength="10" value="${emailCode}">
    <button type="submit"
            formaction="${pageContext.request.contextPath}/email-check"
            formmethod="post">인증확인</button>
  </div>
  <br>

  <input type="hidden" name="idChecked" value="${idChecked}">
  <input type="hidden" name="checkedId" value="${checkedId}">

  <input type="hidden" name="nicknameChecked" value="${nicknameChecked}">
  <input type="hidden" name="checkedNickname" value="${checkedNickname}">

  <input type="hidden" name="emailVerified" value="${emailVerified}">
  <input type="hidden" name="verifiedEmail" value="${verifiedEmail}">

  <button type="submit">회원가입</button>
</form>

</body>
</html>