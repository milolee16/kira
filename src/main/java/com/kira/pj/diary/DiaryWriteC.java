package com.kira.pj.diary;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

// JS가 쏘는 주소와 완벽하게 일치!
@WebServlet("/diary-write")
public class DiaryWriteC extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1. 한글 깨짐 방지
        request.setCharacterEncoding("utf-8");

        // 2. DAO한테 DB 저장 시키기
        DiaryDAO.DDAO.insertDiary(request);

        // 3. 성공 신호 보내기
        response.getWriter().print("ok");
    }
}