package com.kira.pj.visitor;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.kira.pj.main.DBManager;

public class VisitorDAO {

    // 1. 발도장 찍기 (C)
    public int insertVisitor(VisitorDTO dto) {
        Connection con = null;
        PreparedStatement pstmt = null;
        String sql = "INSERT INTO visitor_log (v_writer_id, v_owner_id, v_emoji) VALUES (?, ?, ?)";

        try {
            con = DBManager.connect();
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, dto.getV_writer_id());
            pstmt.setString(2, dto.getV_owner_id());
            pstmt.setInt(3, dto.getV_emoji());

            return pstmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        } finally {
            DBManager.close(con, pstmt, null);
        }
    }

    // 2. 전체 방문자 목록 조회 (R)
    public List<VisitorDTO> getAllVisitors(String ownerId) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<VisitorDTO> list = new ArrayList<>();

        String sql = "SELECT v_id, v_writer_id, v_owner_id, v_emoji, " +
                "TO_CHAR(v_date, 'MM.DD AM HH12:MI') as v_date_fmt " +
                "FROM visitor_log WHERE v_owner_id = ? ORDER BY v_date DESC";
        try {
            con = DBManager.connect();
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, ownerId);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                VisitorDTO v = new VisitorDTO();
                v.setV_id(rs.getInt("v_id"));
                v.setV_writer_id(rs.getString("v_writer_id"));
                v.setV_date(rs.getString("v_date_fmt"));
                v.setV_emoji(rs.getInt("v_emoji"));
                list.add(v);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, pstmt, rs);
        }
        return list;
    }

    // 3. 메인 위젯용 최근 방문자 조회 (R)
    public List<VisitorDTO> getRecentVisitors(String ownerId) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<VisitorDTO> list = new ArrayList<>();

        String sql = "SELECT v_id, v_writer_id, v_owner_id, v_emoji, " +
                "TO_CHAR(v_date, 'MM.DD AM HH12:MI') as v_date_fmt " +
                "FROM visitor_log WHERE v_owner_id = ? ORDER BY v_date DESC";

        try {
            con = DBManager.connect();
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, ownerId);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                VisitorDTO v = new VisitorDTO();
                v.setV_writer_id(rs.getString("v_writer_id"));
                v.setV_date(rs.getString("v_date_fmt"));
                list.add(v);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, pstmt, rs);
        }
        return list;
    }

    // 4. 방문 기록 삭제 (D)
    public int deleteVisitor(int vId) {
        Connection con = null;
        PreparedStatement pstmt = null;
        String sql = "DELETE FROM visitor_log WHERE v_id = ?";

        try {
            con = DBManager.connect();
            pstmt = con.prepareStatement(sql);
            pstmt.setInt(1, vId);

            return pstmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        } finally {
            DBManager.close(con, pstmt, null);
        }
    }

    // 5. 페이지네이션 조회 (R)
    public List<VisitorDTO> getVisitorsByPage(String ownerId, int page) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<VisitorDTO> list = new ArrayList<>();

        int start = (page - 1) * 7 + 1;
        int end = page * 7;

        String sql = "SELECT * FROM (" +
                "  SELECT rownum as rn, t.* FROM (" +
                "    SELECT v_id, v_writer_id, v_emoji, TO_CHAR(v_date, 'MM.DD AM HH12:MI') as v_date_fmt " +
                "    FROM visitor_log WHERE v_owner_id = ? ORDER BY v_date DESC" +
                "  ) t" +
                ") WHERE rn BETWEEN ? AND ?";

        try {
            con = DBManager.connect();
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, ownerId);
            pstmt.setInt(2, start);
            pstmt.setInt(3, end);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                VisitorDTO v = new VisitorDTO();
                v.setV_id(rs.getInt("v_id"));
                v.setV_writer_id(rs.getString("v_writer_id"));
                v.setV_date(rs.getString("v_date_fmt"));
                v.setV_emoji(rs.getInt("v_emoji"));
                list.add(v);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, pstmt, rs);
        }
        return list;
    }
}