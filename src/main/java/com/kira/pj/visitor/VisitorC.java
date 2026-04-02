package com.kira.pj.visitor;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "VisitorC", value = "/visitor")
public class VisitorC extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 1. 페이지 번호 파라미터
        String pStr = request.getParameter("p");
        int p = (pStr == null) ? 1 : Integer.parseInt(pStr);

        // 2. DB 조회
        VisitorDAO dao = new VisitorDAO();
        String ownerId = "DongMin";

        // 메인 방문자 목록
        List<VisitorDTO> list = dao.getVisitorsByPage(ownerId, p);

        // 최근 방문자 목록
        List<VisitorDTO> recent = dao.getRecentVisitors(ownerId);

        // JSP 전달
        request.setAttribute("visitorList", list);
        request.setAttribute("recentVisitors", recent);
        request.setAttribute("currentPage", p);

        // AJAX 여부 확인
        String ajax = request.getParameter("ajax");

        if ("true".equals(ajax)) {
            request.getRequestDispatcher("visitor/visitor.jsp").forward(request, response);
        } else {
            request.setAttribute("content", "visitor/visitor.jsp");
            request.getRequestDispatcher("index.jsp").forward(request, response);
        }
    }

    // 방문 기록 저장
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");

        // 방문자 이름
        String visitorName = request.getParameter("visitorName");

        if (visitorName != null && !visitorName.trim().isEmpty()) {

            VisitorDTO dto = new VisitorDTO();
            dto.setV_writer_id(visitorName);
            dto.setV_owner_id("DongMin");

            // 랜덤 이모지
            int randomEmoji = (int) (Math.random() * 5) + 1;
            dto.setV_emoji(randomEmoji);

            VisitorDAO dao = new VisitorDAO();
            int result = dao.insertVisitor(dto);

            if (result == 1) {
                System.out.println("오라클 DB 저장 성공 (이모지 " + randomEmoji + "번): " + visitorName);
            } else {
                System.out.println("오라클 DB 저장 실패");
            }
        }

        // AJAX 페이지 리로드
        response.sendRedirect("visitor?ajax=true");
    }
}