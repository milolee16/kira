package com.kira.pj.visitor;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.kira.pj.main.DBManager;

public class VisitorDAO {

    // 1. 발도장 찍기 및 갱신 (Upsert) - 세션 PK 기반
    public int upsertVisitor(VisitorDTO dto) {
        Connection con = null;
        PreparedStatement pstmt = null;

        // [핵심] IP 조건이 삭제되고, 철저하게 작성자와 주인의 PK 조합만으로 중복을 검사한다.
        String sql =
                "MERGE INTO visitor_log " +
                        "USING dual " +
                        "ON (v_writer_pk = ? AND v_owner_pk = ? AND TRUNC(v_date) = TRUNC(SYSDATE)) " +
                        "WHEN MATCHED THEN " +
                        "    UPDATE SET v_emoji = ? " +
                        "WHEN NOT MATCHED THEN " +
                        "    INSERT (v_id, v_writer_pk, v_owner_pk, v_emoji, v_date) " +
                        "    VALUES (visitor_seq.NEXTVAL, ?, ?, ?, SYSDATE)";

        try {
            con = DBManager.connect();
            pstmt = con.prepareStatement(sql);

            // ON 절 파라미터
            pstmt.setString(1, dto.getV_writer_pk());
            pstmt.setString(2, dto.getV_owner_pk());

            // MATCHED 절 (UPDATE)
            pstmt.setInt(3, dto.getV_emoji());

            // NOT MATCHED 절 (INSERT)
            pstmt.setString(4, dto.getV_writer_pk());
            pstmt.setString(5, dto.getV_owner_pk());
            pstmt.setInt(6, dto.getV_emoji());

            return pstmt.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("방명록 Upsert 오류: " + e.getMessage(), e);
        } finally {
            DBManager.close(con, pstmt, null);
        }
    }

    // 2. 전체 방문자 목록 조회
    public List<VisitorDTO> getAllVisitors(String ownerPk) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<VisitorDTO> list = new ArrayList<>();

        String sql =
                "SELECT v_id, v_writer_pk, v_owner_pk, v_emoji, " +
                        "TO_CHAR(v_date, 'MM.DD AM HH12:MI') as v_date_fmt " +
                        "FROM visitor_log WHERE v_owner_pk = ? ORDER BY v_date DESC";

        try {
            con = DBManager.connect();
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, ownerPk);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                VisitorDTO v = new VisitorDTO();
                v.setV_id(rs.getInt("v_id"));
                v.setV_writer_pk(rs.getString("v_writer_pk"));
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
    public List<VisitorDTO> getRecentVisitors(String ownerPk) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<VisitorDTO> list = new ArrayList<>();

        String sql =
                "SELECT * FROM (" +
                        "  SELECT v_id, v_writer_pk, v_emoji, TO_CHAR(v_date, 'MM.DD') as v_date_fmt " +
                        "  FROM visitor_log WHERE v_owner_pk = ? ORDER BY v_date DESC" +
                        ") WHERE rownum <= 5";
        try {
            con = DBManager.connect();
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, ownerPk);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                VisitorDTO v = new VisitorDTO();
                v.setV_writer_pk(rs.getString("v_writer_pk"));
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

    // 4. 삭제 및 페이징 코드는 파라미터만 ownerPk로 맞춰서 사용하면 된다.
    // ... 기존 삭제/페이징 코드에서 컬럼명을 v_writer_pk, v_owner_pk 로 교체하여 사용
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

    // 5. 페이징 방문자 조회 (과거의 잔재 완전 삭제)
    public List<VisitorDTO> getVisitorsByPage(String ownerPk, int page) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<VisitorDTO> list = new ArrayList<>();

        int start = (page - 1) * 7 + 1;
        int end = page * 7;

        // [핵심 수정] SELECT 컬럼과 WHERE 조건절 모두 PK 기준으로 완벽히 교체
        String sql =
                "SELECT * FROM (" +
                        "  SELECT rownum as rn, t.* FROM (" +
                        "    SELECT v_id, v_writer_pk, v_emoji, TO_CHAR(v_date, 'MM.DD AM HH12:MI') as v_date_fmt " +
                        "    FROM visitor_log WHERE v_owner_pk = ? ORDER BY v_date DESC" +
                        "  ) t" +
                        ") WHERE rn BETWEEN ? AND ?";

        try {
            con = DBManager.connect();
            pstmt = con.prepareStatement(sql);
            pstmt.setString(1, ownerPk); // 변수명 교체 반영
            pstmt.setInt(2, start);
            pstmt.setInt(3, end);
            rs = pstmt.executeQuery();

            while (rs.next()) {
                VisitorDTO v = new VisitorDTO();
                v.setV_id(rs.getInt("v_id"));
                v.setV_writer_pk(rs.getString("v_writer_pk")); // getString 내부도 완벽히 교체
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