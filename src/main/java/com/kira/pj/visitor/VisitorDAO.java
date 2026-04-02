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
        // 오라클에서는 시퀀스나 IDENTITY를 쓰므로 v_id는 제외하고 넣습니다.
        String sql = "INSERT INTO visitor_log (v_writer_id, v_owner_id, v_emoji) VALUES (?, ?, ?)";

        try {
            con = DBManager.connect(); // DBCP 풀에서 연결 가져오기
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, dto.getV_writer_id());
            pstmt.setString(2, dto.getV_owner_id());
            pstmt.setInt(3, dto.getV_emoji());

            return pstmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        } finally {
            // 제공해주신 close 메서드 활용 (순서: con, pstmt, rs)
            DBManager.close(con, pstmt, null);
        }
    }

    // 2. 전체 방문자 목록 조회 (R)
    public List<VisitorDTO> getAllVisitors(String ownerId) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<VisitorDTO> list = new ArrayList<>();

        // 최신순으로 정렬
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
<<<<<<< HEAD
                v.setV_writer_id(rs.getString("v_writer_id"));
                // SQL 별칭인 v_date_fmt로 가져와야 포맷팅된 날짜가 들어갑/니다.
                v.setV_date(rs.getString("v_date_fmt"));
=======
                v.setV_id(rs.getInt("v_id"));
                v.setV_writer_id(rs.getString("v_writer_id"));
                v.setV_date(rs.getString("v_date_fmt"));
                v.setV_emoji(rs.getInt("v_emoji")); // 이 줄이 있어야 JSP에서 이모티콘 번호를 인식합니다.
>>>>>>> f8d958458667e0f848b3c80b9cac4c303a8163f4
                list.add(v);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, pstmt, rs);
        }
        return list;
    }

    // 3. 메인 위젯용 최근 방문자 5명만 조회 (R)
<<<<<<< HEAD
    public List<VisitorDTO> getRecentVisitors(String ownerId) {
=======
    public List<VisitorDTO> showVisitors(String ownerId) {
>>>>>>> f8d958458667e0f848b3c80b9cac4c303a8163f4
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<VisitorDTO> list = new ArrayList<>();

        // 오라클 12c 이상에서 사용하는 최상위 5행 추출 문법
        String sql = "SELECT v_id, v_writer_id, v_owner_id, v_emoji, " +
                "TO_CHAR(v_date, 'MM.DD AM HH12:MI') as v_date_fmt " + // 포맷팅 추가
                "FROM visitor_log WHERE v_owner_id = ? ORDER BY v_date DESC";

        try {
            con = DBManager.connect();
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, ownerId);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                VisitorDTO v = new VisitorDTO();
                v.setV_writer_id(rs.getString("v_writer_id"));
                v.setV_date(rs.getString("v_date"));
                list.add(v);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, pstmt, rs);
        }
        return list;
    }
<<<<<<< HEAD
}
=======

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

    public List<VisitorDTO> getVisitorsByPage(String ownerId, int page) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<VisitorDTO> list = new ArrayList<>();

        // 7개씩 보여주기 설정
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
>>>>>>> f8d958458667e0f848b3c80b9cac4c303a8163f4
