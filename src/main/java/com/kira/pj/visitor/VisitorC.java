package com.kira.pj.visitor;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "VisitorC", value = "/visitor")
public class VisitorC extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        VisitorDAO dao = new VisitorDAO();
        List<VisitorDTO> list = dao.getAllVisitors("DongMin");
        request.setAttribute("visitorList", list);

        String ajax = request.getParameter("ajax");
        if ("true".equals(ajax)) {
            request.getRequestDispatcher("visitor/visitor.jsp").forward(request, response);
        } else {
            request.setAttribute("content", "visitor/visitor.jsp");
            request.getRequestDispatcher("index.jsp").forward(request, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        String visitorName = request.getParameter("visitorName");

        System.out.println("오라클 DB 저장 시도: " + visitorName);

        response.sendRedirect("/visitor?ajax=true");
    }
}