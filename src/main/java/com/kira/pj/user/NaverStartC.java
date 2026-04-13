package com.kira.pj.user;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.UUID;

@WebServlet("/oauth/naver/start")
public class NaverLoginStartC extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        String clientId = "여기에_네이버_Client_ID";
        String redirectUri = URLEncoder.encode(
                "http://localhost:8080/프로젝트명/oauth/naver/callback", "UTF-8"
        );

        String state = UUID.randomUUID().toString();

        request.getSession().setAttribute("naverState", state);

        String apiURL = "https://nid.naver.com/oauth2.0/authorize?response_type=code"
                + "&client_id=" + clientId
                + "&redirect_uri=" + redirectUri
                + "&state=" + state;

        response.sendRedirect(apiURL);
    }
}