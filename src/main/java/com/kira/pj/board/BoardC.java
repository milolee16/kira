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
        // 브라우저에게 "이건 JSON 데이터야" 라고 알려줌
        response.setContentType("application/json; charset=UTF-8");

        // DAO에서 가져온 JSON 문자열을 그대로 출력
        response.getWriter().print(GuestBoardDAO.GBDAO.showGuestBoard(request, response));
    }


    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        response.setContentType("application/json; charset=UTF-8");
        response.getWriter().print(GuestBoardDAO.GBDAO.addHi(request,response));
    }
    public void destroy() {
    }
}