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
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1. 파라미터 처리 (페이지 번호)
        String pStr = request.getParameter("p");
        int p = (pStr == null) ? 1 : Integer.parseInt(pStr);

        // 2. DB 데이터 조회
        VisitorDAO dao = new VisitorDAO();
        String ownerId = "DongMin"; // 고정 ID 변수 처리

        // [A] 해당 페이지의 방문자 목록 (7개)
        List<VisitorDTO> list = dao.getVisitorsByPage(ownerId, p);

        // [B] 우측 위젯용 최신 방문자 목록 (5개)
        List<VisitorDTO> recent = dao.showVisitors(ownerId);

        // 3. JSP 데이터 전달
        request.setAttribute("visitorList", list);     // 메인 리스트
        request.setAttribute("recentVisitors", recent); // 우측 위젯용
        request.setAttribute("currentPage", p);         // 현재 페이지 번호
        request.setAttribute("content", "visitor/visitor.jsp");

        // 4. 화면 포워딩
        request.getRequestDispatcher("index.jsp").forward(request, response);
    }
    // 새로운 방문 기록을 저장하는 역할 (생성: Create)
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        // 1. JSP 폼에서 넘어온 데이터 받기
        String visitorName = request.getParameter("visitorName");

        // 2. 유효성 검사 및 저장 로직
        if (visitorName != null && !visitorName.trim().isEmpty()) {

            VisitorDTO dto = new VisitorDTO();
            dto.setV_writer_id(visitorName);
            dto.setV_owner_id("DongMin");

            // --- 랜덤 이모지 생성 로직 추가 ---
            // 1부터 5 사이의 정수 랜덤 생성
            int randomEmoji = (int) (Math.random() * 5) + 1;
            dto.setV_emoji(randomEmoji);
            // -------------------------------

            VisitorDAO dao = new VisitorDAO();
            int result = dao.insertVisitor(dto);

            if (result == 1) {
                System.out.println("오라클 DB 저장 성공 (이모지 " + randomEmoji + "번): " + visitorName);
            } else {
                System.out.println("오라클 DB 저장 실패");
            }
        }

        // 3. 저장이 끝나면 목록으로 리다이렉트
        response.sendRedirect("visitor");
    }}
