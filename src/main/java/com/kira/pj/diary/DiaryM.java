package com.kira.pj.diary;

import java.util.ArrayList;
import java.util.Calendar;
import javax.servlet.http.HttpServletRequest;

public class DiaryM {

    public static void getCalendar(HttpServletRequest req) {
        // 1. 현재 날짜 구하기
        Calendar cal = Calendar.getInstance();

        // 2. 사용자가 보낸 년도(y), 월(m) 파라미터 받기
        String y = req.getParameter("y");
        String m = req.getParameter("m");

        // 파라미터가 없으면(null) 현재 날짜의 년/월을 사용
        int year = (y == null) ? cal.get(Calendar.YEAR) : Integer.parseInt(y);
        int month = (m == null) ? cal.get(Calendar.MONTH) : Integer.parseInt(m) - 1;

        // 3. 계산을 위해 Calendar 객체 설정
        cal.set(year, month, 1);

        // 다시 정확한 년/월을 뽑음 (13월 입력 시 다음 해 1월로 자동 계산됨)
        int curYear = cal.get(Calendar.YEAR);
        int curMonth = cal.get(Calendar.MONTH); // 0~11

        int startDay = cal.get(Calendar.DAY_OF_WEEK); // 1일의 요일 (1:일 ~ 7:토)
        int lastDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);

        // 4. JSP로 보낼 데이터 바구니(request)에 담기
        req.setAttribute("startDay", startDay);
        req.setAttribute("lastDay", lastDay);
        req.setAttribute("curYear", curYear);
        req.setAttribute("curMonth", curMonth + 1);

        // [이전/다음 달 화살표 링크용 데이터]
        req.setAttribute("prevYear", (curMonth == 0) ? curYear - 1 : curYear);
        req.setAttribute("prevMonth", (curMonth == 0) ? 12 : curMonth);
        req.setAttribute("nextYear", (curMonth == 11) ? curYear + 1 : curYear);
        req.setAttribute("nextMonth", (curMonth == 11) ? 1 : curMonth + 2);

        // 5. 모드 제어 (d: 날짜 클릭, mode: 글쓰기)
        String d = req.getParameter("d");
        String mode = req.getParameter("mode");

        if ("write".equals(mode)) {
            req.setAttribute("showMode", "write");
            req.setAttribute("selectedDay", d);
        } else if (d != null) {
            req.setAttribute("showMode", "list");
            req.setAttribute("selectedDay", d);

            // DB 대신 사용할 임시 데이터
            ArrayList<String> posts = new ArrayList<>();
            posts.add(curYear + "년 " + (curMonth+1) + "월 " + d + "일의 첫 기록");
            req.setAttribute("posts", posts);
        } else {
            req.setAttribute("showMode", "calendar");
        }
    }
}