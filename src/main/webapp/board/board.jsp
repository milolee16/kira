<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>


    <title>Board</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script src="https://npmcdn.com/flatpickr/dist/l10n/ko.js"></script>

<div class="nb-tabs">
    <div class="nb-tab ">홈</div>
    <div class="nb-tab">다이어리</div>
    <div class="nb-tab">사진첩</div>
    <div class="nb-tab active">방명록</div>
</div>

<div class="gb-body">


    <div class="gb-posts">
        <div class="gb-post-item">
            <div class="gb-post-header" style="position: relative;"> <span class="gb-post-user">방명록</span>
                <jsp:useBean id="now" class="java.util.Date"/>
                <span id="calendar-trigger" class="gb-post-date" style="cursor:pointer; font-weight: bold;">
                  <c:choose>
                     <c:when test="${not empty selectedDate}">${selectedDate}</c:when>
                      <c:otherwise><fmt:formatDate value="${now}" pattern="yyyy-MM-dd"/></c:otherwise>
                 </c:choose>
                </span>

                <input type="text" id="datePicker" style="position:absolute; right:30px; opacity:0; width:1px;">
            </div>
            <div class="gb-post-text">
                <c:forEach items="${guestBoards}" var="gb">

                    <div id="gbContent">
                        <span class="gb-text-part">
                            ${gb.guest_nick} : <p id="guestHi">${gb.board_content}</p>
                        </span>
<%--                                <c:choose>--%>
<%--                                    <c:when test="${gb.guest_pk == user.pk} ">--%>
                                        <a href="javascript:void(0);" onclick="editMode( '${gb.gboard_pk}','${gb.board_content}','${gb.created_at}')" class="gbUp">📝</a>
<%--                                    </c:when>--%>
<%--                                    <c:when test="${gb.guest_pk == user.pk || gb.host_id == user.pk} ">--%>
                                        <a href="javascript:void(0);" onclick="location.href='delGB?gboard_pk=${gb.gboard_pk}'" class="gbDel">🗑️</a>
<%--                                    </c:when>--%>
<%--                                </c:choose>--%>
                    </div>
                    <div id="gbCreatedAt">
                            ${gb.created_at}
                    </div>
                </c:forEach>

            </div>
        </div>
    </div>

    <form action="board" method="post" class="gbHi">
        <div class="gb-write-row">
            <input class="gb-write-input" autocomplete="off" placeholder="인사를 남겨주세요! ✏️" name="content" type="text"/>
            <button class="gb-write-btn">남기기</button>
        </div>
    </form>


</div>

