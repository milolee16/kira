package com.kira.pj.visitor;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet( value = "/visitorDel")
public class VisitorDelC extends HttpServlet {

    // 화면을 보여주는 역할 (조회: Read)
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String vIdStr = request.getParameter("vId");

        // 만약 파라미터에 vId가 넘어왔다면 삭제 로직 실행
        if (vIdStr != null) {
            int vId = Integer.parseInt(vIdStr);
            VisitorDAO dao = new VisitorDAO();
            dao.deleteVisitor(vId);

            // 삭제 후 깔끔하게 목록으로 리다이렉트 (새로고침 시 중복삭제 방지)
            response.sendRedirect("visitor");
            return;
        }

        // 기존 조회 로직 (vId가 없을 때 실행)
        VisitorDAO dao = new VisitorDAO();
        List<VisitorDTO> list = dao.getAllVisitors("DongMin");
        request.setAttribute("visitorList", list);
        request.setAttribute("content", "visitor/visitor.jsp");
        request.getRequestDispatcher("index.jsp").forward(request, response);
    }
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}