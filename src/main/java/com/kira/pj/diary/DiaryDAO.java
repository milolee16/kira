package com.kira.pj.diary;

import com.kira.pj.main.DBManager;

import com.google.gson.Gson;
import java.util.Map;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Calendar;
import javax.servlet.http.HttpServletRequest;

public class DiaryDAO {


    public static final DiaryDAO DDAO = new DiaryDAO();
    public Connection con = null;
    private DiaryDAO() {

    }
    private  ArrayList<DiaryDTO> diaries;

    public void getCalendar(HttpServletRequest req) {

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
            req.setAttribute("showMode", "write"); // 글쓰기 모드
            req.setAttribute("selectedDay", d);
        } else if (d != null) {
            req.setAttribute("showMode", "list");
            req.setAttribute("selectedDay", d);

            // --- 가짜 데이터 지우고 진짜 DB 연동 시작 ---
            Connection con = null;
            PreparedStatement pstmt = null;
            ResultSet rs = null;
            ArrayList<DiaryDTO> posts = new ArrayList<>();

            try {
                con = DBManager.connect();

                // 클릭한 날짜를 DB 날짜 형식(YYYY-MM-DD)에 맞게 조립
                String formattedMonth = String.format("%02d", curMonth + 1);
                String formattedDay = String.format("%02d", Integer.parseInt(d));
                String fullDate = curYear + "-" + formattedMonth + "-" + formattedDay;

                // TO_CHAR를 써서 해당 날짜에 쓴 일기만 최신순(d_no DESC)으로 가져옵니다!
                String sql = "SELECT * FROM diary_test WHERE TO_CHAR(d_date, 'YYYY-MM-DD') = ? ORDER BY d_no DESC";
                pstmt = con.prepareStatement(sql);
                pstmt.setString(1, fullDate);
                rs = pstmt.executeQuery();

                while (rs.next()) {
                    DiaryDTO dto = new DiaryDTO();
                    dto.setD_no(rs.getInt("d_no"));
                    dto.setD_title(rs.getString("d_title"));
                    dto.setD_txt(rs.getString("d_txt"));
                    posts.add(dto);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                DBManager.close(con, pstmt, rs);
            }

            // 완성된 진짜 일기 리스트를 바구니에 담아서 JSP로 보냄!
            req.setAttribute("posts", posts);

        } else {
            req.setAttribute("showMode", "calendar");
        }
    }
    // 전체조회
    public void selectAllDiary(HttpServletRequest req) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        String sql = "SELECT * FROM diary_test ORDER BY d_date DESC";
        ArrayList<DiaryDTO> diaries = new ArrayList<>();
        try {
            con = DBManager.connect();
            pstmt = con.prepareStatement(sql);
            rs = pstmt.executeQuery();

            // 자바에서 날짜를 예쁘게 바꿔줄 도구 준비
            java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");

            while (rs.next()) {
                DiaryDTO dto = new DiaryDTO();
                dto.setD_no(rs.getInt("d_no"));
                dto.setD_id(rs.getString("d_id"));

                // ★ 핵심: DB에서 원본 DATE를 꺼낸 다음, 자바가 문자열로 예쁘게 바꿈!
                java.sql.Date dbDate = rs.getDate("d_date");
                String formattedDate = sdf.format(dbDate);
                dto.setD_date(formattedDate); // DTO에는 String으로 쏙 들어감

                dto.setD_title(rs.getString("d_title"));
                dto.setD_txt(rs.getString("d_txt"));

                diaries.add(dto);
            }
            System.out.println(diaries);
            req.setAttribute("diaries", diaries);


        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, pstmt, rs);
        }
    }

        // 일기 등록 기능 (Create)
        public void insertDiary(HttpServletRequest req) {
            Connection con = null;
            PreparedStatement pstmt = null;

            try {
                con = DBManager.connect();
                String sql = "INSERT INTO diary_test VALUES (diary_test_seq.nextval, ?, TO_DATE(?, 'YYYY-MM-DD'), ?, ?, SYSDATE)";
                pstmt = con.prepareStatement(sql);

                // 일반 파라미터로 데이터 쏙쏙 꺼내기
                String year = req.getParameter("d_year");
                String month = req.getParameter("d_month");
                String date = req.getParameter("d_date");
                String title = req.getParameter("d_title");
                String txt = req.getParameter("d_txt");

                String id = "pass02"; // 임시 아이디

                // 날짜 예쁘게 합치기
                String formattedMonth = String.format("%02d", Integer.parseInt(month));
                String formattedDay = String.format("%02d", Integer.parseInt(date));
                String fullDate = year + "-" + formattedMonth + "-" + formattedDay;

                pstmt.setString(1, id);
                pstmt.setString(2, fullDate);
                pstmt.setString(3, title);
                pstmt.setString(4, txt);

                if (pstmt.executeUpdate() == 1) {
                    System.out.println("일기 등록 완벽 성공! ദ്ദി(⩌ᴗ⩌ )");
                }

            } catch (Exception e) {
                System.out.println("일기 등록 실패 ㅠㅠ");
                e.printStackTrace();
            } finally {
                DBManager.close(con, pstmt, null);
            }


        }
    }










