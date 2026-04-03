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


function editMode(pk, content,date) {
    const container = document.getElementById(`guestHi`);



    // 입력창과 버튼으로 교체
    container.innerHTML = `
        <input type="text" id="input_gc" value="${content}" class="edit-input">
        <a href="javascript:void(0);" onclick="location.href='updateGB?guest_board=${content}&gboard_pk=${pk}'" style="font-size:12px;">[확인]</a>
        <a href="javascript:void(0);" onclick="location.href='board?date=${date}'" style="font-size:12px;">[취소]</a>
    `;

    // 입력창에 바로 포커스 주기
    document.getElementById(`input_gc`).focus();
}

