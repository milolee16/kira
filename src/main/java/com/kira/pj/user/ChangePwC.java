package com.kira.pj.user;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet("/change-pw")
public class ChangePwC extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html; charset=UTF-8");

        String pk = (String) request.getSession().getAttribute("loginUserPk");
        String oldPw = request.getParameter("oldPw");
        String newPw = request.getParameter("newPw");
        String newPwChk = request.getParameter("newPwChk");

        if (oldPw == null || oldPw.trim().isEmpty()) {
            response.getWriter().print(
                    "<script>" +
                            "alert('현재 비밀번호를 입력해주세요.');" +
                            "location.href='" + request.getContextPath() + "/mypage';" +
                            "</script>"
            );
            return;
        }

        if (newPw == null || newPw.trim().isEmpty()) {
            response.getWriter().print(
                    "<script>" +
                            "alert('새 비밀번호를 입력해주세요.');" +
                            "location.href='" + request.getContextPath() + "/mypage';" +
                            "</script>"
            );
            return;
        }

        if (newPwChk == null || newPwChk.trim().isEmpty()) {
            response.getWriter().print(
                    "<script>" +
                            "alert('새 비밀번호 확인을 입력해주세요.');" +
                            "location.href='" + request.getContextPath() + "/mypage';" +
                            "</script>"
            );
            return;
        }

        if (!newPw.equals(newPwChk)) {
            response.getWriter().print(
                    "<script>" +
                            "alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');" +
                            "location.href='" + request.getContextPath() + "/mypage';" +
                            "</script>"
            );
            return;
        }

        boolean success = UserDAO.DAO.changePw(pk, oldPw, newPw);

        if (success) {
            response.getWriter().print(
                    "<script>" +
                            "alert('비밀번호가 변경되었습니다.');" +
                            "location.href='" + request.getContextPath() + "/mypage';" +
                            "</script>"
            );
        } else {
            response.getWriter().print(
                    "<script>" +
                            "alert('기존 비밀번호가 일치하지 않습니다.');" +
                            "location.href='" + request.getContextPath() + "/mypage';" +
                            "</script>"
            );
        }
    }
}