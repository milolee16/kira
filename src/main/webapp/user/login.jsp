<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>로그인</title>

    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/user/login.css">
</head>
<body>

<div class="login-wrapper">
    <div class="login-card">
        <h1 class="login-title">Login</h1>
        <div class="login-subtitle">아이디와 비밀번호를 입력해주세요</div>

        <form id="loginForm">
            <div class="input-group">
                <label for="id">아이디</label>
                <input id="id" name="id" placeholder="아이디 입력">
            </div>

            <div class="input-group">
                <label for="pw">비밀번호</label>
                <input id="pw" type="password" name="pw" placeholder="비밀번호 입력">
            </div>

            <button type="button" id="loginBtn">로그인</button>
        </form>

        <div class="login-links">
            <a href="${pageContext.request.contextPath}/find-id">아이디 찾기</a> |
            <a href="${pageContext.request.contextPath}/find-pw">비밀번호 찾기</a> |
            <a href="${pageContext.request.contextPath}/join">회원가입</a>
        </div>
    </div>
</div>


<script>
    window.appCtx = "${pageContext.request.contextPath}";
</script>
<script src="${pageContext.request.contextPath}/js/user/login.js"></script>



</body>
</html>
