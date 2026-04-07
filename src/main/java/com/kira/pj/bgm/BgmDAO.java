package com.kira.pj.bgm;

import com.kira.pj.main.DBManager;

import java.sql.*;
import java.util.*;

public class BgmDAO {

    public static final BgmDAO DAO = new BgmDAO();
    public BgmDAO() {}

    // 전체 트랙 조회 (관리용)
    public List<BgmTrackVO> getAllTracks() {
        List<BgmTrackVO> list = new ArrayList<>();
        String sql = "SELECT * FROM bgm_track ORDER BY u_pk, track_order";

        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            con = DBManager.connect();
            ps = con.prepareStatement(sql);
            rs = ps.executeQuery();

            while (rs.next()) {
                BgmTrackVO t = new BgmTrackVO();
                t.setUPk(rs.getString("u_pk"));
                t.setYoutubeId(rs.getString("youtube_id"));
                t.setTitle(rs.getString("title"));
                t.setDuration(rs.getInt("duration"));
                t.setTrackOrder(rs.getInt("track_order"));
                list.add(t);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, ps, rs);
        }

        return list;
    }

    // 로그인한 유저 기준 재생목록 조회
    public List<BgmTrackVO> getTracksByUser(String u_pk) {
        List<BgmTrackVO> list = new ArrayList<>();
        String sql = "SELECT * FROM bgm_track WHERE u_pk = ? ORDER BY track_order";

        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            con = DBManager.connect();
            ps = con.prepareStatement(sql);
            ps.setString(1, u_pk);
            rs = ps.executeQuery();

            while (rs.next()) {
                BgmTrackVO t = new BgmTrackVO();
                t.setUPk(rs.getString("u_pk"));
                t.setYoutubeId(rs.getString("youtube_id"));
                t.setTitle(rs.getString("title"));
                t.setDuration(rs.getInt("duration"));
                t.setTrackOrder(rs.getInt("track_order"));
                list.add(t);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, ps, rs);
        }

        return list;
    }

    // 로그인한 유저 기준 트랙 추가
    public void insertTrack(BgmTrackVO track, String u_pk) {
        String sql = "INSERT INTO bgm_track (u_pk, youtube_id, title, duration, track_order) " +
                "VALUES (?, ?, ?, ?, (SELECT NVL(MAX(track_order),0)+1 FROM bgm_track WHERE u_pk = ?))";

        Connection con = null;
        PreparedStatement ps = null;

        try {
            con = DBManager.connect();
            ps = con.prepareStatement(sql);

            ps.setString(1, u_pk);
            ps.setString(2, track.getYoutubeId());
            ps.setString(3, track.getTitle());
            ps.setInt(4, track.getDuration());
            ps.setString(5, u_pk);

            ps.executeUpdate();

        } catch (SQLException e) {
            // 중복곡(PK 위반) 처리
            if (e.getErrorCode() == 1) { // ORA-00001
                System.out.println("이미 추가된 곡입니다: " + track.getTitle());
            } else {
                e.printStackTrace();
            }
        } finally {
            DBManager.close(con, ps, null);
        }
    }
}