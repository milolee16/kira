package com.kira.pj.user;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/mypage")
public class MyPageC extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 로그인 체크
        if (request.getSession().getAttribute("loginUserPk") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        // 바로 마이페이지 JSP로 이동
        request.getRequestDispatcher("/user/mypage.jsp").forward(request, response);
    }
}