package com.kira.pj.photo;

import com.kira.pj.main.SupabaseModel;

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
        response.getWriter().println(PhotoDAO.PDAO.getJson());

    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
//        SupabaseModel.uploadSupabase(request);
        response.getWriter().println(PhotoDAO.PDAO.updatePhoto(request));
    }

    public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

    }

    public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

    }

    public void destroy() {
    }
}