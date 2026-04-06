<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<div class="v-page-container" style="padding: 10px 20px;">
    <form id="v-visitor-form" class="v-write-row"
          style="display:flex; justify-content:center; align-items:center; gap:12px; margin-bottom:25px; padding: 15px; background: #fff; border-radius: 30px; border: 1px solid #f2c0bd;">
        <span style="font-family:'Nanum Pen Script', cursive; font-size:24px; color:#8a7a78;">🐾 발도장 꾹:</span>
        <input type="text" name="visitorName" id="v-visitor-name" class="v-write-input" placeholder="닉네임"
               style="width:160px; border:none; border-bottom:2px solid #f7cfcd; outline:none; font-family:'Gaegu'; font-size:18px;"
               required>
        <button type="submit" class="v-write-btn"
                style="padding:5px 20px; background:linear-gradient(135deg, #fceae8, #f7cfcd); border:1px solid #f2c0bd; border-radius:20px; font-family:'Gaegu'; font-weight:bold; color:#8a7a78; cursor:pointer;">
            다녀감
        </button>
    </form>

    <div id="v-posts-container" class="v-posts" style="min-height: 480px; display: flex; flex-direction: column; gap: 12px;">
    </div>

    <div id="v-paging-container" class="v-paging-box"
         style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding:0 10px;">
    </div>
</div>

<div id="v-custom-modal" class="v-modal-overlay">
    <div class="v-modal-content">
        <div class="v-modal-header">
            <h3>📢 알림 💌</h3>
            <span class="v-close-modal" onclick="closeCustomAlert()">&times;</span>
        </div>
        <div class="v-modal-body">
            <p id="v-custom-alert-message">여기에 메시지가 들어갑니다.</p>
        </div>
        <div class="v-modal-footer">
            <button class="v-modal-btn" onclick="closeCustomAlert()">확인</button>
        </div>
    </div>
</div>