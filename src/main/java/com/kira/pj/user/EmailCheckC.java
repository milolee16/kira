package com.kira.pj.user;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet("/email-check")
public class EmailCheckC extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=UTF-8");
//        response.getWriter().print(UserDAO.DAO.checkJoinEmailAuth(request));
    }
}