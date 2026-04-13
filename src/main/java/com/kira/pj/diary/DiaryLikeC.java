package com.kira.pj.diary;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/diary-like")
public class DiaryLikeC extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        HttpSession session = request.getSession();
        String uId = (String) session.getAttribute("loginUserId");

        // 로그인이 안 되어 있으면 에러 반환
        if (uId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // JS에서 보낸 글 번호(d_no) 받기
        int dNo = Integer.parseInt(request.getParameter("d_no"));

        // DAO 실행하여 좋아요 추가/취소 처리
        int isLiked = DiaryDAO.DDAO.toggleLike(dNo, uId);

        // 방금 처리된 결과가 반영된 총 좋아요 개수 가져오기
        int likeCount = DiaryDAO.DDAO.getLikeCount(dNo);

        // 프론트엔드(JS)로 JSON 형태의 데이터 보내기
        response.setContentType("application/json; charset=UTF-8");
        response.getWriter().write("{\"isLiked\": " + isLiked + ", \"likeCount\": " + likeCount + "}");
    }
}