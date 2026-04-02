<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <%-- 부모와 같은 CSS 공유 --%>
    <link rel="stylesheet" href="/css/index.css">
    <link href="https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&family=Gaegu:wght@300;400;700&display=swap" rel="stylesheet">
    <style>
        /* iframe body는 투명하게, 부모 공책 배경과 자연스럽게 합쳐짐 */
        html, body {
            margin: 0;
            padding: 0;
            background: transparent;
            overflow-x: hidden;
        }
    </style>
</head>
<body>

<form action="visitor?ajax=true" method="post" class="vWrite-row"
      style="justify-content: center; align-items: center; gap: 10px;">

    <span style="font-family: 'Nanum Pen Script', cursive; font-size: 22px; color: #8a7a78;">
        🐾 발도장 꾹:
    </span>
    <input type="text" name="visitorName" class="write-input"
           placeholder="닉네임" style="width: 150px;" required />
    <button type="submit" class="write-btn">다녀감</button>

</form>

<div class="posts">
    <c:choose>
        <c:when test="${empty visitorList}">
            <div class="post-item" style="text-align: center; color: #aaa09a; padding: 30px;">
                아직 다녀간 사람이 없어요. 첫 발도장을 찍어주세요! 😊
            </div>
        </c:when>
        <c:otherwise>
            <c:forEach var="v" items="${visitorList}">
                <div class="post-item"
                     style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 16px; color: #5a4a3a;">
                        <strong style="color: #f2a0a0;">${v.v_writer_id}</strong>님이 다녀갔습니다.
                    </span>
                    <span style="font-size: 13px; color: #c0b0a0;">${v.v_date}</span>
                </div>
            </c:forEach>
        </c:otherwise>
    </c:choose>
</div>

</body>
</html>
