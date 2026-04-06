package com.kira.pj.diary;

import com.kira.pj.board.GuestBoardDAO;
import com.kira.pj.main.DBManager;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet(value = "/diary")
public class DiaryC extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        // 브라우저에게 "이건 JSON 데이터야" 라고 알려줌
        response.setContentType("application/json; charset=UTF-8");

        DiaryM.getCalendar(request);
        request.getRequestDispatcher("diary/diary.jsp").forward(request, response);

    }

    public void destroy() {
    }
}