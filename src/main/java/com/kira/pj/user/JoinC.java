package com.kira.pj.user;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "JoinC", value = "/join")
public class JoinC extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getRequestDispatcher("user/join.jsp").forward(request, response);
    }

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
        String nicknameChecked = request.getParameter("nicknameChecked");
        String checkedNickname = request.getParameter("checkedNickname");

        request.setAttribute("name", name);
        request.setAttribute("birth", birth);
        request.setAttribute("id", id);
        request.setAttribute("pw", pw);
        request.setAttribute("pwChk", pwChk);
        request.setAttribute("nickname", nickname);

        request.setAttribute("idChecked", idChecked);
        request.setAttribute("checkedId", checkedId);
        request.setAttribute("nicknameChecked", nicknameChecked);
        request.setAttribute("checkedNickname", checkedNickname);

        if (!pw.equals(pwChk)) {
            request.setAttribute("msg", "비밀번호와 비밀번호 확인이 다릅니다.");
            request.getRequestDispatcher("user/join.jsp").forward(request, response);
            return;
        }

        if (!"Y".equals(idChecked) || checkedId == null || !checkedId.equals(id)) {
            request.setAttribute("msg", "아이디 중복확인을 먼저 완료해주세요.");
            request.getRequestDispatcher("user/join.jsp").forward(request, response);
            return;
        }

        if (!"Y".equals(nicknameChecked) || checkedNickname == null || !checkedNickname.equals(nickname)) {
            request.setAttribute("msg", "닉네임 중복확인을 먼저 완료해주세요.");
            request.getRequestDispatcher("user/join.jsp").forward(request, response);
            return;
        }

        if (UserDAO.DAO.isIdExists(id)) {
            request.setAttribute("msg", "이미 사용중인 아이디 입니다.");
            request.setAttribute("idChecked", "N");
            request.setAttribute("checkedId", "");
            request.getRequestDispatcher("user/join.jsp").forward(request, response);
            return;
        }

        if (UserDAO.DAO.isNicknameExists(nickname)) {
            request.setAttribute("msg", "이미 사용중인 닉네임 입니다.");
            request.setAttribute("nicknameChecked", "N");
            request.setAttribute("checkedNickname", "");
            request.getRequestDispatcher("user/join.jsp").forward(request, response);
            return;
        }

        boolean result = UserDAO.DAO.join(request);

        if (result) {
            response.sendRedirect(request.getContextPath() + "/login");
        } else {
            request.setAttribute("msg", "회원가입 실패");
            request.getRequestDispatcher("user/join.jsp").forward(request, response);
        }
    }
}