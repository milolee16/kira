package com.kira.pj.main;

import com.google.gson.Gson;
import com.kira.pj.search.SearchDAO;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "Home", value = "/home")
public class Home extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

        String host_id = request.getParameter("host_id");
        if (host_id == null || host_id.equals("undefined") || host_id.isEmpty()) {
            host_id = (String) request.getSession().getAttribute("loginUserId");
        }

        request.setAttribute("pageOwnerId", host_id);

        // 여기서 "dailyQna" 라는 이름으로 담아줘야 JSP에서 ${dailyQna.question} 으로 꺼내 쓸 수 있습니다.
        request.setAttribute("dailyQna", HomeDAO.getDailyQnA(request));

        request.setAttribute("searchMain", SearchDAO.searchMain(request));
        request.getRequestDispatcher("/main.jsp").forward(request, response);


    }

    public void destroy() {
    }
}