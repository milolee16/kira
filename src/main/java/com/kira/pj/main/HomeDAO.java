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
        int random_qna = (int)(Math.random() * 20) + 1;
        try{
            con = DBManager.connect();
            ps = con.prepareStatement("select question from qna_list where q_id = ?");
            ps.setInt(1,random_qna);
            rs = ps.executeQuery();
            if(rs.next()) {
                request.setAttribute("question",rs.getString("question"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            DBManager.close(con,ps,rs);
        }


    }
}
