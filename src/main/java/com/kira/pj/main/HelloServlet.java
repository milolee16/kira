package com.kira.pj.main;

import java.io.*;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import javax.servlet.annotation.*;

@WebServlet(name = "Main", value = "/main")
public class HelloServlet extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
    request.setAttribute("content", "main.jsp");
    request.getRequestDispatcher("index.jsp").forward(request,response);
    }

    public void destroy() {
    }
}