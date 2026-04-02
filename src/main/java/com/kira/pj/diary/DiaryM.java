package com.kira.pj.diary;

import java.util.ArrayList;
import java.util.Calendar;
import javax.servlet.http.HttpServletRequest;

public class DiaryM {

    public static void getCalendar(HttpServletRequest req) {
        // 1. 날짜 계산기 꺼내기
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH);

        // 이번 달 1일로 설정
        cal.set(year, month, 1);
        int startDay = cal.get(Calendar.DAY_OF_WEEK); // 1일의 요일 (1~7)
        int lastDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);

        // 바구니에 담기 (JSP에서 쓸 변수들)
        req.setAttribute("startDay", startDay);
        req.setAttribute("lastDay", lastDay);
        req.setAttribute("curYear", year);
        req.setAttribute("curMonth", month + 1);

        // 2. 파라미터 확인 (날짜 d, 모드 mode)
        String d = req.getParameter("d");
        String mode = req.getParameter("mode");

        if ("write".equals(mode)) {
            // [글쓰기 화면]
            req.setAttribute("showMode", "write");
            req.setAttribute("selectedDay", d);
        } else if (d != null) {
            // [목록 보기 화면]
            req.setAttribute("showMode", "list");
            req.setAttribute("selectedDay", d);

            // 임시 데이터 (DB 연동 전까지 목록이 나오는지 확인용)
            ArrayList<String> posts = new ArrayList<>();
            posts.add(d + "일에 쓴 첫 번째 일기입니다.");
            posts.add(d + "일에 쓴 두 번째 일기입니다.");
            req.setAttribute("posts", posts);
        } else {
            // [기본 달력 화면]
            req.setAttribute("showMode", "calendar");
        }
    }
}