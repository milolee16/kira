<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">

    <link rel="stylesheet" href="css/index.css">
    <link href="https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&family=Gaegu:wght@300;400;700&display=swap" rel="stylesheet">

</head>
<body>

<form action="visitor" method="post" class="vWrite-row"
      style="display:flex; justify-content:center; align-items:center; gap:10px; margin-bottom:20px; position:static; width:100%;">
    <span style="font-family:'Nanum Pen Script'; font-size:22px; color:#8a7a78;">🐾 발도장 꾹:</span>
    <input type="text" name="visitorName" class="write-input" placeholder="닉네임" style="width:150px;" required>
    <button type="submit" class="write-btn">다녀감</button>
</form>

<div class="posts" style="min-height: 450px; display: flex; flex-direction: column; gap: 8px;">
    <c:choose>
        <c:when test="${empty visitorList}">
            <div class="post-item" style="text-align:center; color:#aaa; padding:50px;">
                첫 발도장을 찍어주세요 😊
            </div>
        </c:when>
        <c:otherwise>
            <c:forEach var="v" items="${visitorList}">
                <div class="post-item" style="display:flex; justify-content:space-between; align-items:center; padding:10px 15px;">

                    <div style="display:flex; align-items:center; gap:10px;">
                        <span class="moving-emoji">
                         <c:choose>
                             <c:when test="${v.v_emoji == 1}">&#128062;</c:when> <%-- 🐾 --%>
                             <c:when test="${v.v_emoji == 2}">&#128099;</c:when> <%-- 👣 --%>
                             <c:when test="${v.v_emoji == 3}">&#128049;</c:when> <%-- 🐱 --%>
                             <c:when test="${v.v_emoji == 4}">&#128054;</c:when> <%-- 🐶 --%>
                             <c:otherwise>&#10024;</c:otherwise>             <%-- ✨ --%>
                         </c:choose>
                        </span>
                        <span style="font-size:16px;">
                            <strong>${v.v_writer_id}</strong>님이 다녀갔습니다.
                        </span>
                    </div>

                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="font-size:12px; color:#aaa;">${v.v_date}</span>
                        <a href="javascript:void(0);"
                           onclick="if(confirm('삭제하시겠습니까?')) { location.href='visitorDel?vId=${v.v_id}'; }"
                           style="text-decoration:none; color:#ff9999; font-weight:bold; font-size:18px;">
                            &times;
                        </a>
                    </div>
                </div>
            </c:forEach>
        </c:otherwise>
    </c:choose>
</div>

<div class="paging-box" style="display:flex; justify-content:space-between; align-items:center; margin-top:15px; padding:0 10px;">

    <c:choose>
        <c:when test="${currentPage > 1}">
            <button class="page-btn" onclick="location.href='visitor?p=${currentPage-1}'">◀ 이전</button>
        </c:when>
        <c:otherwise>
            <div style="width:60px;"></div>
        </c:otherwise>
    </c:choose>

    <span style="font-family:'Nanum Pen Script'; color:#8a7a78; font-size:18px;">
        Page ${currentPage}
    </span>

    <c:choose>
        <c:when test="${fn:length(visitorList) == 7}">
            <button class="page-btn" onclick="location.href='visitor?p=${currentPage+1}'">다음 ▶</button>
        </c:when>
        <c:otherwise>
            <div style="width:60px;"></div>
        </c:otherwise>
    </c:choose>

</div>

</body>
</html>
