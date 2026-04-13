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
    private DiaryDAO() {}

    public void getCalendar(HttpServletRequest req) {
        Calendar cal = Calendar.getInstance();
        String y = req.getParameter("y");
        String m = req.getParameter("m");
        String d = req.getParameter("d");
        String mode = req.getParameter("mode");

        HttpSession session = req.getSession();
        String myId = (String) session.getAttribute("loginUserId");

        String targetId = (String) req.getAttribute("ownerId");
        if (targetId == null || targetId.isEmpty()) {
            String memberId = req.getParameter("memberId");
            if (memberId == null || memberId.isEmpty()) {
                memberId = req.getParameter("host_id");
            }
            targetId = (memberId == null || memberId.isEmpty()) ? myId : memberId;
        }
        req.setAttribute("ownerId", targetId);

        int year = (y == null || y.equals("")) ? cal.get(Calendar.YEAR) : Integer.parseInt(y);
        int month = (m == null || m.equals("")) ? cal.get(Calendar.MONTH) : Integer.parseInt(m) - 1;
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

        String showMode = "calendar";
        if ("write".equals(mode)) {
            showMode = "write";
            req.setAttribute("selectedDay", d);
        } else if (d != null && !d.equals("")) {
            showMode = "list";
            req.setAttribute("selectedDay", d);
        }
        req.setAttribute("showMode", showMode);

        if ("list".equals(showMode)) {
            Connection con = null;
            PreparedStatement pstmt = null;
            ResultSet rs = null;
            ArrayList<DiaryDTO> posts = new ArrayList<>();

            try {
                con = DBManager.connect();
                int relation = 0;

                if (myId != null && targetId != null) {
                    if (myId.trim().equalsIgnoreCase(targetId.trim())) {
                        relation = 2;
                    } else {
                        // ★ [수정 완료] 테이블명을 FRIEND_RELATION 으로 정확히 맞췄습니다!!
                        String friendSql = "SELECT * FROM FRIEND_RELATION WHERE " +
                                "((UPPER(TRIM(F_REQUESTER)) = UPPER(?) AND UPPER(TRIM(F_RECEIVER)) = UPPER(?)) OR " +
                                "(UPPER(TRIM(F_REQUESTER)) = UPPER(?) AND UPPER(TRIM(F_RECEIVER)) = UPPER(?))) " +
                                "AND F_STATUS = 1";
                        PreparedStatement fPstmt = con.prepareStatement(friendSql);
                        fPstmt.setString(1, myId.trim());
                        fPstmt.setString(2, targetId.trim());
                        fPstmt.setString(3, targetId.trim());
                        fPstmt.setString(4, myId.trim());

                        ResultSet fRs = fPstmt.executeQuery();
                        if (fRs.next()) {
                            relation = 1;
                        }
                        DBManager.close(null, fPstmt, fRs);
                    }
                }

                System.out.println(">>> [DAO 로그] 나:" + myId + " | 주인:" + targetId + " | 관계:" + relation);

                String formattedMonth = String.format("%02d", curMonth + 1);
                String formattedDay = String.format("%02d", Integer.parseInt(d));
                String fullDate = curYear + "-" + formattedMonth + "-" + formattedDay;

                String sql = "SELECT * FROM diary_test WHERE TO_CHAR(d_date, 'YYYY-MM-DD') = ? AND TRIM(d_id) = ? ";
                if (relation == 2) sql += "AND d_visibility IN (0, 1, 2) ";
                else if (relation == 1) sql += "AND d_visibility IN (1, 2) ";
                else sql += "AND d_visibility = 2 ";
                sql += "ORDER BY d_no DESC";

                pstmt = con.prepareStatement(sql);
                pstmt.setString(1, fullDate);
                pstmt.setString(2, targetId.trim());
                rs = pstmt.executeQuery();

                while (rs.next()) {
                    DiaryDTO dto = new DiaryDTO();
                    dto.setNo(rs.getInt("d_no"));
                    dto.setId(rs.getString("d_id").trim());
                    dto.setTitle(rs.getString("d_title"));
                    dto.setTxt(rs.getString("d_txt"));
                    dto.setVisibility(rs.getInt("d_visibility"));
                    posts.add(dto);
                }
            } catch (Exception e) { e.printStackTrace(); }
            finally { DBManager.close(con, pstmt, rs); }
            req.setAttribute("posts", posts);
        }
    }

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
            String id = (String) req.getSession().getAttribute("loginUserId");
            String fullDate = year + "-" + String.format("%02d", Integer.parseInt(month)) + "-" + String.format("%02d", Integer.parseInt(date));
            pstmt.setString(1, id);
            pstmt.setString(2, fullDate);
            pstmt.setString(3, title);
            pstmt.setString(4, txt);
            pstmt.setInt(5, Integer.parseInt(visibility));
            pstmt.executeUpdate();
        } catch (Exception e) { e.printStackTrace(); }
        finally { DBManager.close(con, pstmt, null); }
    }

    public void getDiaryDetail(HttpServletRequest req) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            con = DBManager.connect();
            String no = req.getParameter("no");
            pstmt = con.prepareStatement("SELECT * FROM diary_test WHERE d_no = ?");
            pstmt.setInt(1, Integer.parseInt(no));
            rs = pstmt.executeQuery();
            if (rs.next()) {
                DiaryDTO dto = new DiaryDTO();
                dto.setNo(rs.getInt("d_no"));
                dto.setId(rs.getString("d_id").trim());
                dto.setTitle(rs.getString("d_title"));
                dto.setTxt(rs.getString("d_txt"));
                dto.setDate(rs.getDate("d_date"));
                dto.setVisibility(rs.getInt("d_visibility"));
                req.setAttribute("diary", dto);
            }
        } catch (Exception e) { e.printStackTrace(); }
        finally { DBManager.close(con, pstmt, rs); }
    }

    public void updateDiary(HttpServletRequest request) {
        Connection con = null;
        PreparedStatement pstmt = null;
        try {
            con = DBManager.connect();
            String sql = "UPDATE diary_test SET d_title = ?, d_txt = ?, d_visibility = ? WHERE d_no = ?";
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, request.getParameter("d_title"));
            pstmt.setString(2, request.getParameter("d_txt"));
            pstmt.setInt(3, Integer.parseInt(request.getParameter("d_visibility")));
            pstmt.setInt(4, Integer.parseInt(request.getParameter("no")));
            pstmt.executeUpdate();
        } catch (Exception e) { e.printStackTrace(); }
        finally { DBManager.close(con, pstmt, null); }
    }

    public void deleteDiary(HttpServletRequest request) {
        Connection con = null;
        PreparedStatement pstmt = null;
        try {
            con = DBManager.connect();
            pstmt = con.prepareStatement("DELETE FROM diary_test WHERE d_no = ?");
            pstmt.setInt(1, Integer.parseInt(request.getParameter("no")));
            pstmt.executeUpdate();
        } catch (Exception e) { e.printStackTrace(); }
        finally { DBManager.close(con, pstmt, null); }
    }

    public void insertReply(HttpServletRequest req) {
        Connection con = null;
        PreparedStatement pstmt = null;
        try {
            con = DBManager.connect();
            pstmt = con.prepareStatement("INSERT INTO diary_reply VALUES (diary_reply_seq.nextval, ?, ?, ?, SYSDATE)");
            pstmt.setInt(1, Integer.parseInt(req.getParameter("d_no")));
            pstmt.setString(2, (String) req.getSession().getAttribute("loginUserId"));
            pstmt.setString(3, req.getParameter("r_txt"));
            pstmt.executeUpdate();
        } catch (Exception e) { e.printStackTrace(); }
        finally { DBManager.close(con, pstmt, null); }
    }

    public void getReplies(HttpServletRequest req) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            con = DBManager.connect();
            pstmt = con.prepareStatement("SELECT * FROM diary_reply WHERE d_no = ? ORDER BY r_date ASC");
            pstmt.setInt(1, Integer.parseInt(req.getParameter("no")));
            rs = pstmt.executeQuery();
            ArrayList<ReplyDTO> replies = new ArrayList<>();
            while (rs.next()) {
                replies.add(new ReplyDTO(rs.getInt("r_no"), rs.getInt("d_no"), rs.getString("r_id"), rs.getString("r_txt"), rs.getDate("r_date")));
            }
            req.setAttribute("replies", replies);
        } catch (Exception e) { e.printStackTrace(); }
        finally { DBManager.close(con, pstmt, rs); }
    }
    public void updateReply(HttpServletRequest req) {
        Connection con = null;
        PreparedStatement pstmt = null;
        try {
            con = DBManager.connect();
            String sql = "UPDATE diary_reply SET r_txt = ? WHERE r_no = ?";
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, req.getParameter("r_txt"));
            pstmt.setInt(2, Integer.parseInt(req.getParameter("r_no")));
            pstmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, pstmt, null);
        }
    }

    public void deleteReply(HttpServletRequest req) {
        Connection con = null;
        PreparedStatement pstmt = null;
        try {
            con = DBManager.connect();
            pstmt = con.prepareStatement("DELETE FROM diary_reply WHERE r_no = ?");
            pstmt.setInt(1, Integer.parseInt(req.getParameter("r_no")));
            pstmt.executeUpdate();
        } catch (Exception e) { e.printStackTrace(); }
        finally { DBManager.close(con, pstmt, null); }
    }

    // =======================================================
    // [추가 기능] 좋아요 토글 (누르면 +1, 다시 누르면 -1)
    // =======================================================
    public int toggleLike(int dNo, String uId) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        int isLiked = 0; // 0: 좋아요 취소됨, 1: 좋아요 추가됨

        try {
            con = DBManager.connect();
            // 1. 이미 좋아요를 눌렀는지 확인
            String checkSql = "SELECT * FROM diary_like WHERE d_no = ? AND u_id = ?";
            pstmt = con.prepareStatement(checkSql);
            pstmt.setInt(1, dNo);
            pstmt.setString(2, uId);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                // 2-1. 이미 눌렀다면 삭제 (좋아요 취소)
                PreparedStatement delPstmt = con.prepareStatement("DELETE FROM diary_like WHERE d_no = ? AND u_id = ?");
                delPstmt.setInt(1, dNo);
                delPstmt.setString(2, uId);
                delPstmt.executeUpdate();
                delPstmt.close();
                isLiked = 0;
            } else {
                // 2-2. 안 눌렀다면 추가 (좋아요)
                PreparedStatement insPstmt = con.prepareStatement("INSERT INTO diary_like VALUES (diary_like_seq.nextval, ?, ?)");
                insPstmt.setInt(1, dNo);
                insPstmt.setString(2, uId);
                insPstmt.executeUpdate();
                insPstmt.close();
                isLiked = 1;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, pstmt, rs);
        }
        return isLiked; // 서블릿에게 현재 상태를 알려줌
    }

    // =======================================================
    // [추가 기능] 특정 게시글의 총 좋아요 개수 가져오기
    // =======================================================
    public int getLikeCount(int dNo) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        int count = 0;
        try {
            con = DBManager.connect();
            String sql = "SELECT COUNT(*) FROM diary_like WHERE d_no = ?";
            pstmt = con.prepareStatement(sql);
            pstmt.setInt(1, dNo);
            rs = pstmt.executeQuery();
            if (rs.next()) {
                count = rs.getInt(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, pstmt, rs);
        }
        return count;
    }

    // =======================================================
    // [추가 기능] 내가 이 글에 좋아요를 눌렀는지 확인
    // =======================================================
    public int checkIsLiked(int dNo, String uId) {
        if (uId == null) return 0;
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            con = DBManager.connect();
            String sql = "SELECT * FROM diary_like WHERE d_no = ? AND u_id = ?";
            pstmt = con.prepareStatement(sql);
            pstmt.setInt(1, dNo);
            pstmt.setString(2, uId);
            rs = pstmt.executeQuery();
            if (rs.next()) {
                return 1; // 이미 눌렀음 (꽉 찬 하트)
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, pstmt, rs);
        }
        return 0; // 안 눌렀음 (빈 하트)
    }
}