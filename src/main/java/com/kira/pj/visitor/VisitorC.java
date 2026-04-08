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

        // 프론트엔드(JS)에서 &ownerPk=XXX 형태로 홈피 주인의 PK를 반드시 보내야 한다.
        String ownerPk = request.getParameter("ownerPk");
        if (ownerPk == null || ownerPk.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // <-- 여기가 정확히 400 에러를 뱉는 곳이다.
            return;
        }

        if ("json".equals(reqType)) {
            // 방명록 탭(페이징) 목록 불러오기
            VisitorDAO dao = new VisitorDAO();
            List<VisitorDTO> list = dao.getVisitorsByPage(ownerPk, p);

            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("visitorList", list);
            resultMap.put("currentPage", p);

            Gson gson = new Gson();
            response.setContentType("application/json; charset=UTF-8");
            response.getWriter().print(gson.toJson(resultMap));

        } else if ("recent".equals(reqType)) {
            // =================================================================
            // [자동 발도장 로직 기생 지점]
            // 메인 화면 로드 시 위젯 데이터를 요청하므로, 이때 방문 기록을 몰래 생성한다.
            // =================================================================
            HttpSession session = request.getSession();
            String visitorPk = (String) session.getAttribute("loginUserPk");

            // 방문자가 로그인한 상태이고, 내 홈피를 들어온 것이 아닐 때만 발도장을 찍는다.
            if (visitorPk != null && !visitorPk.equals(ownerPk)) {
                try {
                    VisitorDTO vDto = new VisitorDTO();
                    vDto.setV_writer_pk(visitorPk);
                    vDto.setV_owner_pk(ownerPk);
                    vDto.setV_emoji(1); // 자동 방문은 기본 이모지(1)로 고정

                    VisitorDAO vDao = new VisitorDAO();
                    vDao.upsertVisitor(vDto);
                } catch (Exception e) {
                    System.err.println("자동 방문 기록 생성 실패: " + e.getMessage());
                }
            }

            // 자동 방문 기록 처리가 끝난 후, 최신 상태의 리스트를 DB에서 꺼내 반환한다.
            VisitorDAO dao = new VisitorDAO();
            List<VisitorDTO> recentList = dao.getRecentVisitors(ownerPk);

            Gson gson = new Gson();
            response.setContentType("application/json; charset=UTF-8");
            response.getWriter().print(gson.toJson(recentList));

        } else if ("hitCount".equals(reqType)) {
            // [조회수 요청 처리]
            VisitorDAO dao = new VisitorDAO();
            Map<String, Integer> hitCount = dao.getHitCount(ownerPk);

            Gson gson = new Gson();
            response.setContentType("application/json; charset=UTF-8");
            response.getWriter().print(gson.toJson(hitCount));

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

        // 1. 세션에서 로그인한 사용자의 PK 추출 (글 작성 권한 확인)
        HttpSession session = request.getSession();
        String writerPk = (String) session.getAttribute("loginUserPk");

        if (writerPk == null || writerPk.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("로그인이 필요합니다.");
            return;
        }

        // 2. 방명록 등록 처리를 위한 파라미터 수신
        String ownerPk = request.getParameter("ownerPk");
        String visitorEmojiStr = request.getParameter("visitorEmoji");

        if (ownerPk != null && !ownerPk.trim().isEmpty() && visitorEmojiStr != null) {
            try {
                int emojiInt = Integer.parseInt(visitorEmojiStr);

                VisitorDTO dto = new VisitorDTO();
                dto.setV_writer_pk(writerPk);
                dto.setV_owner_pk(ownerPk);
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
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        }
    }
}