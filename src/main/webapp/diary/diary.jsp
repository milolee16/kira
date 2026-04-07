<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="diary-container">
    <c:choose>
        <%-- [1] 글쓰기 버튼을 눌렀을 때 나오는 화면 --%>
        <c:when test="${showMode == 'write'}">
            <div class="diary-board">
                <div class="board-header">
                    <h3>✍️ ${curYear}.${curMonth}.${selectedDay} 일기 쓰기</h3>
                        <%-- 취소를 누르면 뒤로 튕기는 게 아니라 다시 비동기로 달력 화면을 부릅니다 --%>
                    <button onclick="loadDiary('diary?y=${curYear}&m=${curMonth}&d=${selectedDay}')" class="write-btn">취소</button>
                </div>

                <form id="diaryWriteForm" style="display: flex; flex-direction: column; gap: 15px;">
                    <input type="hidden" name="d_year" value="${curYear}">
                    <input type="hidden" name="d_month" value="${curMonth}">
                    <input type="hidden" name="d_date" value="${selectedDay}">

                    <input name="d_title" placeholder="제목을 입력하세요" style="width:100%; padding:15px; border:none; border-bottom:2px solid #f7cfcd; font-family:'Gaegu'; font-size:22px; outline:none; box-sizing: border-box;">

                        <%-- 💡 나중에 이 부분을 지우고 네이버 스마트 에디터를 넣으시면 됩니다! --%>
                    <textarea name="d_txt" placeholder="내용을 입력하세요..." style="width:100%; height:250px; border:none; padding:15px; font-family:'Gaegu'; font-size:20px; outline:none; resize:none; box-sizing: border-box;"></textarea>

                    <div style="text-align:right;">
                            <%-- ★ 핵심: type="button"으로 바꾸고, 자바스크립트 함수(submitDiaryForm)를 연결합니다! --%>
                        <button type="button" class="write-btn" onclick="submitDiaryForm()">등록하기</button>
                    </div>
                </form>
            </div>
        </c:when>

        <%-- [2] 기본 달력 화면 --%>
        <c:otherwise>
            <div class="calendar-header">
                    <%-- 화살표도 비동기 로드(loadDiary)로 이동하게 수정 --%>
                <a href="javascript:void(0);" onclick="loadDiary('diary?y=${prevYear}&m=${prevMonth}')" class="cal-btn">◀</a>
                <span class="cal-title">${curYear}. ${curMonth < 10 ? '0' : ''}${curMonth}</span>
                <a href="javascript:void(0);" onclick="loadDiary('diary?y=${nextYear}&m=${nextMonth}')" class="cal-btn">▶</a>
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
                                <%-- ★ 핵심: 날짜를 누르면 일반 이동이 아니라 비동기(fetch) 함수 실행! --%>
                            <a href="javascript:void(0);" onclick="loadDiary('diary?y=${curYear}&m=${curMonth}&d=${d}')">${d}</a>
                        </td>
                        <c:if test="${(d + startDay - 1) % 7 == 0 && d < lastDay}">
                    </tr><tr>
                        </c:if>
                        </c:forEach>
                    </tr>
                    </tbody>
                </table>
            </div>

            <%-- [3] 특정 날짜를 눌렀을 때만 나타나는 일기 목록 & 글쓰기 버튼 --%>
            <c:if test="${showMode == 'list'}">
                <div class="diary-board">
                    <div class="board-header">
                        <h3>📅 ${selectedDay}일의 일기</h3>
                            <%-- 글쓰기 버튼 누르면 글쓰기 모드로 비동기 전환 --%>
                        <button onclick="loadDiary('diary?y=${curYear}&m=${curMonth}&d=${selectedDay}&mode=write')" class="write-btn">일기쓰기</button>
                    </div>

                    <div class="posts">
                        <c:forEach var="p" items="${posts}">
                            <div class="post-item">
                                <div style="display:flex; justify-content:space-between; border-bottom:1px dashed #eee; padding-bottom:10px; margin-bottom:10px;">
                                        <%-- ★ ${p} 대신 진짜 제목을 꺼냅니다 --%>
                                    <span style="font-weight:bold; font-size:22px; color:#555;">${p.d_title}</span>
                                    <span style="font-size:14px; color:#bbb;">${curYear}.${curMonth}.${selectedDay}</span>
                                </div>
                                    <%-- ★ 가짜 내용 지우고 진짜 내용 출력! 줄바꿈 유지 CSS 추가 --%>
                                <div style="font-size:18px; color:#666; line-height:1.6; white-space: pre-wrap;">${p.d_txt}</div>
                            </div>
                        </c:forEach>
                    </div>
                </div>
            </c:if>
        </c:otherwise>
    </c:choose>
</div>