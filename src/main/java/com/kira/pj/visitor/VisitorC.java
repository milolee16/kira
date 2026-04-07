package com.kira.pj.visitor;

import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/visitor")
public class VisitorC extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String ajax = request.getParameter("ajax");
        String reqType = request.getParameter("reqType");
        String pStr = request.getParameter("p");
        int p = (pStr == null) ? 1 : Integer.parseInt(pStr);

        // TODO: 향후 단일 서비스가 아닌 다중 회원 서비스로 확장할 경우,
        // 하드코딩된 "DongMin"을 request.getParameter("ownerId") 등으로 받아와야 합니다.
        String ownerId = "DongMin";

        if ("json".equals(reqType)) {
            VisitorDAO dao = new VisitorDAO();
            List<VisitorDTO> list = dao.getVisitorsByPage(ownerId, p);

            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("visitorList", list);
            resultMap.put("currentPage", p);

            Gson gson = new Gson();
            response.setContentType("application/json; charset=UTF-8");
            response.getWriter().print(gson.toJson(resultMap));

        } else if ("recent".equals(reqType)) {
            VisitorDAO dao = new VisitorDAO();
            List<VisitorDTO> recentList = dao.getRecentVisitors(ownerId);

            Gson gson = new Gson();
            response.setContentType("application/json; charset=UTF-8");
            response.getWriter().print(gson.toJson(recentList));

        } else if ("true".equals(ajax)) {
            request.getRequestDispatcher("visitor/visitor.jsp").forward(request, response);

        } else {
            request.setAttribute("content", "visitor/visitor.jsp");
            request.getRequestDispatcher("index.jsp").forward(request, response);
        }
    }

    // ... (전략) ...
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");

        String visitorName = request.getParameter("visitorName");
        String visitorEmojiStr = request.getParameter("visitorEmoji");
        String ownerId = request.getParameter("ownerId");

        // [추가] 클라이언트의 IP 주소 추출
        // 로드밸런서나 프록시 환경(Nginx 등)을 거쳐올 경우 X-Forwarded-For 헤더를 확인해야 함
        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getRemoteAddr();
        }

        if (visitorName != null && !visitorName.trim().isEmpty() &&
                visitorEmojiStr != null && ownerId != null) {

            try {
                int emojiInt = Integer.parseInt(visitorEmojiStr);

                VisitorDTO dto = new VisitorDTO();
                dto.setV_writer_id(visitorName.trim());
                dto.setV_owner_id(ownerId);
                dto.setV_emoji(emojiInt);
                dto.setV_ip(clientIp); // [추가] DTO에 IP 세팅

                VisitorDAO dao = new VisitorDAO();
                int result = dao.upsertVisitor(dto);

                if (result > 0) {
                    response.setStatus(HttpServletResponse.SC_OK);
                    response.getWriter().print("success");
                } else {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                }

            } catch (Exception e) {
                e.printStackTrace();
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        } else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        }
    }}