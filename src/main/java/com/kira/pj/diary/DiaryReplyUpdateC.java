package com.kira.pj.diary;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/diary-reply-update")
public class DiaryReplyUpdateC extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // DB 수정 실행
        DiaryDAO.DDAO.updateReply(request);

        // 비동기니까 JSON으로 성공 메시지만 딱 보냅니다.
        response.setContentType("application/json");
        response.getWriter().write("{\"result\":\"success\"}");
    }
}