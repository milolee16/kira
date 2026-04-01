<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<form action="/visitor" method="post" class="write-row">
    <span style="font-family: 'Nanum Pen Script', cursive; font-size: 22px; color: #8a7a78;">🐾 발도장 꾹: </span>
    <input type="text" name="visitorName" placeholder="닉네임" class="write-input" required/>
    <button type="submit" class="write-btn">다녀감</button>
</form>

<div class="posts">
    <c:choose>
        <c:when test="${empty visitorList}">
            <div class="post-item" style="text-align: center; color: #aaa09a;">
                아직 다녀간 사람이 없어요. 첫 발도장을 찍어주세요! 😊
            </div>
        </c:when>
        <c:otherwise>
            <c:forEach var="v" items="${visitorList}">
                <div class="post-item">
                    <div class="post-header">
                        <span class="post-user">${v.name}</span>
                        <span class="post-date">${v.visitTime}</span>
                    </div>
                    <div class="post-text">🐾 발도장을 남기고 갑니다!</div>
                </div>
            </c:forEach>
        </c:otherwise>
    </c:choose>
</div>