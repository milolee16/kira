<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<meta charset="UTF-8">
<form action="${pageContext.request.contextPath}/login" method="post">
    아이디: <input name="id"><br>
    비밀번호: <input type="password" name="pw"><br>

    <button type="submit">OOO 로그인</button>
</form>

<br>

<a href="${pageContext.request.contextPath}/find-id">아이디 찾기</a> |
<a href="${pageContext.request.contextPath}/find-pw">비밀번호 찾기</a> |
<a href="${pageContext.request.contextPath}/join">회원가입</a>