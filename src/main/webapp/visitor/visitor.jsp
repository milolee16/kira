<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<form action="visitor" method="post" class="vWrite-row" style="justify-content: center; align-items: center; gap: 10px;>

    <span style="font-family: 'Nanum Pen Script', cursive; font-size: 22px; color: #8a7a78;">🐾 발도장 꾹: </span>

    <input type="text" name="visitorName" class="write-input" placeholder="닉네임" style="width: 150px;" required />

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
                <div class="post-item" style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 16px; color: #5a4a3a;">
                        <strong style="color: #f2a0a0;">${v.v_writer_id}</strong>님이 다녀갔습니다.
                    </span>
                        <%-- TO_CHAR로 포맷팅한 날짜 데이터 사용 --%>
                    <span style="font-size: 13px; color: #c0b0a0;">${v.v_date}</span>
                </div>
            </c:forEach>
        </c:otherwise>
    </c:choose>
</div>