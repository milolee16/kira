<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/diary.css">
    <style>
        /* iframe 배경을 투명하게 하고 여백 정리 */
        body { background: transparent; margin: 0; padding: 0; overflow-x: hidden; }

        /* 스크롤바 디자인 (iframe 내부용) */
        body::-webkit-scrollbar { width: 6px; }
        body::-webkit-scrollbar-thumb { background: #f7cfcd; border-radius: 10px; }
    </style>
</head>
<body>
<div class="diary-container">
    <c:choose>
        <%-- [A] 글쓰기 모드 --%>
        <c:when test="${showMode == 'write'}">
            <div class="diary-board">
                <div class="board-header">
                    <h3>✍️ ${curYear}.${curMonth}.${selectedDay} 일기 쓰기</h3>
                    <button onclick="location.href='diary?y=${curYear}&m=${curMonth}&d=${selectedDay}'" class="write-btn">취소</button>
                </div>
                <form action="diary.write" method="post">
                    <input type="hidden" name="d_year" value="${curYear}">
                    <input type="hidden" name="d_month" value="${curMonth}">
                    <input type="hidden" name="d_date" value="${selectedDay}">
                    <input name="d_title" placeholder="제목을 입력하세요" class="write-input-title" style="width:100%; padding:15px; border:none; border-bottom:2px solid #f7cfcd; font-family:'Gaegu'; font-size:22px; outline:none;">
                    <textarea name="d_txt" placeholder="내용을 입력하세요..." style="width:100%; height:250px; border:none; padding:15px; font-family:'Gaegu'; font-size:20px; outline:none; resize:none;"></textarea>
                    <div style="text-align:right; margin-top:10px;"><button class="write-btn">등록하기</button></div>
                </form>
            </div>
        </c:when>

        <%-- [B] 목록 및 [C] 기본 달력 --%>
        <c:otherwise>
            <div class="calendar-header">
                <a href="diary?y=${prevYear}&m=${prevMonth}" class="cal-btn">◀</a>
                <span class="cal-title">${curYear}. ${curMonth < 10 ? '0' : ''}${curMonth}</span>
                <a href="diary?y=${nextYear}&m=${nextMonth}" class="cal-btn">▶</a>
            </div>

            <div class="calendar-wrap">
                <table class="calendar-table">
                    <thead>
                    <tr><th class="sun">SUN</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th class="sat">SAT</th></tr>
                    </thead>
                    <tbody>
                    <tr>
                        <c:if test="${startDay > 1}">
                            <c:forEach var="i" begin="1" end="${startDay - 1}"><td></td></c:forEach>
                        </c:if>
                        <c:forEach var="d" begin="1" end="${lastDay}">
                        <td class="${(d + startDay - 1) % 7 == 1 ? 'sun' : ((d + startDay - 1) % 7 == 0 ? 'sat' : '')}">
                            <a href="diary?y=${curYear}&m=${curMonth}&d=${d}">${d}</a>
                        </td>
                        <c:if test="${(d + startDay - 1) % 7 == 0 && d < lastDay}"></tr><tr></c:if>
                        </c:forEach>
                    </tr>
                    </tbody>
                </table>
            </div>

            <c:if test="${showMode == 'list'}">
                <div class="diary-board">
                    <div class="board-header">
                        <h3>📅 ${selectedDay}일의 일기</h3>
                        <button onclick="location.href='diary?y=${curYear}&m=${curMonth}&d=${selectedDay}&mode=write'" class="write-btn">일기쓰기</button>
                    </div>
                    <div class="posts">
                        <c:forEach var="p" items="${posts}">
                            <div class="post-item">
                                <div class="post-header" style="display:flex; justify-content:space-between; border-bottom:1px dashed #eee; padding-bottom:10px; margin-bottom:10px;">
                                    <span style="font-family:'Gaegu'; font-weight:bold; font-size:20px;">${p}</span>
                                    <span style="font-size:12px; color:#bbb;">${curYear}.${curMonth}.${selectedDay}</span>
                                </div>
                                <div style="font-family:'Gaegu'; font-size:18px;">여기에 일기 본문 내용이 출력됩니다.</div>
                            </div>
                        </c:forEach>
                    </div>
                </div>
            </c:if>
        </c:otherwise>
    </c:choose>
</div>
</body>
</html>