<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="v-page-container" style="padding: 10px 20px;">
    <form id="visitorForm" class="vWrite-row"
          style="display:flex; justify-content:center; align-items:center; gap:12px; margin-bottom:25px; padding: 15px; background: #fff; border-radius: 30px; border: 1px solid #f2c0bd;">
        <span style="font-family:'Nanum Pen Script', cursive; font-size:24px; color:#8a7a78;">🐾 발도장 꾹:</span>
        <input type="text" name="visitorName" id="visitorName" class="write-input" placeholder="닉네임"
               style="width:160px; border:none; border-bottom:2px solid #f7cfcd; outline:none; font-family:'Gaegu'; font-size:18px;" required>
        <button type="submit" class="write-btn"
                style="padding:5px 20px; background:linear-gradient(135deg, #fceae8, #f7cfcd); border:1px solid #f2c0bd; border-radius:20px; font-family:'Gaegu'; font-weight:bold; color:#8a7a78; cursor:pointer;">다녀감</button>
    </form>

    <div id="postsContainer" class="posts" style="min-height: 480px; display: flex; flex-direction: column; gap: 12px;">
    </div>

    <div id="pagingContainer" class="paging-box" style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding:0 10px;">
    </div>
</div>

<script src="/js/visitor.js">

</script>
