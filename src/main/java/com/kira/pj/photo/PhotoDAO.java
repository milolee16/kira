package com.kira.pj.photo;

import com.kira.pj.main.DBManager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

public class PhotoDAO {
    public static final PhotoDAO PDAO = new PhotoDAO();

    public ArrayList<String> getJson() {

        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        String sql = "select * from photo";
        try {
           conn = DBManager.connect();
           ps = conn.prepareStatement(sql);
           rs = ps.executeQuery();
           ArrayList<String> photos = new ArrayList<>();
           PhotoDTO photo = new  PhotoDTO();
           while (rs.next()) {
               photo.setUserId(rs.getString(2));
               photo.setImgName(rs.getString(3));
               photo.setTitle(rs.getString(4));
               photo.setContent(rs.getString(5));
               photo.setRegDate(rs.getString(6));
               photos.add(photo.toJSON());

           }
            System.out.println(photos);
            return photos;
        } catch (Exception e) {
            e.printStackTrace();

        } finally {
            DBManager.close(conn, ps, rs);
        }
        return null;
    }
}
