package com.kira.pj.main;

import com.kira.pj.qna.DailyQnaVO;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.Date;

public class HomeDAO {
    public static DailyQnaVO getDailyQnA( HttpServletRequest request) {
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        DailyQnaVO qna = new DailyQnaVO();

        // 1. 오늘 날짜 문자열 만들기 (예: "2026-04-09")
        String today = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        String host_id = request.getParameter("host_id");
        try {
            con = DBManager.connect();

            // 2. 오늘 이 홈피 주인의 질문이 이미 뽑혀 있는지 확인
            String checkSql = "SELECT l.q_id, q.question, l.answer " +
                    "FROM daily_qna_log l " +
                    "JOIN qna_list q ON l.q_id = q.q_id " +
                    "WHERE l.host_id = ? AND l.q_date = ?";
            ps = con.prepareStatement(checkSql);
            ps.setString(1, host_id);
            ps.setString(2, today);
            rs = ps.executeQuery();

            if (rs.next()) {
                // 🌟 3-1. 오늘 이미 뽑은 질문이 있다면 그대로 반환! (새로고침해도 안 바뀜)
                qna.setQ_id(rs.getInt("q_id"));
                qna.setQuestion(rs.getString("question"));
                qna.setAnswer(rs.getString("answer")); // 안 적었으면 null이 들어감
            } else {
                // 🌟 3-2. 오늘 처음 접속했다면 새로 랜덤 뽑기!
                ps.close(); // 기존 ps 닫기

                int random_qna = (int)(Math.random() * 20) + 1;

                // 질문 내용 가져오기
                String getQSql = "SELECT question FROM qna_list WHERE q_id = ?";
                ps = con.prepareStatement(getQSql);
                ps.setInt(1, random_qna);
                ResultSet rs2 = ps.executeQuery();

                if(rs2.next()) {
                    qna.setQ_id(random_qna);
                    qna.setQuestion(rs2.getString("question"));
                    qna.setAnswer(null); // 아직 대답 안 했으니 null
                }
                rs2.close();
                ps.close();

                // 뽑은 질문을 오늘 날짜로 DB에 저장 (박제)
                String insertSql = "INSERT INTO daily_qna_log (host_id, q_date, q_id) VALUES (?, ?, ?)";
                ps = con.prepareStatement(insertSql);
                ps.setString(1, host_id);
                ps.setString(2, today);
                ps.setInt(3, random_qna);
                ps.executeUpdate();
            }
            return qna;

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, ps, rs);
        }
        return null;
    }


    public static boolean updateDailyAnswer(HttpServletRequest request) {
        Connection con = null;
        PreparedStatement ps = null;

        // 세션에서 로그인한 내 아이디 가져오기 (보안상 매우 중요!)
        String host_id = (String) request.getSession().getAttribute("loginUserId");
        String answer = request.getParameter("answer");
        String today = new SimpleDateFormat("yyyy-MM-dd").format(new Date());

        if (host_id == null || answer == null) return false;

        // 오늘 날짜의 내 질문 레코드에 답변(answer) 덮어쓰기
        String sql = "UPDATE daily_qna_log SET answer = ? WHERE host_id = ? AND q_date = ?";

        try {
            con = DBManager.connect();
            ps = con.prepareStatement(sql);
            ps.setString(1, answer);
            ps.setString(2, host_id);
            ps.setString(3, today);

            return ps.executeUpdate() == 1; // 1줄이 업데이트 되면 true
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, ps, null);
        }
        return false;
    }





    public static void editStMessage(HttpServletRequest request, HttpServletResponse response) {

        Connection con = null;
        PreparedStatement ps = null;
        String host_id  = request.getParameter("host_id");
        String editStM = request.getParameter("editStM");
        String sql = "update main_test set st_message = ? where host_id = ?";
        try{
            con = DBManager.connect();
            ps = con.prepareStatement(sql);
            ps.setString(1,editStM);
            ps.setString(2,host_id);
            if(ps.executeUpdate() == 1) {
                System.out.println("상태 메세지 수정 성공");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            DBManager.close(con,ps,null);
        }


    }

    // =======================================================
    //  홈 화면에 띄울 최근 다이어리 정보 싹 다 가져오기
    // =======================================================
    public static void getRecentDiary(HttpServletRequest req, String hostId) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            con = DBManager.connect();
            // ★ [수정] 제목뿐만 아니라 번호(d_no)와 날짜(y,m,d)까지 전부 가져옵니다!
            String sql = "SELECT * FROM (" +
                    "  SELECT d_no, d_title, " +
                    "         TO_CHAR(d_date, 'YYYY') as d_year, " +
                    "         TO_CHAR(d_date, 'MM') as d_month, " +
                    "         TO_CHAR(d_date, 'DD') as d_day " +
                    "  FROM diary_test " +
                    "  WHERE TRIM(d_id) = ? " +
                    "  ORDER BY d_no DESC" +
                    ") WHERE ROWNUM = 1";

            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, hostId.trim());
            rs = pstmt.executeQuery();

            if (rs.next()) {
                // JSP에 번호, 제목, 년, 월, 일 모두 전달
                req.setAttribute("recentDiaryNo", rs.getInt("d_no"));
                req.setAttribute("recentDiaryTitle", rs.getString("d_title"));
                req.setAttribute("recentDiaryY", rs.getString("d_year"));
                req.setAttribute("recentDiaryM", rs.getString("d_month"));
                req.setAttribute("recentDiaryD", rs.getString("d_day"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, pstmt, rs);
        }
    }
}
