<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>JSP - Hello World</title>
</head>
<body>
<!DOCTYPE html>
<html>
<head>
    <title>JSP - Hello World</title>
</head>
<body>
<div class="diary-container">
    <c:choose>
        <%-- [A] 글쓰기 모드: 전체 화면 --%>
        <c:when test="${showMode == 'write'}">
            <div class="write-full-container">
                <div class="board-header">
                    <h3>✍️ ${curYear}.${curMonth}.${selectedDay} 일기 쓰기</h3>
                    <button onclick="location.href='diary?y=${curYear}&m=${curMonth}&d=${selectedDay}'" class="write-btn">취소</button>
                </div>

                <form action="diary.write" method="post" class="write-form-full">
                    <input type="hidden" name="d_year" value="${curYear}">
                    <input type="hidden" name="d_month" value="${curMonth}">
                    <input type="hidden" name="d_date" value="${selectedDay}">

                    <input name="d_title" placeholder="제목을 입력하세요" class="write-input-title" required>
                    <textarea id="editor" name="d_txt" class="write-input-content" placeholder="내용을 입력하세요..." required></textarea>

                    <div class="write-footer">
                        <button class="write-btn">등록하기</button>
                    </div>
                </form>
            </div>
        </c:when>

        <%-- [B] 목록 및 [C] 기본 달력 --%>
        <c:otherwise>
            <div class="calendar-header" style="position: relative;">
                <a href="diary?y=${prevYear}&m=${prevMonth}" class="cal-btn">◀</a>

                <span class="cal-title" onclick="toggleDateSelector()" title="클릭하여 이동">
                    ${curYear}. ${curMonth < 10 ? '0' : ''}${curMonth}
                </span>

                <div id="dateSelector" class="date-selector" style="display: none; position: absolute; top: 45px; background: white; padding: 10px; border: 1px solid #f7cfcd; border-radius: 8px; z-index: 10;">
                    <form action="diary" method="get" style="display: flex; gap: 5px; align-items: center;">
                        <input type="number" name="y" value="${curYear}" style="width: 60px;"> 년
                        <input type="number" name="m" value="${curMonth}" min="1" max="12" style="width: 40px;"> 월
                        <button class="write-btn" style="padding: 2px 8px; font-size: 12px;">Go</button>
                    </form>
                </div>

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
                        <td class="${(d + startDay - 1) % 7 == 1 ? 'sun' : ((d + startDay - 1) % 7 == 0 ? 'sat' : '')} ${selectedDay == d ? 'selected-td' : ''}">
                            <a href="diary?y=${curYear}&m=${curMonth}&d=${d}">${d}</a>
                        </td>
                        <c:if test="${(d + startDay - 1) % 7 == 0 && d < lastDay}"></tr><tr></c:if>
                        </c:forEach>
                    </tr>
                    </tbody>
                </table>
            </div>

            <c:if test="${showMode == 'list'}">
                <hr class="diary-hr">
                <div class="diary-board">
                    <div class="board-header">
                        <h3>📅 ${selectedDay}일의 일기</h3>
                        <button onclick="location.href='diary?y=${curYear}&m=${curMonth}&d=${selectedDay}&mode=write'" class="write-btn">일기쓰기</button>
                    </div>
                    <div class="posts">
                        <c:forEach var="p" items="${posts}">
                            <div class="post-item">
                                <div class="post-header">
                                    <span class="post-user">${p}</span>
                                    <span class="post-date">${curYear}.${curMonth}.${selectedDay}</span>
                                </div>
                                <div class="post-text">여기에 일기 본문이 들어갑니다.</div>
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
</body>
</html>