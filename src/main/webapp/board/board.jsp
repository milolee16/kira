<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="gb-nb-body">
    <div class="gb-posts">
        <div class="gb-post-item">
            <div class="gb-post-header" style="position: relative;">
                <span class="gb-post-user">방명록</span>

                <jsp:useBean id="now" class="java.util.Date"/>
                <span id="calendar-trigger" class="gb-post-date" style="cursor:pointer; font-weight: bold;">
                  </span>

                <input type="text" id="datePicker" style="position:absolute; right:30px; opacity:0; width:1px;">
            </div>

            <div class="gb-post-text" id="gbPostText">
            </div>
        </div>
    </div>

    <form class="gb-write-form">
        <div class="gb-write-row">
            <input class="gb-write-input" autocomplete="off" placeholder="인사를 남겨주세요! ✏️" name="content" type="text"/>
            <button class="gb-write-btn">남기기</button>
        </div>
    </form>
</div>