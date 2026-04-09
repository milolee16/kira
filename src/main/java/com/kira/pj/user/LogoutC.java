package com.kira.pj.user;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet("/logout")
public class LogoutC extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        // 🔥 세션 가져오기 (없으면 새로 만들지 않도록 false 추천)
        HttpSession session = request.getSession(false);

        // 🔥 세션이 존재하면 삭제
        if (session != null) {
            session.invalidate();
        }

        // 🔥 로그인 페이지로 이동
        response.sendRedirect(request.getContextPath() + "/login");
    }
}