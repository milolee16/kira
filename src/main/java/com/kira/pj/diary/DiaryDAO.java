package com.kira.pj.diary;

import com.kira.pj.main.DBManager;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Calendar;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class DiaryDAO {

    public static final DiaryDAO DDAO = new DiaryDAO();
    public Connection con = null;

    private DiaryDAO() {
    }

    public void getCalendar(HttpServletRequest req) {

        Calendar cal = Calendar.getInstance();

        String y = req.getParameter("y");
        String m = req.getParameter("m");

        int year = (y == null) ? cal.get(Calendar.YEAR) : Integer.parseInt(y);
        int month = (m == null) ? cal.get(Calendar.MONTH) : Integer.parseInt(m) - 1;

        cal.set(year, month, 1);

        int curYear = cal.get(Calendar.YEAR);
        int curMonth = cal.get(Calendar.MONTH);

        int startDay = cal.get(Calendar.DAY_OF_WEEK);
        int lastDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);

        req.setAttribute("startDay", startDay);
        req.setAttribute("lastDay", lastDay);
        req.setAttribute("curYear", curYear);
        req.setAttribute("curMonth", curMonth + 1);

        req.setAttribute("prevYear", (curMonth == 0) ? curYear - 1 : curYear);
        req.setAttribute("prevMonth", (curMonth == 0) ? 12 : curMonth);
        req.setAttribute("nextYear", (curMonth == 11) ? curYear + 1 : curYear);
        req.setAttribute("nextMonth", (curMonth == 11) ? 1 : curMonth + 2);

        String d = req.getParameter("d");
        String mode = req.getParameter("mode");

        if ("write".equals(mode)) {
            req.setAttribute("showMode", "write");
            req.setAttribute("selectedDay", d);
        } else if (d != null) {
            req.setAttribute("showMode", "list");
            req.setAttribute("selectedDay", d);

            Connection con = null;
            PreparedStatement pstmt = null;
            ResultSet rs = null;
            ArrayList<DiaryDTO> posts = new ArrayList<>();

            try {
                con = DBManager.connect();

                // ★ 세션에서 진짜 로그인한 아이디 꺼내기!
                HttpSession session = req.getSession();
                String loginId = (String) session.getAttribute("loginUserId");

                String formattedMonth = String.format("%02d", curMonth + 1);
                String formattedDay = String.format("%02d", Integer.parseInt(d));
                String fullDate = curYear + "-" + formattedMonth + "-" + formattedDay;

                // ★ 로그인한 사람(d_id)이 쓴 글만 가져오도록 쿼리 수정!
                String sql = "SELECT * FROM diary_test WHERE TO_CHAR(d_date, 'YYYY-MM-DD') = ? AND d_id = ? ORDER BY d_no DESC";
                pstmt = con.prepareStatement(sql);
                pstmt.setString(1, fullDate);
                pstmt.setString(2, loginId); // 👈 내 아이디만!

                rs = pstmt.executeQuery();

                while (rs.next()) {
                    DiaryDTO dto = new DiaryDTO();
                    dto.setNo(rs.getInt("d_no"));
                    dto.setTitle(rs.getString("d_title"));
                    dto.setTxt(rs.getString("d_txt"));
                    dto.setVisibility(rs.getInt("d_visibility"));
                    posts.add(dto);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                DBManager.close(con, pstmt, rs);
            }
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

        try {
            con = DBManager.connect();

            // ★ 전체 조회에서도 내 글만 보이게 쿼리 수정!
            HttpSession session = req.getSession();
            String loginId = (String) session.getAttribute("loginUserId");

            String sql = "SELECT * FROM diary_test WHERE d_id = ? ORDER BY d_date DESC";
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, loginId); // 👈 내 아이디만!

            rs = pstmt.executeQuery();
            ArrayList<DiaryDTO> diaries = new ArrayList<>();

            while (rs.next()) {
                DiaryDTO dto = new DiaryDTO();
                dto.setNo(rs.getInt("d_no"));
                dto.setId(rs.getString("d_id"));
                dto.setDate(rs.getDate("d_date"));
                dto.setTitle(rs.getString("d_title"));
                dto.setTxt(rs.getString("d_txt"));
                dto.setVisibility(rs.getInt("d_visibility"));

                diaries.add(dto);
            }
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
            String sql = "INSERT INTO diary_test VALUES (diary_test_seq.nextval, ?, TO_DATE(?, 'YYYY-MM-DD'), ?, ?, SYSDATE, ?)";
            pstmt = con.prepareStatement(sql);

            String year = req.getParameter("d_year");
            String month = req.getParameter("d_month");
            String date = req.getParameter("d_date");
            String title = req.getParameter("d_title");
            String txt = req.getParameter("d_txt");
            String visibility = req.getParameter("d_visibility");

            // ★ 임시 아이디 지우고, 세션에서 진짜 아이디 꺼내기!
            HttpSession session = req.getSession();
            String id = (String) session.getAttribute("loginUserId");

            // 로그인이 안 되어있으면 글 못 쓰게 막기
            if (id == null || id.isEmpty()) {
                System.out.println("로그인이 필요합니다!");
                return;
            }

            String formattedMonth = String.format("%02d", Integer.parseInt(month));
            String formattedDay = String.format("%02d", Integer.parseInt(date));
            String fullDate = year + "-" + formattedMonth + "-" + formattedDay;

            pstmt.setString(1, id); // 👈 진짜 내 아이디 등록!
            pstmt.setString(2, fullDate);
            pstmt.setString(3, title);
            pstmt.setString(4, txt);

            int visValue = (visibility == null || visibility.equals("")) ? 2 : Integer.parseInt(visibility);
            pstmt.setInt(5, visValue);

            if (pstmt.executeUpdate() == 1) {
                System.out.println("일기 등록 완벽 성공! (유저 연동 완료)");
            }

        } catch (Exception e) {
            System.out.println("일기 등록 실패 ㅠㅠ");
            e.printStackTrace();
        } finally {
            DBManager.close(con, pstmt, null);
        }
    }

    // 상세보기 기능
    public void getDiaryDetail(HttpServletRequest req) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            con = DBManager.connect();

            String no = req.getParameter("no");
            String y = req.getParameter("y");
            String m = req.getParameter("m");
            String d = req.getParameter("d");

            String sql = "SELECT * FROM diary_test WHERE d_no = ?";
            pstmt = con.prepareStatement(sql);
            pstmt.setInt(1, Integer.parseInt(no));
            rs = pstmt.executeQuery();

            if (rs.next()) {
                DiaryDTO dto = new DiaryDTO();
                dto.setNo(rs.getInt("d_no"));
                dto.setId(rs.getString("d_id"));
                dto.setTitle(rs.getString("d_title"));
                dto.setTxt(rs.getString("d_txt"));
                dto.setDate(rs.getDate("d_date"));
                dto.setVisibility(rs.getInt("d_visibility"));

                req.setAttribute("diary", dto);
            }

            req.setAttribute("curYear", y);
            req.setAttribute("curMonth", m);
            req.setAttribute("selectedDay", d);

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, pstmt, rs);
        }
    }

    // 삭제 기능
    public void deleteDiary(HttpServletRequest request) {
        Connection con = null;
        PreparedStatement pstmt = null;

        try {
            con = DBManager.connect();
            String no = request.getParameter("no");
            String sql = "DELETE FROM diary_test WHERE d_no = ?";
            pstmt = con.prepareStatement(sql);
            pstmt.setInt(1, Integer.parseInt(no));

            if (pstmt.executeUpdate() == 1) {
                System.out.println("일기 삭제 완벽 성공!");
            }

        } catch (Exception e) {
            System.out.println("일기 삭제 실패 ㅠㅠ");
            e.printStackTrace();
        } finally {
            DBManager.close(con, pstmt, null);
        }
    }

    // 수정 기능
    public void updateDiary(HttpServletRequest request) {
        Connection con = null;
        PreparedStatement pstmt = null;

        try {
            con = DBManager.connect();

            String no = request.getParameter("no");
            String title = request.getParameter("d_title");
            String txt = request.getParameter("d_txt");
            String visibility = request.getParameter("d_visibility");

            String sql = "UPDATE diary_test SET d_title = ?, d_txt = ?, d_visibility = ? WHERE d_no = ?";
            pstmt = con.prepareStatement(sql);

            pstmt.setString(1, title);
            pstmt.setString(2, txt);

            int visValue = (visibility == null || visibility.equals("")) ? 2 : Integer.parseInt(visibility);
            pstmt.setInt(3, visValue);
            pstmt.setInt(4, Integer.parseInt(no));

            if (pstmt.executeUpdate() == 1) {
                System.out.println("일기 수정 완벽 성공!");
            }

        } catch (Exception e) {
            System.out.println("일기 수정 실패 ㅠㅠ");
            e.printStackTrace();
        } finally {
            DBManager.close(con, pstmt, null);
        }
    }
}