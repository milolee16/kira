package com.kira.pj.bgm;

import java.sql.*;
import java.util.*;

public class BgmDAO {

    private Connection getConn() throws SQLException {
        return DriverManager.getConnection(
                "jdbc:oracle:thin:@localhost:1521:xe", "c##kira", "kira1004"
        );
    }

    public List<BgmTrackVO> getAllTracks() {
        List<BgmTrackVO> list = new ArrayList<>();
        String sql = "SELECT * FROM bgm_track ORDER BY track_order";

        try (Connection conn = getConn();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                BgmTrackVO t = new BgmTrackVO();
                t.setTitle(rs.getString("title"));
                t.setYoutubeId(rs.getString("youtube_id"));
                t.setDuration(rs.getInt("duration"));
                t.setTrackOrder(rs.getInt("track_order"));
                list.add(t);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    // userId 기반 조회
    public List<BgmTrackVO> getTracksByUser(String userId) {
        List<BgmTrackVO> list = new ArrayList<>();
        String sql = "SELECT * FROM bgm_track WHERE user_id = ? ORDER BY track_order";

        try (Connection conn = getConn();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, userId);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                BgmTrackVO t = new BgmTrackVO();
                t.setTitle(rs.getString("title"));
                t.setYoutubeId(rs.getString("youtube_id"));
                t.setDuration(rs.getInt("duration"));
                t.setTrackOrder(rs.getInt("track_order"));
                list.add(t);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    // 곡 추가 (userId 포함)
    public void insertTrack(BgmTrackVO track) {
        String sql = "INSERT INTO bgm_track (title, youtube_id, duration, track_order, user_id) "
                + "VALUES (?, ?, ?, "
                + "(SELECT NVL(MAX(track_order), 0) + 1 FROM bgm_track WHERE user_id = ?), ?)";

        try (Connection conn = getConn();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, track.getTitle());
            ps.setString(2, track.getYoutubeId());
            ps.setInt(3, track.getDuration());
            ps.setString(4, track.getUserId());
            ps.setString(5, track.getUserId());
            ps.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

}