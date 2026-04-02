package com.kira.pj.main;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/home-body")
public class HomeBodyServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        // 나중에 DB 데이터 여기서 세팅
        // req.setAttribute("postList", postDAO.getList());

        req.getRequestDispatcher("main.jsp")
                .forward(req, resp);
    }
}