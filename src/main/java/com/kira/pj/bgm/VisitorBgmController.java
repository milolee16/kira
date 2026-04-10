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

        String inputVal = req.getParameter("ownerPk");

        // 1. ID를 PK로 변환 (질문자님의 DAO 함수 활용)
        String realPk = UserDAO.DAO.getPkById(inputVal);

        // 2. 검색 결과가 없으면(이미 PK거나 없는 ID) 원본값 사용
        if (realPk == null) {
            realPk = inputVal;
        }

        // 3. 확실해진 PK로 목록 조회
        List<BgmTrackVO> list = BgmDAO.MDAO.getTracksByUser(realPk);

        resp.getWriter().print(new Gson().toJson(list));
    }
}