package com.kira.pj.main;

import com.kira.pj.search.SearchDAO;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class HomeDAO {
    public static void mainCheck(HttpServletRequest request, HttpServletResponse response) {

        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        // ⭐ 1. 세션과 파라미터 확인 (추가된 핵심 코드)
        HttpSession hs = request.getSession();
        String host_id = request.getParameter("host_id");

        // ⭐ 2. 철벽 방어: 넘어온 아이디가 없으면 '내 홈피'이므로 내 아이디로 덮어쓰기!
        if (host_id == null || host_id.isEmpty() || host_id.equals("null")) {
            host_id = (String) hs.getAttribute("loginUserId");
        }
        request.setAttribute("host_id", host_id);

        int random_qna = (int)(Math.random() * 20) + 1;
        try{
            con = DBManager.connect();
            ps = con.prepareStatement("select question from qna_list where q_id = ?");
            ps.setInt(1,random_qna);
            rs = ps.executeQuery();
            if(rs.next()) {
                request.setAttribute("question",rs.getString("question"));
            }
            request.setAttribute("searchMain",SearchDAO.searchMain(request));
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            DBManager.close(con,ps,rs);
        }


    }

    public static void editStMessage(HttpServletRequest request, HttpServletResponse response) {

        Connection con = null;
        PreparedStatement ps = null;
        String host_id  = request.getParameter("host_id");
        String editStM = request.getParameter("editStM");
        String sql = "update main_test set st_message = ? where host_id = ?";
        try{
            con = DBManager.connect();
            ps = con.prepareStatement(sql);
            ps.setString(1,editStM);
            ps.setString(2,host_id);
            if(ps.executeUpdate() == 1) {
                System.out.println("상태 메세지 수정 성공");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            DBManager.close(con,ps,null);
        }


    }
}
