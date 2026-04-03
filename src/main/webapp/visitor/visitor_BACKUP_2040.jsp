<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<<<<<<< HEAD
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
=======
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<div class="v-page-container" style="padding: 10px 20px;">
    <form action="visitor" method="post" class="vWrite-row"
          style="display:flex; justify-content:center; align-items:center; gap:12px; margin-bottom:25px; padding: 15px; background: #fff; border-radius: 30px; border: 1px solid #f2c0bd;">
        <span style="font-family:'Nanum Pen Script', cursive; font-size:24px; color:#8a7a78;">🐾 발도장 꾹:</span>
        <input type="text" name="visitorName" class="write-input" placeholder="닉네임"
               style="width:160px; border:none; border-bottom:2px solid #f7cfcd; outline:none; font-family:'Gaegu'; font-size:18px;" required>
        <button type="submit" class="write-btn"
                style="padding:5px 20px; background:linear-gradient(135deg, #fceae8, #f7cfcd); border:1px solid #f2c0bd; border-radius:20px; font-family:'Gaegu'; font-weight:bold; color:#8a7a78; cursor:pointer;">다녀감</button>
    </form>
>>>>>>> d7cd56f ([fix] visitor 0403 0942)

    <div class="posts" style="min-height: 480px; display: flex; flex-direction: column; gap: 12px;">
        <c:choose>
            <c:when test="${empty visitorList}">
                <div class="post-item" style="text-align:center; color:#aaa; padding:100px 0; font-size:20px;">
                    아직 다녀간 사람이 없어요. 첫 발도장을 찍어주세요! 😊
                </div>
            </c:when>
            <c:otherwise>
                <c:forEach var="v" items="${visitorList}">
                    <div class="post-item" style="display:flex; justify-content:space-between; align-items:center; padding:12px 20px; background:#fff; border-radius:10px; border:1px solid #f0eee5; box-shadow: 2px 2px 5px rgba(0,0,0,0.02);">
                        <div style="display:flex; align-items:center; gap:15px;">
                            <span class="moving-emoji" style="font-size: 22px; display: inline-block;">
                                <c:choose>
                                    <c:when test="${v.v_emoji == 1}">🐾</c:when>
                                    <c:when test="${v.v_emoji == 2}">👣</c:when>
                                    <c:when test="${v.v_emoji == 3}">🐱</c:when>
                                    <c:when test="${v.v_emoji == 4}">🐶</c:when>
                                    <c:otherwise>✨</c:otherwise>
                                </c:choose>
                            </span>
                            <span style="font-size:18px; color:#5a4a3a;">
                                <strong style="color:#f2a0a0;">${v.v_writer_id}</strong>님이 다녀갔습니다.
                            </span>
                        </div>
                        <div style="display:flex; align-items:center; gap:15px;">
                            <span style="font-size:13px; color:#c0b0a0;">${v.v_date}</span>
                            <a href="javascript:void(0);"
                               onclick="if(confirm('삭제하시겠습니까?')) { location.href='visitorDel?vId=${v.v_id}'; }"
                               style="text-decoration:none; color:#ff9999; font-weight:bold; font-size:20px;">&times;</a>
                        </div>
                    </div>
                </c:forEach>
            </c:otherwise>
        </c:choose>
    </div>

    <div class="paging-box" style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding:0 10px;">
        <c:choose>
            <c:when test="${currentPage > 1}">
                <button class="page-btn" onclick="location.href='visitor?p=${currentPage-1}'"
                        style="background:#fff; border:1px solid #f2c0bd; border-radius:15px; padding:5px 15px; cursor:pointer; font-family:'Gaegu'; color:#8a7a78;">◀ 이전</button>
            </c:when>
            <c:otherwise><div style="width:70px;"></div></c:otherwise>
        </c:choose>

        <span style="font-family:'Nanum Pen Script'; color:#8a7a78; font-size:22px;">Page ${currentPage}</span>

<<<<<<< HEAD
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
=======
        <c:choose>
            <c:when test="${fn:length(visitorList) == 7}">
                <button class="page-btn" onclick="location.href='visitor?p=${currentPage+1}'"
                        style="background:#fff; border:1px solid #f2c0bd; border-radius:15px; padding:5px 15px; cursor:pointer; font-family:'Gaegu'; color:#8a7a78;">다음 ▶</button>
            </c:when>
            <c:otherwise><div style="width:70px;"></div></c:otherwise>
        </c:choose>
    </div>
</div>
>>>>>>> d7cd56f ([fix] visitor 0403 0942)
