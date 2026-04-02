package com.kira.pj.bgm;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import com.google.gson.Gson;

@WebServlet(name = "BgmServlet", value = "/bgm-ser")
public class BgmServlet extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        List<BgmTrackVO> tracks = new BgmDAO().getAllTracks();

        response.setContentType("application/json; charset=UTF-8");
        new Gson().toJson(tracks, response.getWriter());
    }

    public void destroy() {
    }
}