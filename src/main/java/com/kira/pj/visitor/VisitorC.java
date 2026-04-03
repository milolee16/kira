package com.kira.pj.visitor;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/visitor") // name 생략하고 깔끔하게 주소만 매핑
public class VisitorC extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 1. 파라미터 처리 (페이지 번호)
        String pStr = request.getParameter("p");
        int p = (pStr == null) ? 1 : Integer.parseInt(pStr);
        String ajax = request.getParameter("ajax");

        // 2. DB 데이터 조회
        VisitorDAO dao = new VisitorDAO();
        String ownerId = "DongMin";

        // [A] 해당 페이지 방문자 목록 (7개)
        List<VisitorDTO> list = dao.getVisitorsByPage(ownerId, p);
        // [B] 우측 위젯용 최근 방문자 목록 (5개)
        List<VisitorDTO> recent = dao.getRecentVisitors(ownerId);

        // 3. JSP 데이터 공통 전달
        request.setAttribute("visitorList", list);
        request.setAttribute("recentVisitors", recent);
        request.setAttribute("currentPage", p);
        request.setAttribute("content", "visitor/visitor.jsp");

        // 4. 화면 포워딩 (AJAX 여부에 따른 분기)
        if ("true".equals(ajax)) {
            // 알맹이만 업데이트할 때 (CSS 깨짐 주의: visitor.jsp 상단에 <link> 확인)
            request.getRequestDispatcher("visitor/visitor.jsp").forward(request, response);
        } else {
            // 전체 페이지를 새로 그릴 때 (새로고침, 직접 주소 입력 등)
            request.getRequestDispatcher("index.jsp").forward(request, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        String visitorName = request.getParameter("visitorName");

        if (visitorName != null && !visitorName.trim().isEmpty()) {
            VisitorDTO dto = new VisitorDTO();
            dto.setV_writer_id(visitorName);
            dto.setV_owner_id("DongMin");
            dto.setV_emoji((int) (Math.random() * 5) + 1);

            VisitorDAO dao = new VisitorDAO();
            dao.insertVisitor(dto);
        }

        // ⭐️ 핵심 수정: ajax=true를 빼야 전체 페이지(index.jsp)가 정상적으로 다시 그려집니다.
        response.sendRedirect("visitor");
    }
}