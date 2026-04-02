<<<<<<< HEAD
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
=======
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
>>>>>>> 7cadccfc67644f98b27fba6008d0d24e2ebe2fb8
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <%-- 부모와 같은 CSS 공유 --%>
    <link rel="stylesheet" href="/css/index.css">
    <link href="https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&family=Gaegu:wght@300;400;700&display=swap"
          rel="stylesheet">
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
           placeholder="닉네임" style="width: 150px;" required/>
    <button type="submit" class="write-btn">다녀감</button>

</form>

<div class="posts">
<<<<<<< HEAD
<c:choose>
    <c:when test="${empty visitorList}">
        <div class="post-item" style="text-align: center; color: #aaa09a; padding: 30px;">
        아직 다녀간 사람이 없어요. 첫 발도장을 찍어주세요! 😊
        <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
        <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

        <form action="visitor" method="post" class="write-row"
        style="position: relative; margin-bottom: 20px; width: 100%; bottom: auto;">
        <span style="font-family: 'Nanum Pen Script', cursive; font-size: 20px; color: #8a7a78;">🐾 발도장: </span>
        <input type="text" name="visitorName" class="write-input" placeholder="닉네임" style="width: 120px; flex:none;"
        required/>
        <button type="submit" class="write-btn">다녀감</button>
        </form>

        <div class="posts" style="min-height: 480px; display: flex; flex-direction: column; gap: 8px;">
        <c:choose>
            <c:when test="${empty visitorList}">
                <div class="post-item" style="text-align: center; color: #aaa; padding: 50px;">
                    첫 발도장을 찍어주세요! 😊
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
                        style="display: flex; justify-content: space-between; align-items: center; padding: 10px 15px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="moving-emoji">
                         <c:choose>
                             <c:when test="${v.v_emoji == 1}">&#128062;</c:when> <%-- 🐾 --%>
                             <c:when test="${v.v_emoji == 2}">&#128099;</c:when> <%-- 👣 --%>
                             <c:when test="${v.v_emoji == 3}">&#128049;</c:when> <%-- 🐱 --%>
                             <c:when test="${v.v_emoji == 4}">&#128054;</c:when> <%-- 🐶 --%>
                             <c:otherwise>&#10024;</c:otherwise>             <%-- ✨ --%>
                         </c:choose>
                        </span>
                            <span style="font-size: 16px;"><strong>${v.v_writer_id}</strong>님이 다녀갔습니다.</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 12px; color: #aaa;">${v.v_date}</span>
                            <a href="javascript:void(0);"
                               onclick="if(confirm('삭제?')) { location.href='visitorDel?vId=${v.v_id}'; }"
                               style="text-decoration:none; color:#ff9999; font-weight:bold;">&times;</a>
                        </div>
                    </div>
                </c:forEach>
            </c:otherwise>
        </c:choose>
        </div>

        </body>
        </html>
        <div class="paging-box"
        style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding: 0 10px;">
        <c:choose>
            <c:when test="${currentPage > 1}">
                <button class="page-btn" onclick="location.href='visitor?p=${currentPage - 1}'">◀ 이전</button>
            </c:when>
            <c:otherwise>
                <div style="width:60px;"></div>
            </c:otherwise>
        </c:choose>

        <span style="font-family: 'Nanum Pen Script'; color: #8a7a78; font-size: 18px;">Page ${currentPage}</span>

        <c:choose>
            <c:when test="${fn:length(visitorList) == 7}">
                <button class="page-btn" onclick="location.href='visitor?p=${currentPage + 1}'">다음 ▶</button>
            </c:when>
            <c:otherwise>
                <div style="width:60px;"></div>
            </c:otherwise>
        </c:choose>
</c:choose>
=======
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
>>>>>>> 7cadccfc67644f98b27fba6008d0d24e2ebe2fb8
