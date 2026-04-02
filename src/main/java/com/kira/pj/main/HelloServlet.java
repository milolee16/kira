package com.kira.pj.main;

import com.kira.pj.diary.DiaryM;

import java.io.*;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import javax.servlet.annotation.*;

@WebServlet(name = "Main", value = "/main")
public class HelloServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        // 알맹이 파일 이름을 지정
        request.setAttribute("content", "/main.jsp");
        // 껍데기(틀) 파일로 포워딩
        request.getRequestDispatcher("/index.jsp").forward(request, response);
    }
}