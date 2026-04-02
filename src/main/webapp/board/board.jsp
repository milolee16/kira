<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html>
<head>
    <title>Board</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script src="https://npmcdn.com/flatpickr/dist/l10n/ko.js"></script>
</head>
<body>
<div class="nb-tabs">
    <div class="nb-tab ">홈</div>
    <div class="nb-tab">다이어리</div>
    <div class="nb-tab">사진첩</div>
    <div class="nb-tab active">방명록</div>
</div>

<div class="nb-body">


    <div class="posts">
        <div class="post-item">
            <div class="post-header" style="position: relative;"> <span class="post-user">방명록</span>
                <jsp:useBean id="now" class="java.util.Date"/>
                <span id="calendar-trigger" class="post-date" style="cursor:pointer; font-weight: bold;">
                  <c:choose>
                     <c:when test="${not empty selectedDate}">${selectedDate}</c:when>
                      <c:otherwise><fmt:formatDate value="${now}" pattern="yyyy-MM-dd"/></c:otherwise>
                 </c:choose>
                </span>

                <input type="text" id="datePicker" style="position:absolute; right:30px; opacity:0; width:1px;">
            </div>
            <div class="post-text">
                <c:forEach items="${guestBoards}" var="gb">

                    <div id="gbContent">
                            ${gb.guest_nick} : ${gb.board_content}
                    </div>
                    <div id="gbCreatedAt">
                            ${gb.created_at}
                    </div>
                </c:forEach>

            </div>
        </div>
    </div>

    <form action="board" method="post">
        <div class="write-row">
            <input class="write-input" autocomplete="off" placeholder="인사를 남겨주세요! ✏️" name="content" type="text"/>
            <button class="write-btn">남기기</button>
        </div>
    </form>


</div>

</body>
</html>