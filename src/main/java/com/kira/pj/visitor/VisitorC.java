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

        String pStr = request.getParameter("p");
        int p = (pStr == null) ? 1 : Integer.parseInt(pStr);

        VisitorDAO dao = new VisitorDAO();
        String ownerId = "DongMin";

        List<VisitorDTO> list = dao.getVisitorsByPage(ownerId, p);
        List<VisitorDTO> recent = dao.getRecentVisitors(ownerId);

        request.setAttribute("visitorList", list);
        request.setAttribute("recentVisitors", recent);
        request.setAttribute("currentPage", p);

        String ajax = request.getParameter("ajax");
        if ("true".equals(ajax)) {
            request.getRequestDispatcher("visitor/visitor.jsp").forward(request, response);
        } else {
            request.setAttribute("content", "visitor/visitor.jsp");
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

        response.sendRedirect("visitor?ajax=true");
    }
}
