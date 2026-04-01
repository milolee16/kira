package com.kira.pj.board;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "BoardC", value = "/board")
public class BoardC extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        GuestBoardDAO.GBDAO.showGuestBoard(request, response);

        request.setAttribute("content","board/board.jsp");
        request.getRequestDispatcher("index.jsp").forward(request,response);
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        GuestBoardDAO.GBDAO.addHi(request,response);
        response.sendRedirect("board");
    }
    public void destroy() {
    }
}