<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
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
                    <h3>✍️ ${selectedDay}일 일기 쓰기</h3>
                    <button onclick="location.href='diary?d=${selectedDay}'" class="write-btn">취소</button>
                </div>

                <form action="diary.write" method="post" class="write-form-full">
                    <input type="hidden" name="d_date" value="${selectedDay}">
                    <input name="d_title" placeholder="제목을 입력하세요" class="write-input-title" required>
                    <textarea id="editor" name="d_txt" class="write-input-content" placeholder="내용을 입력하세요..." required></textarea>
                    <div class="write-footer">
                        <button class="write-btn">등록하기</button>
                    </div>
                </form>
            </div>
        </c:when>

        <%-- [B] 목록 보기 및 [C] 기본 달력 모드 (달력이 공통으로 들어감) --%>
        <c:otherwise>
            <div class="calendar-wrap">
                <table class="calendar-table">
                    <thead>
                    <tr>
                        <th class="sun">SUN</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th class="sat">SAT</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                            <%-- 에러 방지: startDay가 1(일요일)보다 클 때만 빈칸 출력 --%>
                        <c:if test="${startDay > 1}">
                            <c:forEach var="i" begin="1" end="${startDay - 1}">
                                <td></td>
                            </c:forEach>
                        </c:if>

                        <c:forEach var="d" begin="1" end="${lastDay}">
                        <td class="${(d + startDay - 1) % 7 == 1 ? 'sun' : ((d + startDay - 1) % 7 == 0 ? 'sat' : '')}">
                            <a href="diary?d=${d}">${d}</a>
                        </td>
                        <c:if test="${(d + startDay - 1) % 7 == 0 && d < lastDay}">
                    </tr><tr>
                        </c:if>
                        </c:forEach>
                    </tr>
                    </tbody>
                </table>
            </div>

            <%-- 목록 보기일 때만 게시판 하단에 추가 --%>
            <c:if test="${showMode == 'list'}">
                <hr class="diary-hr">
                <div class="diary-board">
                    <div class="board-header">
                        <h3>📅 ${selectedDay}일의 일기</h3>
                        <button onclick="location.href='diary?d=${selectedDay}&mode=write'" class="write-btn">일기쓰기</button>
                    </div>
                    <div class="posts">
                        <c:forEach var="p" items="${posts}">
                            <div class="post-item">
                                <div class="post-header">
                                    <span class="post-user">${p}</span>
                                    <span class="post-date">2026.04.02</span>
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
</div>
</body>
</html>