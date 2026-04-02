<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <title>JSP - Hello World</title>
</head>
<body>
<div class="diary-container">
    <%-- [1] 달력 영역: 다이어리 버튼 누르면 가장 먼저 보이는 곳 --%>
    <div class="calendar-wrap">
        <table class="calendar-table">
            <thead>
            <tr>
                <th class="sun">SUN</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th class="sat">SAT</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <c:forEach var="i" begin="1" end="${startDay - 1}">
                    <td></td>
                </c:forEach>

                <c:forEach var="d" begin="1" end="${lastDay}">
                <td class="${(d + startDay - 1) % 7 == 1 ? 'sun' : ((d + startDay - 1) % 7 == 0 ? 'sat' : '')}">
                        <%-- 날짜를 클릭하면 해당 날짜 d를 파라미터로 다시 서블릿을 부릅니다 --%>
                    <a href="diary?d=${d}">${d}</a>
                </td>
                <c:if test="${(d + startDay - 1) % 7 == 0}">
            </tr><tr>
                </c:if>
                </c:forEach>
            </tr>
            </tbody>
        </table>
    </div>

    <%--
        [2] 게시판 영역:
        핵심!! selectedDay가 비어있지 않을 때(즉, 날짜를 클릭했을 때)만 아래 내용이 나타납니다.
    --%>
    <c:if test="${not empty selectedDay}">
        <hr class="diary-hr">

        <div class="diary-board">
            <div class="board-header">
                <h3>📅 ${selectedDay}일의 일기</h3>
                    <%-- 일기쓰기 버튼 --%>
                <button onclick="showWriteForm()" class="write-btn">일기쓰기</button>
            </div>

                <%-- 게시글 작성 폼 (일기쓰기 버튼을 눌러야 showWriteForm()에 의해 나타남) --%>
            <form action="diary.write" method="post" id="writeForm" style="display:none;" class="write-row">
                <input type="hidden" name="d_date" value="${selectedDay}">
                <input name="d_title" placeholder="제목" class="write-input" required>
                <textarea name="d_txt" placeholder="오늘의 추억..." class="write-input" required></textarea>
                <div style="text-align: right;">
                    <button class="write-btn">등록</button>
                </div>
            </form>

                <%-- 게시판 목록 --%>
            <div class="posts">
                <c:forEach var="p" items="${posts}">
                    <div class="post-item">
                        <div class="post-header">
                                <%-- DB 연동 전이라면 p.d_title 대신 그냥 p로 출력될 수 있음 --%>
                            <span class="post-user">${p}</span>
                            <span class="post-date">2026.04.02</span>
                        </div>
                        <div class="post-text">임시 데이터입니다. DB 연동 후 내용이 표시됩니다.</div>
                        <div class="post-btns">
                            <a href="#">삭제</a>
                        </div>
                    </div>
                </c:forEach>
            </div>
        </div>
    </c:if>
</div>
</body>
</html>