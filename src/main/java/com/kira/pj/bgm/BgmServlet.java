package com.kira.pj.bgm;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.List;
import com.google.gson.Gson;

@WebServlet(name = "BgmServlet", value = "/api/bgm")
public class BgmServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {

        // userId 파라미터 받기 (없으면 기본값 1)
        String userIdStr = request.getParameter("userId");
        int userId = (userIdStr == null) ? 1 : Integer.parseInt(userIdStr);

        List<BgmTrackVO> tracks = new BgmDAO().getTracksByUser(userId);

        response.setContentType("application/json; charset=UTF-8");
        new Gson().toJson(tracks, response.getWriter());
    }

    public void destroy() {
    }
}