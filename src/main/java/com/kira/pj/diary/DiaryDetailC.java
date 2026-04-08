package com.kira.pj.diary;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/diary-detail")
public class DiaryDetailC extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // 1. DAO한테 "저 번호(no) 글 하나만 DB에서 가져와!" 시키기 (이따 DAO에 만들 거예요)
//        DiaryDAO.DDAO.getDiaryDetail(request);

        // 2. 화면 모드를 '상세보기(detail)'로 세팅
        request.setAttribute("showMode", "detail");

        // 3. 다이어리 화면으로 다시 포워딩
        request.getRequestDispatcher("diary/diary.jsp").forward(request, response);
    }
}