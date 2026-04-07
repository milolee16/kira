package com.kira.pj.visitor;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.kira.pj.main.DBManager;

public class VisitorDAO {

    // 1. 발도장 찍기 및 갱신 (Upsert) - 에러 해결 완벽 반영
    public int upsertVisitor(VisitorDTO dto) {
        Connection con = null;
        PreparedStatement pstmt = null;

        // [핵심 변경 사항] ON 절에 v_ip = ? 조건이 추가됨.
        // 이제 "이름도 같고, IP도 같고, 오늘 날짜"여야만 동일인물로 판단합니다.
        String sql =
                "MERGE INTO visitor_log " +
                        "USING dual " +
                        "ON (v_writer_id = ? AND v_ip = ? AND v_owner_id = ? AND TRUNC(v_date) = TRUNC(SYSDATE)) " +
                        "WHEN MATCHED THEN " +
                        "    UPDATE SET v_emoji = ? " +
                        "WHEN NOT MATCHED THEN " +
                        "    INSERT (v_id, v_writer_id, v_owner_id, v_emoji, v_date, v_ip) " +
                        "    VALUES (visitor_seq.NEXTVAL, ?, ?, ?, SYSDATE, ?)";

        try {
            con = DBManager.connect();
            pstmt = con.prepareStatement(sql);

            // ON 절 파라미터 (동명 3인 방지용 식별 근거)
            pstmt.setString(1, dto.getV_writer_id());
            pstmt.setString(2, dto.getV_ip()); // 새로 추가된 IP 조건
            pstmt.setString(3, dto.getV_owner_id());

            // MATCHED 절 파라미터
            pstmt.setInt(4, dto.getV_emoji());

            // NOT MATCHED 절 파라미터
            pstmt.setString(5, dto.getV_writer_id());
            pstmt.setString(6, dto.getV_owner_id());
            pstmt.setInt(7, dto.getV_emoji());
            pstmt.setString(8, dto.getV_ip()); // 새로 추가된 IP 등록

            return pstmt.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("DB Upsert 오류 발생: " + e.getMessage(), e);
        } finally {
            DBManager.close(con, pstmt, null);
        }
    }

    // 2. 전체 방문자 목록 조회
    public List<VisitorDTO> getAllVisitors(String ownerId) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<VisitorDTO> list = new ArrayList<>();

        String sql =
                "SELECT v_id, v_writer_id, v_owner_id, v_emoji, " +
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
                v.setV_emoji(rs.getInt("v_emoji"));
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

    // 3. 최근 방문자 5명 조회 (메인 위젯용)
    public List<VisitorDTO> getRecentVisitors(String ownerId) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<VisitorDTO> list = new ArrayList<>();

        String sql =
                "SELECT * FROM (" +
                        "  SELECT v_id, v_writer_id, v_emoji, TO_CHAR(v_date, 'MM.DD') as v_date_fmt " +
                        "  FROM visitor_log WHERE v_owner_id = ? ORDER BY v_date DESC" +
                        ") WHERE rownum <= 5";
        try {
            con = DBManager.connect();
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, ownerId);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                VisitorDTO v = new VisitorDTO();
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

    // 4. 방문 기록 삭제
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

    // 5. 페이징 방문자 조회
    public List<VisitorDTO> getVisitorsByPage(String ownerId, int page) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<VisitorDTO> list = new ArrayList<>();

        int start = (page - 1) * 7 + 1;
        int end = page * 7;

        String sql =
                "SELECT * FROM (" +
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