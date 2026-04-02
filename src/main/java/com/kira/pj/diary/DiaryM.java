package com.kira.pj.diary;

import java.util.ArrayList;
import java.util.Calendar;
import javax.servlet.http.HttpServletRequest;

public class DiaryM {

    public static void getCalendar(HttpServletRequest req) {
        // 1. 초기값 설정 (에러 방지용)
        Calendar cal = Calendar.getInstance();
        int curYear = cal.get(Calendar.YEAR);
        int curMonth = cal.get(Calendar.MONTH);
        String showMode = "calendar";
        String selectedDay = "";
        ArrayList<String> posts = new ArrayList<>();

        try {
            // 2. 파라미터 받기 (y:년, m:월, d:일, mode:상태)
            String y = req.getParameter("y");
            String m = req.getParameter("m");
            String d = req.getParameter("d");
            String mode = req.getParameter("mode");

            // 3. 년/월 계산 (파라미터가 있으면 해당 날짜로 설정)
            if (y != null && m != null) {
                curYear = Integer.parseInt(y);
                curMonth = Integer.parseInt(m) - 1;
            }
            cal.set(curYear, curMonth, 1);

            // Calendar가 자동 보정한 값을 다시 가져옴
            curYear = cal.get(Calendar.YEAR);
            curMonth = cal.get(Calendar.MONTH);

            int startDay = cal.get(Calendar.DAY_OF_WEEK); // 1일의 요일
            int lastDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);

            // 4. 화면 모드 결정
            if ("write".equals(mode)) {
                showMode = "write";
                selectedDay = (d != null) ? d : "";
            } else if (d != null) {
                showMode = "list";
                selectedDay = d;
                // 임시 데이터 추가
                posts.add(curYear + "년 " + (curMonth + 1) + "월 " + d + "일의 첫 번째 기록");
            }

            // 5. 모든 결과물을 바구니(request)에 담기
            req.setAttribute("startDay", startDay);
            req.setAttribute("lastDay", lastDay);
            req.setAttribute("curYear", curYear);
            req.setAttribute("curMonth", curMonth + 1);
            req.setAttribute("selectedDay", selectedDay);
            req.setAttribute("showMode", showMode);
            req.setAttribute("posts", posts);

            // 화살표 버튼 링크용 데이터
            req.setAttribute("prevYear", (curMonth == 0) ? curYear - 1 : curYear);
            req.setAttribute("prevMonth", (curMonth == 0) ? 12 : curMonth);
            req.setAttribute("nextYear", (curMonth == 11) ? curYear + 1 : curYear);
            req.setAttribute("nextMonth", (curMonth == 11) ? 1 : curMonth + 2);

        } catch (Exception e) {
            e.printStackTrace();
            req.setAttribute("showMode", "calendar");
            req.setAttribute("posts", new ArrayList<String>());
        }
    }
}