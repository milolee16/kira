package com.kira.pj.user;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet("/nickname-check")
public class NicknameCheckC extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");

        String name = request.getParameter("name");
        String birth = request.getParameter("birth");
        String id = request.getParameter("id");
        String pw = request.getParameter("pw");
        String pwChk = request.getParameter("pwChk");
        String nickname = request.getParameter("nickname");

        String idChecked = request.getParameter("idChecked");
        String checkedId = request.getParameter("checkedId");

        request.setAttribute("name", name);
        request.setAttribute("birth", birth);
        request.setAttribute("id", id);
        request.setAttribute("pw", pw);
        request.setAttribute("pwChk", pwChk);
        request.setAttribute("nickname", nickname);

        request.setAttribute("idChecked", idChecked);
        request.setAttribute("checkedId", checkedId);

        boolean exists = UserDAO.DAO.isNicknameExists(nickname);

        if (exists) {
            request.setAttribute("msg", "이미 사용중인 닉네임 입니다.");
            request.setAttribute("nicknameChecked", "N");
            request.setAttribute("checkedNickname", "");
        } else {
            request.setAttribute("msg", "사용 가능한 닉네임 입니다.");
            request.setAttribute("nicknameChecked", "Y");
            request.setAttribute("checkedNickname", nickname);
        }

        request.getRequestDispatcher("user/join.jsp").forward(request, response);
    }
}