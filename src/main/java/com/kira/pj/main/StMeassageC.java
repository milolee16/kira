package com.kira.pj.main;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "StMeassageC", value = "/editStMessage")
public class StMeassageC extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
      response.setContentType("application/json; charset=UTF-8");
       HomeDAO.editStMessage(request, response);
        response.getWriter().print("{\"message\": \"success\"}");

    }

    public void destroy() {
    }
}