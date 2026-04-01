package com.kira.pj.visitor;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "VisitorC", value = "/visitor")
public class VisitorC extends HttpServlet {

    // 화면을 보여주는 역할 (조회: Read)
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 1. DB 연동 (지금은 주석 처리된 상태 유지)
        // VisitorDAO dao = new VisitorDAO();
        // List<VisitorDTO> list = dao.getAllVisitors();
        // request.setAttribute("visitorList", list);

        // 2. 화면 설정 (파일명 앞에 /를 붙여 경로를 확실히 합니다)
        request.setAttribute("content", "/visitor.jsp");

        // 3. 포워딩 (main.jsp가 WEB-INF 밖에 있다면 아래처럼, 안에 있다면 경로 수정)
        request.getRequestDispatcher("/main.jsp").forward(request, response);
    }
    // 새로운 방문 기록을 저장하는 역할 (생성: Create)
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");

        // 1. JSP 폼에서 넘어온 데이터 받기
        String visitorName = request.getParameter("visitorName");

        // 2. [DB 로직] 오라클 DB에 INSERT 실행
        // 실제로는 아래와 같은 모양이 될 거예요.
        /*
        VisitorDTO dto = new VisitorDTO();
        dto.setvWriterId(visitorName); // 지금은 로그인 연동 전이니 입력받은 이름 사용
        dto.setvOwnerId("DongMin");    // 현재 홈피 주인

        VisitorDAO dao = new VisitorDAO();
        dao.insertVisitor(dto);
        */

        System.out.println("오라클 DB 저장 시도: " + visitorName);

        // 3. 저장이 끝나면 목록 페이지로 리다이렉트
        response.sendRedirect("/visitor");
    }
}