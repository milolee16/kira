package com.kira.pj.main;

import java.io.*;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import javax.servlet.annotation.*;

@WebServlet(name = "Main", value = "/main")
//public class HelloServlet extends HttpServlet {
//    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
//        // 알맹이 파일 이름을 지정
//        request.setAttribute("content", "/main.jsp");
//        // 껍데기(틀) 파일로 포워딩
//        request.getRequestDispatcher("/index.jsp").forward(request, response);
//    }
//}
public class HelloServlet extends HttpServlet {
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

        HttpSession session = request.getSession();
        Object loginUserPk = session.getAttribute("loginUserPk");

        // 로그인 안 된 상태면 login으로 보냄
        if (loginUserPk == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        // 로그인 된 상태면 main 출력
        request.setAttribute("content", "/main.jsp");
        request.getRequestDispatcher("/index.jsp").forward(request, response);
    }
}