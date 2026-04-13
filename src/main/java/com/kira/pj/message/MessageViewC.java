package com.kira.pj.message;

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

@WebServlet("/messageview")
public class MessageViewC extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json; charset=UTF-8");

        HttpSession session = request.getSession();
        String myId = (String) session.getAttribute("loginUserId");
        String ownerId = request.getParameter("ownerId");

        // 1차 방어: 로그인 여부 검증
        if (myId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"error\": \"로그인이 필요합니다.\"}");
            return;
        }

        // 2차 방어: 미니홈피 주인 권한 검증
        if (ownerId == null || !myId.equals(ownerId)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().print("{\"error\": \"쪽지함은 미니홈피 주인만 열람할 수 있습니다.\"}");
            return;
        }

        String action = request.getParameter("action");

        // 3차 방어: 필수 파라미터 누락 검증
        if (action == null || action.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().print("{\"error\": \"잘못된 요청 파라미터입니다.\"}");
            return;
        }

        // DB 접근 로직을 try-catch로 감싸서 예외 발생 시 서버 다운 방지 및 JSON 에러 반환
        try {
            MessageDAO dao = new MessageDAO();

            if ("unreadCount".equals(action)) {
                int count = dao.getUnreadCount(myId);
                response.getWriter().print("{\"count\": " + count + "}");
                return;
            }

            List<Map<String, String>> list = null;
            if ("received".equals(action)) {
                list = dao.getReceivedMessages(myId);
            } else if ("sent".equals(action)) {
                list = dao.getSentMessages(myId);
            }

            if (list != null && !list.isEmpty()) {
                response.getWriter().print(new Gson().toJson(list));
            } else {
                response.getWriter().print("[]");
            }

        } catch (Exception e) {
            // 서버 콘솔에는 에러 로그를 남기고, 클라이언트에게는 500 에러와 JSON 메시지 전달
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print("{\"error\": \"데이터베이스 처리 중 서버 오류가 발생했습니다.\"}");
        }
    }
}