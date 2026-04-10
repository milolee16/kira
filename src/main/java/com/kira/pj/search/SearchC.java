package com.kira.pj.search;

import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "SearchC", value = "/search-users")
public class SearchC extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        response.setContentType("application/json;charset=UTF-8");
        Gson gson = new Gson();
        String searchRes = gson.toJson(SearchDAO.searchUsers(request));
        response.getWriter().println(searchRes);


    }

    public void destroy() {
    }
}