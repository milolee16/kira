package com.kira.pj.user;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import com.kira.pj.main.DBManager;

import javax.servlet.http.HttpServletRequest;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class UserDAO {
    public static final UserDAO DAO = new UserDAO();

    private UserDAO() {
    }

    public boolean join(HttpServletRequest request) {
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            String name = request.getParameter("name");
            String birthStr = request.getParameter("birth");
            String id = request.getParameter("id");
            String pw = request.getParameter("pw");
            String nickname = request.getParameter("nickname");

            String pk = NanoIdUtils.randomNanoId(
                    NanoIdUtils.DEFAULT_NUMBER_GENERATOR,
                    NanoIdUtils.DEFAULT_ALPHABET,
                    15
            );

            conn = DBManager.connect();

            String sql = "insert into userReg " +
                    "(u_pk, u_name, u_birth, u_id, u_pw, u_nickname, u_join_date) " +
                    "values (?, ?, ?, ?, ?, ?, sysdate)";

            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, pk);
            pstmt.setString(2, name);
            pstmt.setDate(3, Date.valueOf(birthStr));
            pstmt.setString(4, id);
            pstmt.setString(5, pw);
            pstmt.setString(6, nickname);

            return pstmt.executeUpdate() == 1;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            DBManager.close(conn, pstmt, null);
        }
    }

    public boolean isIdExists(String id) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = DBManager.connect();

            String sql = "select * from userReg where u_id = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, id);

            rs = pstmt.executeQuery();

            return rs.next();

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            DBManager.close(conn, pstmt, rs);
        }
    }

    public boolean isNicknameExists(String nickname) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = DBManager.connect();

            String sql = "select * from userReg where u_nickname = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, nickname);

            rs = pstmt.executeQuery();

            return rs.next();

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            DBManager.close(conn, pstmt, rs);
        }
    }
}