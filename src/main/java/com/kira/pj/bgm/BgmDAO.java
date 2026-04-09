package com.kira.pj.bgm;

import com.kira.pj.main.DBManager;

import java.sql.*;
import java.util.*;

public class BgmDAO {

    public static final BgmDAO MDAO = new BgmDAO();
    private BgmDAO() {}

    // ── 전체 트랙 조회 (관리용) ───────────────────────────────
    public List<BgmTrackVO> getAllTracks() {
        List<BgmTrackVO> list = new ArrayList<>();
        String sql = "SELECT b.u_pk, b.youtube_id, b.title, b.duration, b.track_order, " +
                "       u.u_nickname " +
                "FROM bgm_track b " +
                "JOIN userReg u ON b.u_pk = u.u_pk " +
                "ORDER BY b.u_pk, b.track_order";

        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            con = DBManager.connect();
            ps = con.prepareStatement(sql);
            rs = ps.executeQuery();
            while (rs.next()) list.add(mapRow(rs));
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, ps, rs);
        }
        return list;
    }

    // ── 유저 기준 재생목록 조회 ───────────────────────────────
    public List<BgmTrackVO> getTracksByUser(String uPk) {
        List<BgmTrackVO> list = new ArrayList<>();
        String sql = "SELECT b.u_pk, b.youtube_id, b.title, b.duration, b.track_order, " +
                "       u.u_nickname " +
                "FROM bgm_track b " +
                "JOIN userReg u ON b.u_pk = u.u_pk " +
                "WHERE b.u_pk = ? " +
                "ORDER BY b.track_order";

        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            con = DBManager.connect();
            ps = con.prepareStatement(sql);
            ps.setString(1, uPk);
            rs = ps.executeQuery();
            while (rs.next()) list.add(mapRow(rs));
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, ps, rs);
        }
        return list;
    }

    // ── 트랙 추가 ─────────────────────────────────────────────
    // 호출 전: vo.setUPk(세션 uPk) 필수
    public void insertTrack(BgmTrackVO track) {
        String sql = "INSERT INTO bgm_track (u_pk, youtube_id, title, duration, track_order) " +
                "VALUES (?, ?, ?, ?, " +
                "(SELECT NVL(MAX(track_order), 0) + 1 FROM bgm_track WHERE u_pk = ?))";

        Connection con = null;
        PreparedStatement ps = null;

        try {
            con = DBManager.connect();
            ps = con.prepareStatement(sql);
            ps.setString(1, track.getUPk());
            ps.setString(2, track.getYoutubeId());
            ps.setString(3, track.getTitle());
            ps.setInt(4, track.getDuration());
            ps.setString(5, track.getUPk());
            ps.executeUpdate();

        } catch (SQLException e) {
            if (e.getErrorCode() == 1) { // ORA-00001: 중복 곡
                System.out.println("이미 추가된 곡입니다: " + track.getTitle());
            } else {
                e.printStackTrace();
            }
        } finally {
            DBManager.close(con, ps, null);
        }
    }

    // ── 트랙 삭제 ─────────────────────────────────────────────
    // 1. 기존 삭제 메서드 수정 (삭제 후 재정렬 호출)
    public boolean deleteTrack(String uPk, String youtubeId) {
        String deleteSql = "DELETE FROM bgm_track WHERE u_pk = ? AND youtube_id = ?";
        Connection con = null;
        PreparedStatement ps = null;

        try {
            con = DBManager.connect();
            ps = con.prepareStatement(deleteSql);
            ps.setString(1, uPk);
            ps.setString(2, youtubeId);

            int result = ps.executeUpdate();
            if (result == 1) {
                reorderTracks(uPk); // ✅ 삭제 성공 시 순서 재정렬 실행
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, ps, null);
        }
        return false;
    }

    // 2. 순서 재정렬 메서드 (항상 1, 2, 3... 순서 유지)
    private void reorderTracks(String uPk) {
        // ROWNUM을 이용해 기존 순서대로 1번부터 새로 부여
        String sql = "UPDATE bgm_track a SET track_order = " +
                "(SELECT new_order FROM (SELECT rowid as rid, ROW_NUMBER() OVER(ORDER BY track_order) as new_order " +
                "FROM bgm_track WHERE u_pk = ?) b WHERE a.rowid = b.rid) WHERE u_pk = ?";

        try (Connection con = DBManager.connect();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, uPk);
            ps.setString(2, uPk);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // 3. 시간 업데이트 메서드 (보내주신 파일에 이미 있지만 확인용)
    public boolean updateTrackDuration(String uPk, String youtubeId, int duration) {
        String sql = "UPDATE bgm_track SET duration = ? WHERE u_pk = ? AND youtube_id = ?";
        try (Connection con = DBManager.connect();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setInt(1, duration);
            ps.setString(2, uPk);
            ps.setString(3, youtubeId);
            return ps.executeUpdate() == 1;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // ── ResultSet → VO 매핑 ───────────────────────────────────
    private BgmTrackVO mapRow(ResultSet rs) throws SQLException {
        BgmTrackVO t = new BgmTrackVO();
        t.setUPk(rs.getString("u_pk"));
        t.setYoutubeId(rs.getString("youtube_id"));
        t.setTitle(rs.getString("title"));
        t.setDuration(rs.getInt("duration"));
        t.setTrackOrder(rs.getInt("track_order"));
        t.setUserNickname(rs.getString("u_nickname"));
        return t;
    }

    // ── 트랙 순서 swap ────────────────────────────────────────
    public boolean swapTrackOrder(String uPk, String youtubeIdA, String youtubeIdB) {
        String getSql = "SELECT youtube_id, track_order FROM bgm_track WHERE u_pk = ? AND youtube_id IN (?, ?)";
        String updateSql = "UPDATE bgm_track SET track_order = ? WHERE u_pk = ? AND youtube_id = ?";

        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            con = DBManager.connect();
            con.setAutoCommit(false);

            ps = con.prepareStatement(getSql);
            ps.setString(1, uPk);
            ps.setString(2, youtubeIdA);
            ps.setString(3, youtubeIdB);
            rs = ps.executeQuery();

            int orderA = -1, orderB = -1;
            while (rs.next()) {
                String id = rs.getString("youtube_id");
                int order = rs.getInt("track_order");
                if (id.equals(youtubeIdA)) orderA = order;
                else orderB = order;
            }
            if (orderA == -1 || orderB == -1) return false;

            rs.close(); ps.close();

            ps = con.prepareStatement(updateSql);
            ps.setInt(1, orderB); ps.setString(2, uPk); ps.setString(3, youtubeIdA);
            ps.executeUpdate();

            ps.setInt(1, orderA); ps.setString(2, uPk); ps.setString(3, youtubeIdB);
            ps.executeUpdate();

            con.commit();
            return true;

        } catch (SQLException e) {
            try { if (con != null) con.rollback(); } catch (SQLException ignored) {}
            e.printStackTrace();
            return false;
        } finally {
            DBManager.close(con, ps, rs);
        }
    }

    // ── 전체 순서 일괄 업데이트 (셔플용) ─────────────────────
    public boolean updateAllTrackOrder(String uPk, List<String> orderedIds) {
        String sql = "UPDATE bgm_track SET track_order = ? WHERE u_pk = ? AND youtube_id = ?";
        Connection con = null;
        PreparedStatement ps = null;

        try {
            con = DBManager.connect();
            con.setAutoCommit(false);
            ps = con.prepareStatement(sql);

            for (int i = 0; i < orderedIds.size(); i++) {
                ps.setInt(1, i + 1);
                ps.setString(2, uPk);
                ps.setString(3, orderedIds.get(i));
                ps.addBatch();
            }
            ps.executeBatch();
            con.commit();
            return true;

        } catch (SQLException e) {
            try { if (con != null) con.rollback(); } catch (SQLException ignored) {}
            e.printStackTrace();
            return false;
        } finally {
            DBManager.close(con, ps, null);
        }
    }
}