<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="diary-container">
    <c:choose>
        <%-- [1] 글쓰기 모드 화면 --%>
        <c:when test="${showMode == 'write'}">
            <div class="diary-board">
                <div class="board-header">
                    <h3>✍️ ${curYear}.${curMonth}.${selectedDay} 일기 쓰기</h3>
                    <button onclick="loadDiary('diary?y=${curYear}&m=${curMonth}&d=${selectedDay}')" class="write-btn">
                        취소
                    </button>
                </div>

                <form id="diaryWriteForm" style="display: flex; flex-direction: column; gap: 15px;">
                    <input type="hidden" name="d_year" value="${curYear}">
                    <input type="hidden" name="d_month" value="${curMonth}">
                    <input type="hidden" name="d_date" value="${selectedDay}">

                    <input name="d_title" placeholder="제목을 입력하세요"
                           style="width:100%; padding:15px; border:none; border-bottom:2px solid #f7cfcd; font-family:'Gaegu'; font-size:22px; outline:none; box-sizing: border-box;">
                    <div style="padding: 0 15px;">
                        <span style="font-family:'Gaegu'; font-size:20px; color:#555; margin-right:10px;">공개 설정:</span>
                        <select name="d_visibility"
                                style="padding:5px; border:1px solid #f7cfcd; border-radius:5px; font-family:'Gaegu'; font-size:18px; outline:none;">
                            <option value="2" selected>🌍 전체 공개</option>
                            <option value="1">👥 친구 공개</option>
                            <option value="0">🔒 나만 보기</option>
                        </select>
                    </div>
                    <textarea name="d_txt" placeholder="내용을 입력하세요..."
                              style="width:100%; height:250px; border:none; padding:15px; font-family:'Gaegu'; font-size:20px; outline:none; resize:none; box-sizing: border-box;"></textarea>

                    <div style="text-align:right;">
                        <button type="button" class="write-btn" onclick="submitDiaryForm()">등록하기</button>
                    </div>
                </form>
            </div>
        </c:when>

        <%-- ★ [2] 수정 모드 화면 (새로 추가됨!) ★ --%>
        <c:when test="${showMode == 'update'}">
            <div class="diary-board">
                <div class="board-header">
                    <h3>📝 일기 수정하기</h3>
                        <%-- 취소를 누르면 다시 원래 보던 '상세 보기' 화면으로 돌아갑니다 --%>
                    <button onclick="loadDiary('diary-detail?no=${diary.no}&y=${curYear}&m=${curMonth}&d=${selectedDay}')"
                            class="write-btn">취소
                    </button>
                </div>

                <form id="diaryUpdateForm" style="display: flex; flex-direction: column; gap: 15px;">
                        <%-- 어떤 글을 수정할지 알아야 하니까 글 번호(no)를 숨겨둡니다 --%>
                    <input type="hidden" name="no" value="${diary.no}">
                    <input type="hidden" name="d_year" value="${curYear}">
                    <input type="hidden" name="d_month" value="${curMonth}">
                    <input type="hidden" name="d_date" value="${selectedDay}">

                        <%-- 기존 제목이 미리 적혀있게 value 속성 추가 --%>
                    <input name="d_title" value="${diary.title}" placeholder="제목을 입력하세요"
                           style="width:100%; padding:15px; border:none; border-bottom:2px solid #f7cfcd; font-family:'Gaegu'; font-size:22px; outline:none; box-sizing: border-box;">
                    <div style="padding: 0 15px;">
                        <span style="font-family:'Gaegu'; font-size:20px; color:#555; margin-right:10px;">공개 설정:</span>
                        <select name="d_visibility"
                                style="padding:5px; border:1px solid #f7cfcd; border-radius:5px; font-family:'Gaegu'; font-size:18px; outline:none;">
                            <option value="2" ${diary.visibility == 2 ? 'selected' : ''}>🌍 전체 공개</option>
                            <option value="1" ${diary.visibility == 1 ? 'selected' : ''}>👥 친구 공개</option>
                            <option value="0" ${diary.visibility == 0 ? 'selected' : ''}>🔒 나만 보기</option>
                        </select>
                    </div>
                        <%-- 기존 내용이 미리 적혀있게 태그 사이에 내용 추가 --%>
                    <textarea name="d_txt" placeholder="내용을 입력하세요..."
                              style="width:100%; height:250px; border:none; padding:15px; font-family:'Gaegu'; font-size:20px; outline:none; resize:none; box-sizing: border-box;">${diary.txt}</textarea>

                    <div style="text-align:right;">
                            <%-- 자바스크립트의 수정 전용 함수(updateDiaryForm) 실행! --%>
                        <button type="button" class="write-btn" onclick="updateDiaryForm()">수정완료</button>
                    </div>
                </form>
            </div>
        </c:when>

        <%-- [3] 상세 보기 모드 화면 --%>
        <c:when test="${showMode == 'detail'}">
            <div class="diary-board">
                <div class="board-header">
                    <h3>👀 ${curYear}.${curMonth}.${selectedDay} 일기</h3>
                    <button onclick="loadDiary('diary?y=${curYear}&m=${curMonth}&d=${selectedDay}')" class="write-btn">
                        목록으로
                    </button>
                </div>

                <div style="background:#fff; padding:20px; border-radius:10px; border:1px solid #f7cfcd;">
                    <div style="font-size:24px; font-weight:bold; color:#333; margin-bottom:20px; border-bottom:2px solid #f7cfcd; padding-bottom:10px;">
                            ${diary.title}
                    </div>
                    <div style="font-size:18px; color:#555; line-height:1.8; min-height:200px; white-space: pre-wrap;">${diary.txt}</div>

                    <div style="text-align:right; margin-top:20px;">
                            <%-- ★ 진짜 수정 컨트롤러로 이동하는 버튼으로 교체 완료! ★ --%>
                            <%-- ★ 글 작성자 아이디 == 로그인한 아이디가 같을 때만 버튼 보이기! ★ --%>
                        <c:if test="${diary.id == sessionScope.loginUserId}">
                            <button onclick="loadDiary('diary-update?no=${diary.no}&y=${curYear}&m=${curMonth}&d=${selectedDay}')"
                                    class="write-btn" style="background:#ddd; color:#333;">수정
                            </button>
                            <button onclick="if(confirm('정말 이 일기를 삭제할까요? 🗑️')) loadDiary('diary-delete?no=${diary.no}&y=${curYear}&m=${curMonth}')"
                                    class="write-btn" style="background:#ff9999;">삭제
                            </button>
                        </c:if>
                    </div>
                </div>
            </div>
        </c:when>

        <%-- [4] 기본 달력 & 특정 날짜 일기 목록 화면 --%>
        <c:otherwise>
            <div class="calendar-header">
                <a href="javascript:void(0);" onclick="loadDiary('diary?y=${prevYear}&m=${prevMonth}')" class="cal-btn">◀</a>
                <span class="cal-title">${curYear}. ${curMonth < 10 ? '0' : ''}${curMonth}</span>
                <a href="javascript:void(0);" onclick="loadDiary('diary?y=${nextYear}&m=${nextMonth}')" class="cal-btn">▶</a>
            </div>

            <div class="calendar-wrap">
                <table class="calendar-table">
                    <thead>
                    <tr>
                        <th class="sun">SUN</th>
                        <th>MON</th>
                        <th>TUE</th>
                        <th>WED</th>
                        <th>THU</th>
                        <th>FRI</th>
                        <th class="sat">SAT</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <c:if test="${startDay > 1}">
                            <c:forEach var="i" begin="1" end="${startDay - 1}">
                                <td></td>
                            </c:forEach>
                        </c:if>

                        <c:forEach var="d" begin="1" end="${lastDay}">
                        <td class="${(d + startDay - 1) % 7 == 1 ? 'sun' : ((d + startDay - 1) % 7 == 0 ? 'sat' : '')}">
                            <a href="javascript:void(0);"
                               onclick="loadDiary('diary?y=${curYear}&m=${curMonth}&d=${d}')">${d}</a>
                        </td>
                        <c:if test="${(d + startDay - 1) % 7 == 0 && d < lastDay}">
                    </tr>
                    <tr>
                        </c:if>
                        </c:forEach>
                    </tr>
                    </tbody>
                </table>
            </div>

            <%-- 특정 날짜를 눌렀을 때만 나타나는 일기 목록 --%>
            <c:if test="${showMode == 'list'}">
                <div class="diary-board">
                    <div class="board-header">
                        <h3>📅 ${selectedDay}일의 일기</h3>
                        <button onclick="loadDiary('diary?y=${curYear}&m=${curMonth}&d=${selectedDay}&mode=write')"
                                class="write-btn">일기쓰기
                        </button>
                    </div>

                    <div class="posts">
                        <c:forEach var="p" items="${posts}">
                            <div class="post-item"
                                 onclick="loadDiary('diary-detail?no=${p.no}&y=${curYear}&m=${curMonth}&d=${selectedDay}')"
                                 style="cursor: pointer; transition: 0.2s;">

                                <div style="display:flex; justify-content:space-between; border-bottom:1px dashed #eee; padding-bottom:10px; margin-bottom:10px;">
                                    <span style="font-weight:bold; font-size:22px; color:#555;">${p.title}</span>
                                    <span style="font-size:14px; color:#bbb;">${curYear}.${curMonth}.${selectedDay}</span>
                                </div>

                                <div style="font-size:18px; color:#666; line-height:1.6; white-space: pre-wrap;">${p.txt}</div>

                            </div>
                        </c:forEach>
                    </div>
                </div>
            </c:if>
        </c:otherwise>
    </c:choose>
</div>