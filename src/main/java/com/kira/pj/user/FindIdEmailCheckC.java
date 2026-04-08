package com.kira.pj.user;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet("/find-id-email-check")
public class FindIdEmailCheckC extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=UTF-8");
//        response.getWriter().print(UserDAO.DAO.checkFindIdEmailAuth(request));
    }
}