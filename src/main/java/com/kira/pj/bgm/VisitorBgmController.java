package com.kira.pj.bgm;

import com.google.gson.Gson;
import com.kira.pj.user.UserDAO;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet(name = "VisitorBgmController", value = "/api/visitor/bgm")
public class VisitorBgmController extends HttpServlet {


    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json;charset=UTF-8");

        // JS에서 sessionStorage.getItem("currentHostId")로 보낸 값 (ID일 확률 높음)
        String inputVal = req.getParameter("ownerPk");

        // 1. 먼저 이 값이 ID라고 가정하고 PK를 찾아본다.
        String realPk = UserDAO.DAO.getPkById(inputVal);

        // 2. 만약 realPk가 null이면, 이미 PK를 보냈거나 잘못된 아이디인 것.
        // 그럴 땐 그냥 원본값을 사용한다.
        if (realPk == null) {
            realPk = inputVal;
        }

        // 3. 이제 확실해진 PK로 DAO를 호출한다.
        List<BgmTrackVO> list = BgmDAO.MDAO.getTracksByUser(realPk);

        resp.getWriter().print(new Gson().toJson(list));
    }
}