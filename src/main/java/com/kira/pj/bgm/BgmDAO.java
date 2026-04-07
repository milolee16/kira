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
        System.out.println("🔍 조회 uPk: " + uPk);  // 콘솔 출력

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
        System.out.println("📊 조회 결과: " + list.size() + "개");

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
    public boolean deleteTrack(String uPk, String youtubeId) {
        String sql = "DELETE FROM bgm_track WHERE u_pk = ? AND youtube_id = ?";

        Connection con = null;
        PreparedStatement ps = null;

        try {
            con = DBManager.connect();
            ps = con.prepareStatement(sql);
            ps.setString(1, uPk);
            ps.setString(2, youtubeId);
            return ps.executeUpdate() == 1;

        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } finally {
            DBManager.close(con, ps, null);
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
}