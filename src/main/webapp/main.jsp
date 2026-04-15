<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html>
<head>
    <title>test-title</title>
</head>
<body>
<div class="nb-body home-wrapper">

    <div class="home-daemoon-wrapper">
        <div class="home-daemoon" id="home-daemoon">
            <c:choose>
                <c:when test="${not empty photoList and not empty photoList[0].imgName}">
                    <div class="daemoon-photo-wall">

                        <!-- 뒤쪽 사진 왼쪽 -->
                        <div class="daemoon-photo-frame daemoon-frame-left">
                            <div class="daemoon-img-wrapper">
                                <img src="${not empty photoList[2].imgName ? photoList[2].imgName : ' '}" alt="">
                            </div>
                            <span class="daemoon-title">🌸</span>
                        </div>

                        <!-- 메인 사진 가운데 -->
                        <div class="daemoon-photo-frame daemoon-frame-main">
                            <div class="daemoon-tape daemoon-tape-left"></div>
                            <div class="daemoon-tape daemoon-tape-right"></div>
                            <div class="daemoon-img-wrapper">
                                <img src="${photoList[0].imgName}" alt="대문 사진">
                            </div>
                            <span class="daemoon-title">✨ 최신사진 ✨</span>
                        </div>

                        <!-- 뒤쪽 사진 오른쪽 -->
                        <div class="daemoon-photo-frame daemoon-frame-right">
                            <div class="daemoon-img-wrapper">
                                <img src="${not empty photoList[1].imgName ? photoList[1].imgName : ' '}" alt="">
                            </div>
                            <span class="daemoon-title">🎀</span>
                        </div>

                    </div>
                </c:when>
                <c:otherwise>
                    <span style="color:#bbb; font-size:13px;">등록된 대문사진이 없습니다. 📷</span>
                </c:otherwise>
            </c:choose>
        </div>
    </div>



<div class="home-bottom-row">

    <div class="home-updates">
        <div class="update-box">
            <h4 class="update-title diary-title">📝 최근 다이어리</h4>
            <c:choose>
                <c:when test="${not empty recentDiaryTitle}">
                    <%-- ★ [핵심] p태그를 지우고 a태그로 덮어쓰기! (클릭 시 이동 기능) ★ --%>
                    <a href="javascript:void(0);"
                       onclick="loadDiary('diary-detail?no=${recentDiaryNo}&y=${recentDiaryY}&m=${recentDiaryM}&d=${recentDiaryD}&memberId=${pageOwnerId}')"
                       class="update-text"
                       style="text-decoration: none; color: inherit; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color 0.2s;"
                       onmouseover="this.style.color='#ff8e8b'"
                       onmouseout="this.style.color='inherit'">
                            ${recentDiaryTitle}
                    </a>
                </c:when>
                <c:otherwise>
                    <p class="update-text" style="color: #bbb;">아직 작성된 일기가 없어요. 🍃</p>
                </c:otherwise>
            </c:choose>
        </div>
        <div class="update-box">
            <h4 class="update-title gb-title">🐾 최근 방명록</h4>
            <p class="update-text">${searchMain.latest_gb_content}</p>
        </div>
    </div>

    <div class="home-qna">
        <h3 class="qna-title">🎲 오늘의 문답</h3>
        <p class="qna-question">Q. ${dailyQna.question}</p>

        <%-- 🌟 핵심: 현재 페이지 주인이 '나'인지 확인하는 변수 만들기 --%>
        <c:set var="isMyHome" value="${pageOwnerId == sessionScope.loginUserId}" />

        <c:choose>
            <%-- 1. 아직 답변을 안 적은 상태 --%>
            <c:when test="${empty dailyQna.answer}">
                <c:choose>
                    <%-- 1-1. 내 홈피일 때: 입력창 띄우기 --%>
                    <c:when test="${isMyHome}">
                        <div class="qna-input-area" id="qna-form">
                            <input type="hidden"  autocomplete="off" id="qna-id" value="${dailyQna.q_id}">
                            <textarea id="qna-answer" class="qna-textarea" placeholder="오늘의 답변을 남겨보세요! ✏️"></textarea>

                            <div class="qna-btn-group">
                                <button onclick="saveQnA()" class="qna-submit-btn">확인</button>
                            </div>
                        </div>
                    </c:when>
                    <%-- 1-2. 남의 홈피일 때: 안 적었다는 메시지만 띄우기 --%>
                    <c:otherwise>
                        <div class="qna-answered-area">
                            <div class="qna-answered-box" style="text-align: center; color: #999; padding: 20px 0;">
                                주인장이 아직 오늘의 문답을 작성하지 않았어요. 🐾
                            </div>
                        </div>
                    </c:otherwise>
                </c:choose>
            </c:when>

            <%-- 2. 이미 답변을 적은 상태 --%>
            <c:otherwise>
                <%-- 보기 모드 (공통으로 다 보여줌) --%>
                <div id="qna-view-mode" class="qna-answered-area">
                    <div class="qna-answered-box">
                        <span id="qna-answer-text" class="qna-answer-text">A. ${dailyQna.answer}</span>
                    </div>

                        <%-- 🌟 내 홈피일 때만 [수정 / 다이어리 추가] 버튼이 보임! --%>
                    <c:if test="${isMyHome}">
                        <div class="qna-btn-group">
                            <button onclick="toggleEditQnA()" class="qna-cancel-btn">수정</button>
                            <button onclick="addQnAToDiary()" class="qna-submit-btn">다이어리에 추가 ✍️</button>
                        </div>
                    </c:if>
                </div>

                <%-- 수정 모드 (애초에 내 홈피일 때만 이 영역을 그려줌) --%>
                <c:if test="${isMyHome}">
                    <div id="qna-edit-mode" class="qna-input-area qna-hidden">
                        <input type="hidden" id="qna-id" value="${dailyQna.q_id}">
                        <textarea id="qna-edit-answer" class="qna-textarea">${dailyQna.answer}</textarea>

                        <div class="qna-btn-group">
                            <button onclick="toggleEditQnA()" class="qna-cancel-btn">취소</button>
                            <button onclick="saveQnA('edit')" class="qna-submit-btn">확인</button>
                        </div>
                    </div>
                </c:if>
            </c:otherwise>
        </c:choose>
    </div>

</div>

</div>

</div>

</body>
</html>
