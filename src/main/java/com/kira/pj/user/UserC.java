package com.kira.pj.user;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "UserC", value = "/user")
public class UserC extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    }

    public void destroy() {
    }
}