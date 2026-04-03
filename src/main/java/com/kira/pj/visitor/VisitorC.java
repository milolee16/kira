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

        String ajax = request.getParameter("ajax");       // 기존: 탭 메뉴 이동용
        String reqType = request.getParameter("reqType"); // 신규: JSON 데이터 요청용
        String pStr = request.getParameter("p");
        int p = (pStr == null) ? 1 : Integer.parseInt(pStr);

        if ("json".equals(reqType)) {
            // [1] 방명록 화면 안에서 JS(fetch)가 데이터만 요청할 때 -> JSON 반환
            VisitorDAO dao = new VisitorDAO();
            List<VisitorDTO> list = dao.getVisitorsByPage("DongMin", p);

            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("visitorList", list);
            resultMap.put("currentPage", p);

            Gson gson = new Gson();
            String jsonResponse = gson.toJson(resultMap);

            response.setContentType("application/json; charset=UTF-8");
            response.getWriter().print(jsonResponse);

        } else if ("true".equals(ajax)) {
            // [2] 방명록 탭 메뉴를 클릭했을 때 -> HTML 알맹이(visitor.jsp) 반환 (원상복구)
            request.getRequestDispatcher("visitor/visitor.jsp").forward(request, response);

        } else {
            // [3] 브라우저 주소창에 직접 쳐서 들어왔을 때 -> 전체 페이지(index.jsp) 반환
            request.setAttribute("content", "visitor/visitor.jsp");
            request.getRequestDispatcher("index.jsp").forward(request, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // 기존 작성하신 비동기 POST 코드 그대로 유지! (수정 없음)
        request.setCharacterEncoding("UTF-8");
        String visitorName = request.getParameter("visitorName");

        if (visitorName != null && !visitorName.trim().isEmpty()) {
            VisitorDTO dto = new VisitorDTO();
            dto.setV_writer_id(visitorName);
            dto.setV_owner_id("DongMin");
            dto.setV_emoji((int) (Math.random() * 5) + 1);

            VisitorDAO dao = new VisitorDAO();
            dao.insertVisitor(dto);

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().print("success");
        } else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        }
    }
}