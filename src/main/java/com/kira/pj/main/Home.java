package com.kira.pj.main;

import com.google.gson.Gson;
import com.kira.pj.search.SearchDAO;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "Home", value = "/home")
public class Home extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        request.setAttribute("question",HomeDAO.RandomQ(request,response));
        request.setAttribute("searchMain",SearchDAO.searchMain(request));
        request.getRequestDispatcher("/main.jsp").forward(request, response);


    }

    public void destroy() {
    }
}