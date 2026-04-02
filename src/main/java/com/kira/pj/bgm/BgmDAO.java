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

    public List<BgmTrackVO> getTracksByUser(int userId) {
        List<BgmTrackVO> list = new ArrayList<>();
        String sql = "SELECT * FROM bgm_track WHERE user_id = ? ORDER BY track_order";

        try (Connection conn = getConn();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, userId);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    BgmTrackVO t = new BgmTrackVO();
                    t.setTitle(rs.getString("title"));
                    t.setYoutubeId(rs.getString("youtube_id"));
                    t.setDuration(rs.getInt("duration"));
                    t.setTrackOrder(rs.getInt("track_order"));
                    list.add(t);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }
}