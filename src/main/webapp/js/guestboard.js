document.addEventListener('DOMContentLoaded', function() {
    flatpickr("#datePicker", {
        locale: "ko", // 한국어
        dateFormat: "Y-m-d",
        defaultDate: "${not empty selectedDate ? selectedDate : 'today'}",
        position: "below", // 클릭한 요소 아래에 표시
        disableMobile: "true",
        onChange: function(selectedDates, dateStr) {
            // 날짜 선택 시 자동으로 페이지 이동
            location.href = "board?date=" + dateStr;
        }
    });

    // span 클릭 시 달력이 뜨도록 연결
    document.getElementById('calendar-trigger').addEventListener('click', function() {
        document.getElementById('datePicker')._flatpickr.open();
    });
});