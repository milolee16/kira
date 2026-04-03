package com.kira.pj.bgm;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet(name = "BGMC", value = "/bgm")
public class BGMC extends HttpServlet {

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        request.getRequestDispatcher("bgm/bgm.jsp").forward(request, response);

        /*

        // 나중에 로그인 붙이면 session에서 꺼내면 됨
        // String userId = (String) req.getSession().getAttribute("userId");
        String userId = request.getParameter("userId");
        if (userId == null || userId.isEmpty()) userId = "dongmin"; // 임시

        List<BgmTrackVO> tracks = new BgmDAO().getTracksByUser(userId);

        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < tracks.size(); i++) {
            BgmTrackVO t = tracks.get(i);
            json.append("{")
                    .append("\"title\":\"").append(t.getTitle()).append("\",")
                    .append("\"youtubeId\":\"").append(t.getYoutubeId()).append("\",")
                    .append("\"duration\":").append(t.getDuration())
                    .append("}");
            if (i < tracks.size() - 1) json.append(",");
        }
        json.append("]");

        response.setContentType("application/json; charset=UTF-8");
        response.getWriter().write(json.toString());

        */

    }

    public void destroy() {
    }
}