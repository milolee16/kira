package com.kira.pj.diary;

import com.kira.pj.friend.FriendDAO;
import com.kira.pj.friend.FriendDTO;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/diary-detail")
public class DiaryDetailC extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1. 글 정보 가져오기
        DiaryDAO.DDAO.getDiaryDetail(request);
        DiaryDTO diary = (DiaryDTO) request.getAttribute("diary");

        if (diary == null) {
            response.sendError(404, "글이 존재하지 않습니다.");
            return;
        }

        // 2. 권한 확인을 위한 ID/PK 세팅
        HttpSession session = request.getSession();
        String myId = (String) session.getAttribute("loginUserId");   // 내 아이디
        String myPk = (String) session.getAttribute("loginUserPk");   // 내 PK
        String writerId = diary.getId(); // 글쓴이 아이디 (DB에서 가져온 값)

        // 미니홈피 주인 정보 (파도타기 시 세팅된 값)
        String ownerPk = (String) session.getAttribute("ownerUserPk");

        // 3. 관계 파악 (0:남남, 1:일촌, 2:본인)
        int relation = 0;
        if (myId != null && writerId != null && myId.equals(writerId.trim())) {
            relation = 2; // 내가 쓴 글이면 무조건 본인!
        } else if (myPk != null && ownerPk != null) {
            FriendDAO fdao = new FriendDAO();
            FriendDTO fdto = fdao.checkRelation(myPk, ownerPk);
            if (fdto != null && fdto.getF_status() == 1) {
                relation = 1; // 일촌 사이
            }
        }

        // 4. 공개 범위에 따른 최종 판단
        int vis = diary.getVisibility();
        boolean canRead = false;

        if (vis == 2) canRead = true; // 전체공개
        else if (vis == 1 && relation >= 1) canRead = true; // 일촌공개 (일촌 이상)
        else if (vis == 0 && relation == 2) canRead = true; // 나만보기 (본인만)

        if (canRead) {
            DiaryDAO.DDAO.getReplies(request);
            request.setAttribute("showMode", "detail");
        } else {
            // 🚨 권한 없을 때 하얀 화면 방지: 에러 메시지 세팅
            request.setAttribute("showMode", "calendar"); // 그냥 달력으로 보내거나
            request.setAttribute("errorMsg", "접근 권한이 없습니다. 🔒");
        }

        request.getRequestDispatcher("diary/diary.jsp").forward(request, response);
    }
}