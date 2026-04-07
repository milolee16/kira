package com.kira.pj.user;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/delete-user")
public class DeleteUserC extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html; charset=UTF-8");

        String pk = (String) request.getSession().getAttribute("loginUserPk");
        String pw = request.getParameter("pw");

        boolean success = UserDAO.DAO.deleteUser(pk, pw);

        if (success) {
            request.getSession().invalidate();

            response.getWriter().print(
                    "<script>" +
                            "alert('회원탈퇴가 완료되었습니다.');" +
                            "location.href='" + request.getContextPath() + "/login';" +
                            "</script>"
            );

        } else {
            response.getWriter().print(
                    "<script>" +
                            "alert('비밀번호가 올바르지 않습니다.');" +
                            "location.href='" + request.getContextPath() + "/mypage';" +
                            "</script>"
            );
        }
    }
}