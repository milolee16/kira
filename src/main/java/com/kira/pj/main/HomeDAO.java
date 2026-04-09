package com.kira.pj.main;

import com.kira.pj.search.SearchDAO;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class HomeDAO {
    public static String RandomQ(HttpServletRequest request, HttpServletResponse response) {

        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;


        int random_qna = (int)(Math.random() * 20) + 1;
        try{
            con = DBManager.connect();
            ps = con.prepareStatement("select question from qna_list where q_id = ?");
            ps.setInt(1,random_qna);
            rs = ps.executeQuery();
            String question = null;
            if(rs.next()) {
                question = rs.getString(2);
                return question;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            DBManager.close(con,ps,rs);
        }
        return null;

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
