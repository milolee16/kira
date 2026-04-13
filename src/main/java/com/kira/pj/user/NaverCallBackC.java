package com.kira.pj.user;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet("/oauth/naver/callback")
public class NaverLoginCallbackC extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        String code = request.getParameter("code");
        String state = request.getParameter("state");

        HttpSession session = request.getSession(false);
        String savedState = (session != null) ? (String) session.getAttribute("naverState") : null;

        if (savedState == null || !savedState.equals(state)) {
            response.setContentType("text/plain; charset=UTF-8");
            response.getWriter().print("잘못된 접근입니다. state 불일치");
            return;
        }

        String accessToken = NaverLoginDAO.getAccessToken(code, state);
        NaverUserVO user = NaverLoginDAO.getUserInfo(accessToken);

        String userPk = NaverLoginDAO.loginOrJoin(user);

        HttpSession loginSession = request.getSession();
        loginSession.setAttribute("loginUserPk", userPk);
        loginSession.setAttribute("loginUserName", user.getName());
        loginSession.setAttribute("loginUserId", user.getId());
        loginSession.setAttribute("loginUserNickname", user.getNickname());
        loginSession.setAttribute("loginUserEmail", user.getEmail());
        loginSession.setMaxInactiveInterval(30 * 60);
        loginSession.removeAttribute("naverState");

        response.sendRedirect(request.getContextPath() + "/main");
    }
}
