package com.kira.pj.user;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet("/id-check")
public class IdCheckC extends HttpServlet {

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

        String nicknameChecked = request.getParameter("nicknameChecked");
        String checkedNickname = request.getParameter("checkedNickname");

        request.setAttribute("name", name);
        request.setAttribute("birth", birth);
        request.setAttribute("id", id);
        request.setAttribute("pw", pw);
        request.setAttribute("pwChk", pwChk);
        request.setAttribute("nickname", nickname);

        request.setAttribute("nicknameChecked", nicknameChecked);
        request.setAttribute("checkedNickname", checkedNickname);

        boolean exists = UserDAO.DAO.isIdExists(id);

        if (exists) {
            request.setAttribute("msg", "이미 사용중인 아이디 입니다.");
            request.setAttribute("idChecked", "N");
            request.setAttribute("checkedId", "");
        } else {
            request.setAttribute("msg", "사용 가능한 아이디 입니다.");
            request.setAttribute("idChecked", "Y");
            request.setAttribute("checkedId", id);
        }

        request.getRequestDispatcher("user/join.jsp").forward(request, response);
    }
}