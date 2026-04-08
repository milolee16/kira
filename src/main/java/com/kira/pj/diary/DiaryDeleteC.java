package com.kira.pj.diary;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(value = "/diary-delete")
public class DiaryDeleteC extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        // 브라우저에게 "이건 JSON 데이터야" 라고 알려줌
        response.setContentType("application/json; charset=UTF-8");
        DiaryDAO.DDAO.getCalendar(request);
        request.getRequestDispatcher("diary/diary.jsp").forward(request, response);
    }

    public void destroy() {
    }
}