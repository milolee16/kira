package com.kira.pj.diary;

import java.util.Calendar;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;

public class DiaryM {

    public static void getCalendar(HttpServletRequest req) {
        // 1. 기본 달력 계산 (생략 - 기존 코드 유지)
        // ... startDay, lastDay 세팅 ...

        String d = req.getParameter("d");      // 날짜
        String mode = req.getParameter("mode"); // 'write' 인지 확인

        if ("write".equals(mode)) {
            // [글쓰기 모드]
            req.setAttribute("showMode", "write");
            req.setAttribute("selectedDay", d); // 어느 날짜에 쓰는지 알아야 함
        } else if (d != null) {
            // [목록 보기 모드]
            req.setAttribute("showMode", "list");
            req.setAttribute("selectedDay", d);

            // 임시 데이터
            ArrayList<String> posts = new ArrayList<>();
            posts.add(d + "일의 추억...");
            req.setAttribute("posts", posts);
        } else {
            // [기본 달력 모드]
            req.setAttribute("showMode", "calendar");
        }
    }
}