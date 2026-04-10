package com.kira.pj.friend;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/friendaction")
public class FriendActionC extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        String action = request.getParameter("action");
        String targetPk = request.getParameter("targetPk"); // 상대방 PK

        HttpSession session = request.getSession();
        String myPk = (String) session.getAttribute("loginUserId"); // 내 PK

        // 방어막: 로그인이 풀렸거나 파라미터가 없으면 컷
        if (myPk == null || targetPk == null || action == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        FriendDAO dao = new FriendDAO();
        int result = 0;

        try {
            // [상황 1] 내가 상대방에게 일촌을 "신청"할 때
            if ("request".equals(action)) {
                result = dao.requestFriend(myPk, targetPk);

                // [상황 2] 상대방이 건 신청을 내가 "수락"할 때
                // 주의: DB에는 상대방이 requester, 내가 receiver로 저장되어 있음!
            } else if ("accept".equals(action)) {
                result = dao.acceptFriend(targetPk, myPk);

                // [상황 3] 신청을 "거절"하거나 기존 일촌을 "끊을" 때
            } else if ("delete".equals(action)) {
                result = dao.deleteFriend(myPk, targetPk);
                // [상황 4] 별명 설정/수정
            }

            // 결과 처리
            if (result > 0) {
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().print("success");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        } catch (
                Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}