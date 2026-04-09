package com.kira.pj.friend;

import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@WebServlet("/friendview")
public class FriendViewC extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String action = request.getParameter("action");
        HttpSession session = request.getSession();
        String myPk = (String) session.getAttribute("loginUserPk");

        if (myPk == null || myPk.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // [기능 1] 파도타기 시 상대방과의 관계 확인
        if ("status".equals(action)) {
            String targetPk = request.getParameter("targetPk");

            if (targetPk != null && !targetPk.isEmpty()) {
                FriendDAO dao = new FriendDAO();
                FriendDTO dto = dao.checkRelation(myPk, targetPk);

                response.setContentType("application/json; charset=UTF-8");
                response.getWriter().print(new Gson().toJson(dto));
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }

            // 🚨 [기능 2] 나에게 온 신청 목록 반환 (괄호를 완전히 밖으로 뺐음!)
        } else if ("pendingList".equals(action)) {
            FriendDAO dao = new FriendDAO();
            List<Map<String, String>> list = dao.getPendingRequests(myPk);

            response.setContentType("application/json; charset=UTF-8");
            response.getWriter().print(new Gson().toJson(list));
        } else if ("list".equals(action)) {
            // [기능 3] 내 일촌 목록 반환
            FriendDAO dao = new FriendDAO();
            List<Map<String, String>> list = dao.getFriendList(myPk);

            response.setContentType("application/json; charset=UTF-8");
            response.getWriter().print(new Gson().toJson(list));
        }

        // (나중에 여기에 "list".equals(action) 을 추가해서 내 일촌 목록을 불러오는 기능도 넣으면 완벽하다.)
    }
}