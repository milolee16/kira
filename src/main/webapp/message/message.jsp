<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="message-container" style="padding:20px; font-family:'Gaegu', cursive;">
    <h3 style="color:#a29bfe; border-bottom:2px solid #a29bfe; padding-bottom:10px; margin-top:0;">📫 나의 쪽지함</h3>

    <div class="msg-tabs" style="display:flex; gap:10px; margin-bottom:15px;">
        <button id="tab-received" onclick="loadMessages('received')" class="msg-tab-btn active" style="padding:5px 10px; border-radius:5px; border:1px solid #ccc; cursor:pointer;">받은 쪽지</button>
        <button id="tab-sent" onclick="loadMessages('sent')" class="msg-tab-btn" style="padding:5px 10px; border-radius:5px; border:1px solid #ccc; cursor:pointer;">보낸 쪽지</button>

        <button id="tab-write" onclick="openWriteMessage()" class="msg-tab-btn" style="padding:5px 15px; border-radius:5px; border:none; background:#ff7675; color:white; font-weight:bold; cursor:pointer; margin-left:auto;">쪽지 쓰기 ✍️</button>
    </div>

    <div id="message-list-area" style="background:white; border-radius:10px; padding:15px; min-height:300px; border:1px solid #f2c0bd; box-shadow: 2px 2px 5px rgba(0,0,0,0.02);">
    </div>

    <div id="message-write-area" style="display:none; background:white; border-radius:10px; padding:15px; min-height:300px; border:1px solid #a29bfe; box-shadow: 2px 2px 5px rgba(0,0,0,0.02);">
        <select id="msg-receiver-select" style="width:100%; padding:8px; margin-bottom:10px; border:1px solid #ccc; border-radius:5px; font-family:'Gaegu', cursive; font-size:16px;">
        </select>
        <textarea id="msg-content" rows="7" placeholder="따뜻한 쪽지를 남겨보세요..." style="width:100%; padding:10px; margin-bottom:10px; border:1px solid #ccc; border-radius:5px; resize:none; font-family:'Gaegu', cursive; font-size:16px; box-sizing:border-box;"></textarea>
        <div style="text-align:right;">
            <button onclick="sendMessage()" style="padding:8px 20px; background:#a29bfe; color:white; border:none; border-radius:5px; font-family:'Gaegu', cursive; font-size:16px; cursor:pointer;">전송하기 🚀</button>
        </div>
    </div>
</div>