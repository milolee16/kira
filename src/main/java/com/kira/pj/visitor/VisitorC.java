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

        // DB 조회 (기존 로직 그대로)
        VisitorDAO dao = new VisitorDAO();
        List<VisitorDTO> list = dao.getAllVisitors("DongMin");
        request.setAttribute("visitorList", list);

        // ✅ ajax 파라미터 분기
        String ajax = request.getParameter("ajax");
        if ("true".equals(ajax)) {
            // 탭 클릭 → visitor.jsp만 반환 (index.jsp 거치지 않음)
            request.getRequestDispatcher("visitor/visitor.jsp").forward(request, response);
        } else {
            // 직접 URL 접근 또는 새로고침 → 기존 방식 그대로
            request.setAttribute("content", "visitor/visitor.jsp");
            request.getRequestDispatcher("index.jsp").forward(request, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        String visitorName = request.getParameter("visitorName");

        /*
        VisitorDTO dto = new VisitorDTO();
        dto.setvWriterId(visitorName);
        dto.setvOwnerId("DongMin");
        VisitorDAO dao = new VisitorDAO();
        dao.insertVisitor(dto);
        */

        System.out.println("오라클 DB 저장 시도: " + visitorName);

        // ✅ POST 후 리다이렉트도 ajax=true로 → iframe 안에서만 갱신, 음악 유지
        response.sendRedirect("/visitor?ajax=true");
    }
}