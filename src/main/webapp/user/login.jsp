<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>로그인</title>
</head>
<body>

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

<form action="${pageContext.request.contextPath}/login" method="post">
    <div>
        아이디:
        <input name="id" value="${id}">
    </div>
    <br>

    <div>
        비밀번호:
        <input type="password" name="pw" value="${pw}">
    </div>
    <br>

    <button type="submit">OOO 로그인</button>
</form>

<br>

<a href="${pageContext.request.contextPath}/find-id">아이디 찾기</a> |
<a href="${pageContext.request.contextPath}/find-pw">비밀번호 찾기</a> |
<a href="${pageContext.request.contextPath}/join">회원가입</a>

</body>
</html>