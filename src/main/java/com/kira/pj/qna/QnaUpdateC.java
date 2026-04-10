package com.kira.pj.qna; // 패키지명은 맞게 수정하세요

import com.kira.pj.main.HomeDAO;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "QnaUpdateC", value = "/update-qna")
public class QnaUpdateC extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        boolean isSuccess = HomeDAO.updateDailyAnswer(request);

        if (isSuccess) {
            response.getWriter().print("{\"success\": true}");
        } else {
            response.getWriter().print("{\"success\": false}");
        }
    }
}