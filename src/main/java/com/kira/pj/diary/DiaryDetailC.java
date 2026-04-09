package com.kira.pj.diary;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/diary-detail")
public class DiaryDetailC extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // 1. DAO를 통해 DB에서 일기 상세 내용 가져오기
        DiaryDAO.DDAO.getDiaryDetail(request);

        // 2. 해당 일기에 달린 댓글 리스트 가져오기
        DiaryDAO.DDAO.getReplies(request);

        // 3. JSP에게 "상세 보기(detail)" 화면을 그리라고 알려주기
        request.setAttribute("showMode", "detail");

        // 4. 진짜로 diary.jsp 파일을 향해 출발! (데이터 다 싣고 이동)
        // ★ 이 코드가 반드시 doGet 메서드의 닫는 중괄호(}) 바로 위에 있어야 합니다.
        request.getRequestDispatcher("diary/diary.jsp").forward(request, response);

    }
}