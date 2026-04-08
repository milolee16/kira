package com.kira.pj.search;

import com.kira.pj.main.DBManager;

import javax.servlet.http.HttpServletRequest;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

public class SearchDAO {


    public static ArrayList<String> searchUsers(HttpServletRequest request) {
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        String sql = "select * from userreg where u_name like '%'||?||'%' or u_nickname like '%'||?||'%' or u_email like '%'||?||'%'";
        try {
            String keyword = request.getParameter("keyword");
            con = DBManager.connect();
            ps = con.prepareStatement(sql);
            ps.setString(1, keyword);
            ps.setString(2, keyword);
            ps.setString(3, keyword);
            rs = ps.executeQuery();
            SearchVO user = null;
            ArrayList<String> searchResult = new ArrayList<>();
            while (rs.next()) {
                user = new SearchVO();
                user.setU_id(rs.getString("u_id"));
                user.setU_name(rs.getString("u_name"));
                user.setU_nickname(rs.getString("u_nickname"));
                user.setU_email(rs.getString("u_email"));


                searchResult.add(user.toJSON());
            }
            return searchResult;

        }catch (Exception e){
            e.printStackTrace();
        }finally {
            DBManager.close(con,ps,rs);
        }
        return null;
    }

    public static SMainVO searchMain(HttpServletRequest request) {

        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        String host_id = request.getParameter("host_id");
        if (host_id == null || host_id.isEmpty()) {
            host_id = (String) request.getAttribute("host_id");
        }

        String sql = "select * from main_test where host_id = ?";
        try {
            con = DBManager.connect();
            ps = con.prepareStatement(sql);
            ps.setString(1, host_id);
            rs = ps.executeQuery();
            SMainVO main = null;

            if (rs.next()) {
                main = new SMainVO();
                main.setHost_id(rs.getString("host_id"));
                main.setHompy_title(rs.getString("hompy_title"));
                main.setSt_message(rs.getString("st_message"));
                main.setMy_img(rs.getString("my_img"));
                main.setMain_img(rs.getString("main_img"));
                main.setSt_date(rs.getString("st_date"));
                System.out.println(main);

            }
            return main;

        }catch (Exception e){
            e.printStackTrace();
        }finally {
            DBManager.close(con,ps,rs);
        }
        return null;
    }
}
