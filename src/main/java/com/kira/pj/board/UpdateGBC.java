package com.kira.pj.board;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "UpdateGBC", value = "/updateGB")
public class UpdateGBC extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        response.setContentType("application/json; charset=utf-8");
        response.getWriter().println(GuestBoardDAO.GBDAO.UpdateGuestBoard(request, response));
    }
    public void destroy() {
    }
}