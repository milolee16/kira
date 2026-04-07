package com.kira.pj.visitor;

import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
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

        // [핵심 수정] 하드코딩 제거. 이제 프론트엔드(JS)에서 &ownerPk=XXX 형태로 홈피 주인의 PK를 반드시 보내야 한다.
        String ownerPk = request.getParameter("ownerPk");

        // 만약 프론트에서 누구의 홈피인지 보내주지 않았다면 에러 처리
        if (ownerPk == null || ownerPk.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        if ("json".equals(reqType)) {
            VisitorDAO dao = new VisitorDAO();
            // TODO: DAO의 getVisitorsByPage 메서드도 ownerId 대신 ownerPk를 받도록 수정된 상태여야 함
            List<VisitorDTO> list = dao.getVisitorsByPage(ownerPk, p);

            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("visitorList", list);
            resultMap.put("currentPage", p);

            Gson gson = new Gson();
            response.setContentType("application/json; charset=UTF-8");
            response.getWriter().print(gson.toJson(resultMap));

        } else if ("recent".equals(reqType)) {
            VisitorDAO dao = new VisitorDAO();
            List<VisitorDTO> recentList = dao.getRecentVisitors(ownerPk);

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

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");

        // 1. [철통 보안] 세션에서 로그인한 사용자의 PK를 꺼낸다.
        HttpSession session = request.getSession();
        String writerPk = (String) session.getAttribute("loginUserPk");

        // 로그인을 안 했거나 세션이 만료된 사용자의 접근 차단 (401 Unauthorized)
        if (writerPk == null || writerPk.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("로그인이 필요합니다.");
            return;
        }

        // 2. 클라이언트에서는 방명록 주인의 PK와 이모지 값만 보내면 된다. (이름, IP 수집 폐기)
        String ownerPk = request.getParameter("ownerPk");
        String visitorEmojiStr = request.getParameter("visitorEmoji");

        if (ownerPk != null && !ownerPk.trim().isEmpty() && visitorEmojiStr != null) {
            try {
                int emojiInt = Integer.parseInt(visitorEmojiStr);

                VisitorDTO dto = new VisitorDTO();
                dto.setV_writer_pk(writerPk); // 세션에서 꺼낸 확실한 내 신분증
                dto.setV_owner_pk(ownerPk);   // 누구의 홈피에 글을 남기는지
                dto.setV_emoji(emojiInt);

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
            // 필수 파라미터 누락
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        }
    }
}