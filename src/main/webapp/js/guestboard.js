document.addEventListener('DOMContentLoaded', function () {
    flatpickr("#datePicker", {
        locale: "ko", // 한국어
        dateFormat: "Y-m-d",
        defaultDate: "${not empty selectedDate ? selectedDate : 'today'}",
        position: "below", // 클릭한 요소 아래에 표시
        disableMobile: "true",
        onChange: function (selectedDates, dateStr) {
            // 날짜 선택 시 자동으로 페이지 이동
            location.href = "board?date=" + dateStr;
        }
    });

    // span 클릭 시 달력이 뜨도록 연결
    document.getElementById('calendar-trigger').addEventListener('click', function () {
        document.getElementById('datePicker')._flatpickr.open();
    });
});


function editMode(pk, content) {
    const container = document.getElementById(`gbContent_${pk}`);

    // 원래 내용을 백업해둡니다 (취소 버튼용)
    const originalHTML = container.innerHTML;

    // 입력창과 버튼으로 교체
    container.innerHTML = `
        <input type="text" id="input_${pk}" value="${content}" class="edit-input">
        <a href="javascript:void(0);" onclick="updateDone('${pk}')" style="font-size:12px;">[저장]</a>
        <a href="javascript:void(0);" onclick="cancelEdit('${pk}', \`${originalHTML}\`)" style="font-size:12px;">[취소]</a>
    `;

    // 입력창에 바로 포커스 주기
    document.getElementById(`input_${pk}`).focus();
}

// 취소 시 원래 HTML로 되돌리기
function cancelEdit(pk, html) {
    document.getElementById(`gbContent_${pk}`).innerHTML = html;
}

// 실제 DB 업데이트 실행
function updateDone(pk) {
    const newContent = document.getElementById(`input_${pk}`).value;

    if (newContent.trim() === "") {
        alert("내용을 입력해주세요!");
        return;
    }

    // 서버로 전송 (기존 location.href 방식 유지)
    location.href = `updateGB?guest_board=${encodeURIComponent(newContent)}&gboard_pk=${pk}`;
}