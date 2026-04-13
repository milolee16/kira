package com.kira.pj.diary;

import com.kira.pj.main.DBManager;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Calendar;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/diary-detail")
public class DiaryDetailC extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1. 다이어리 상세 데이터 가져오기
        DiaryDAO.DDAO.getDiaryDetail(request);
        DiaryDTO diary = (DiaryDTO) request.getAttribute("diary");

        if (diary == null) {
            response.sendError(404, "글이 존재하지 않습니다.");
            return;
        }

        // ★ [날짜 복구 핵심 로직]
        // URL 파라미터(y, m, d)가 비어있을 경우를 대비해 기본값(오늘) 세팅 방어막을 칩니다.
        String y = request.getParameter("y");
        String m = request.getParameter("m");
        String d = request.getParameter("d");

        if (y == null || y.isEmpty() || m == null || m.isEmpty() || d == null || d.isEmpty()) {
            Calendar cal = Calendar.getInstance();
            y = String.valueOf(cal.get(Calendar.YEAR));
            m = String.valueOf(cal.get(Calendar.MONTH) + 1);
            d = String.valueOf(cal.get(Calendar.DATE));
        }

        // JSP에서 ${curYear}.${curMonth}.${selectedDay} 로 정확히 매칭되게 세팅
        request.setAttribute("curYear", y);
        request.setAttribute("curMonth", m);
        request.setAttribute("selectedDay", d);

        HttpSession session = request.getSession();
        String myId = (String) session.getAttribute("loginUserId");
        String writerId = diary.getId();

        // 2. 일촌 관계 확인 로직 (기존 유지)
        int relation = 0;
        if (myId != null && writerId != null) {
            if (myId.trim().equalsIgnoreCase(writerId.trim())) {
                relation = 2;
            } else {
                Connection con = null;
                PreparedStatement pstmt = null;
                ResultSet rs = null;
                try {
                    con = DBManager.connect();
                    String friendSql = "SELECT * FROM FRIEND_RELATION WHERE " +
                            "((UPPER(TRIM(F_REQUESTER)) = UPPER(?) AND UPPER(TRIM(F_RECEIVER)) = UPPER(?)) OR " +
                            "(UPPER(TRIM(F_REQUESTER)) = UPPER(?) AND UPPER(TRIM(F_RECEIVER)) = UPPER(?))) " +
                            "AND F_STATUS = 1";
                    pstmt = con.prepareStatement(friendSql);
                    pstmt.setString(1, myId.trim());
                    pstmt.setString(2, writerId.trim());
                    pstmt.setString(3, writerId.trim());
                    pstmt.setString(4, myId.trim());

                    rs = pstmt.executeQuery();
                    if (rs.next()) {
                        relation = 1;
                    }
                } catch (Exception e) { e.printStackTrace(); }
                finally { DBManager.close(con, pstmt, rs); }
            }
        }

        // 3. 권한 및 추가 데이터 세팅
        int vis = diary.getVisibility();
        boolean canRead = (vis == 2) || (vis == 1 && relation >= 1) || (vis == 0 && relation == 2);

        if (canRead) {
            DiaryDAO.DDAO.getReplies(request);
            int likeCount = DiaryDAO.DDAO.getLikeCount(diary.getNo());
            int isLiked = DiaryDAO.DDAO.checkIsLiked(diary.getNo(), myId);
            request.setAttribute("likeCount", likeCount);
            request.setAttribute("isLiked", isLiked);
            request.setAttribute("showMode", "detail");
        } else {
            request.setAttribute("showMode", "list");
            request.setAttribute("errorMsg", "접근 권한이 없습니다. 🔒");
            DiaryDAO.DDAO.getCalendar(request);
        }

        request.getRequestDispatcher("diary/diary.jsp").forward(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }
}