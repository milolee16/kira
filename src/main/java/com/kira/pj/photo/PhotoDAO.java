package com.kira.pj.photo;

import com.kira.pj.main.DBManager;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

public class PhotoDAO {
    public static final PhotoDAO PDAO = new PhotoDAO();

    public ArrayList<String> getJson(HttpServletRequest request) {

        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        String sql = "select * from photo where user_id = ? order by reg_date desc ";
        String hostId = request.getParameter("host_id");
        if (hostId == null || hostId.isEmpty()) {
            HttpSession session = request.getSession();
            hostId = session.getAttribute("loginUserId").toString();
        }

        try {
            conn = DBManager.connect();
            ps = conn.prepareStatement(sql);
            ps.setString(1, hostId);
            rs = ps.executeQuery();
            ArrayList<String> photos = new ArrayList<>();
            PhotoDTO photo = new PhotoDTO();
            while (rs.next()) {
                photo.setUserId(rs.getString(2));
                photo.setImgName(rs.getString(3));
                photo.setTitle(rs.getString(4));
                photo.setContent(rs.getString(5));
                photo.setRegDate(rs.getString(6));
                photos.add(photo.toJSON());

            }
            System.out.println(photos);
            System.out.println(hostId);
            return photos;
        } catch (Exception e) {
            e.printStackTrace();

        } finally {
            DBManager.close(conn, ps, rs);
        }
        return null;
    }

    public int updatePhoto(HttpServletRequest request) {
        String title = request.getParameter("title");
        String content = request.getParameter("content");
        String imgName = request.getParameter("imgName");

        Connection conn = null;
        PreparedStatement ps = null;
        String sql = "insert into photo values(photo_seq.nextval, ? , ? , ? , ? ,sysdate)";
        try {
            conn = DBManager.connect();
            ps = conn.prepareStatement(sql);
            HttpSession session = request.getSession();
            ps.setString(1, session.getAttribute("loginUserId").toString());
            ps.setString(2, imgName);
            ps.setString(3, title);
            ps.setString(4, content);
            return ps.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();

        } finally {
            DBManager.close(conn, ps, null);
        }
        return 0;
    }

    public int deletePhoto(HttpServletRequest request) {
        String imgName = request.getParameter("imgName");

        Connection conn = null;
        PreparedStatement ps = null;
        String sql = "delete from photo where img_name = ? and user_id = ?";
        try {
            conn = DBManager.connect();
            ps = conn.prepareStatement(sql);
            ps.setString(1, imgName);
            HttpSession session = request.getSession();
            ps.setString(2, session.getAttribute("loginUserId").toString());
            return ps.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();

        } finally {
            DBManager.close(conn, ps, null);
        }
        return 0;

    }

//    public int updateProfile(HttpServletRequest request) {
//        String imgUrl = request.getParameter("imgUrl");
//        System.out.println("받은 이미지 URL: " + imgUrl);
//        Connection conn = null;
//        PreparedStatement ps = null;
//        String sql = "insert into profile values(? , ?)";
//        try {
//            conn = DBManager.connect();
//            ps = conn.prepareStatement(sql);
//            HttpSession session = request.getSession();
//            ps.setString(1, session.getAttribute("loginUserId").toString());
//            ps.setString(2, imgUrl);
//            session.setAttribute("loginUserProfileImg", imgUrl);
//            return ps.executeUpdate();
//
//
//
//        } catch (Exception e) {
//            e.printStackTrace();
//
//        } finally {
//            DBManager.close(conn, ps, null);
//        }
//        return 0;
//    }

    public int updateProfile(HttpServletRequest request) {
        String imgUrl = request.getParameter("imgUrl");
        System.out.println("받은 이미지 URL: " + imgUrl);

        Connection conn = null;
        PreparedStatement ps = null;

        try {
            conn = DBManager.connect();
            HttpSession session = request.getSession();
            String userId = session.getAttribute("loginUserId").toString();

            // 1. 먼저 UPDATE를 시도합니다. (기존 프사가 있는 유저)
            String updateSql = "UPDATE profile SET profile_img_url = ? WHERE userid = ?";
            ps = conn.prepareStatement(updateSql);
            ps.setString(1, imgUrl);
            ps.setString(2, userId);

            int result = ps.executeUpdate();
            System.out.println("profile update");

            // 2. 만약 result가 0이라면? (기존 프사가 없어서 UPDATE된 항목이 없음 = 처음 프사 올리는 유저)
            if (result == 0) {
                ps.close(); // 쓰던 PreparedStatement 닫아주고

                // 기존에 쓰시던 쿼리로 새로 INSERT 해줍니다.
                String insertSql = "insert into profile values(? , ?)";
                ps = conn.prepareStatement(insertSql);
                ps.setString(1, userId);
                ps.setString(2, imgUrl);

                result = ps.executeUpdate();
                System.out.println("profile add");
            }

            // 3. DB 저장이 성공(1)했다면 세션도 갱신해줍니다.
            if (result > 0) {
                session.setAttribute("loginUserProfileImg", imgUrl);
            }

            return result;

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(conn, ps, null);
        }

        return 0;
    }
}

