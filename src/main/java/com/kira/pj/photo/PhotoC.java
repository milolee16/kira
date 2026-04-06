package com.kira.pj.photo;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "PhotoC", value = "/photo-data")
public class PhotoC extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // DB에서 가져온 데이터라고 가정 (객체 리스트)
        // 실제로는 PhotoDAO.getList() 같은걸 쓰겠지?
        String jsonResponse = "[" +
                "{\"userId\":\"user1\", \"imgName\":\"pic1.jpg\", \"title\":\"남산타워에서\"}," +
                "{\"userId\":\"user2\", \"imgName\":\"pic2.jpg\", \"title\":\"코딩 중 졸림\"}" +
                "]";

        response.getWriter().write(jsonResponse);
//        request.getRequestDispatcher("photo/photo.jsp").forward(request, response);

    }

    public void destroy() {
    }
}