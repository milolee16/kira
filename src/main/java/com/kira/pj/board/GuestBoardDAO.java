package com.kira.pj.board;

import com.google.gson.Gson;
import com.kira.pj.main.DBManager;
import com.aventrix.jnanoid.jnanoid.NanoIdUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.time.LocalDate;
import java.util.ArrayList;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Locale;

public class GuestBoardDAO {
    public static final GuestBoardDAO GBDAO = new GuestBoardDAO();

//    public Connection con = null;

    private GuestBoardDAO() {
        try {
//            con = DBManager.connect();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String showGuestBoard(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd a hh:mm", Locale.KOREAN);
            String selectedDate = request.getParameter("date");
            con = DBManager.connect();
            request.setCharacterEncoding("utf-8");

            if (selectedDate == null || selectedDate.isEmpty()) {
                selectedDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            }

            String sql = "select * from guestboard_test where to_char(created_at, 'YYYY-MM-DD') = ? order by created_at desc ";
            ps = con.prepareStatement(sql);
            ps.setString(1, selectedDate);
            rs = ps.executeQuery();

            ArrayList<GuestBoardVO> guestBoards = new ArrayList<>();
            while (rs.next()) {
                GuestBoardVO guestboard = new GuestBoardVO();
                guestboard.setGboard_pk(rs.getString("gboard_pk"));
                guestboard.setGuest_pk(rs.getString("guest_pk"));
                guestboard.setHost_id(rs.getString("host_id"));
                guestboard.setBoard_content(rs.getString("board_content"));
                guestboard.setGuest_nick(rs.getString("guest_nick"));
                guestboard.setIs_private(rs.getInt("is_private"));
                String formattedDate = rs.getTimestamp("created_at").toLocalDateTime().format(formatter);
                guestboard.setCreated_at(formattedDate);
                guestBoards.add(guestboard);
            }

            // HashMap에 리스트와 날짜 담기
            HashMap<String, Object> gbResult = new HashMap<>();
            gbResult.put("guestBoards", guestBoards);
            gbResult.put("selectedDate", selectedDate);

            // Gson으로 JSON 변환
            Gson gson = new Gson();
            return gson.toJson(gbResult);

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, ps, rs);
        }
        return null;
    }

    public String addHi(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        PreparedStatement ps = null;
        String addHiResult = "{\"result\": \"fail\"}";
        try {
            con = DBManager.connect();
            request.setCharacterEncoding("utf-8");


            String pk = NanoIdUtils.randomNanoId(NanoIdUtils.DEFAULT_NUMBER_GENERATOR, NanoIdUtils.DEFAULT_ALPHABET, 15);
            String guest_pk = "2";
            String host_id = "2";
            String guest_nick = "test2";
            String board_content = request.getParameter("content");
            int is_private = 0;

            String sql = "insert into guestboard_test values(?,?,?,?,?,?,DEFAULT)";

            ps = con.prepareStatement(sql);
            ps.setString(1, pk);
            ps.setString(2, guest_pk);
            ps.setString(3, host_id);
            ps.setString(4, guest_nick);
            ps.setString(5, board_content);
            ps.setInt(6, is_private);

            if (ps.executeUpdate() == 1) {
                System.out.println("addHi success");
                addHiResult = "{\"result\": \"success\"}";
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, ps, null);
        }
        return addHiResult;
    }

    public String UpdateGuestBoard(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        PreparedStatement ps = null;
        String updateHiResult = "{\"result\": \"fail\"}";
        try {
            con = DBManager.connect();
            request.setCharacterEncoding("utf-8");


            String board_content = request.getParameter("content");
            String gboard_pk = request.getParameter("pk");

            String sql = "update guestboard_test set board_content = ? where gboard_pk = ? ";

            ps = con.prepareStatement(sql);
            ps.setString(1, board_content);
            ps.setString(2, gboard_pk);
            if (ps.executeUpdate() == 1) {
                System.out.println("update Gboard success");
                updateHiResult = "{\"result\": \"success\"}";
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, ps, null);
        }
        return updateHiResult;
    }

    public String delGB(HttpServletRequest request, HttpServletResponse response) {

        Connection con = null;
        PreparedStatement ps = null;
        String delHiResult = "{\"result\": \"fail\"}";

        try {
            con = DBManager.connect();
            request.setCharacterEncoding("utf-8");


            String gboard_pk = request.getParameter("pk");

            String sql = "delete guestboard_test where gboard_pk = ? ";

            ps = con.prepareStatement(sql);

            ps.setString(1, gboard_pk);
            if (ps.executeUpdate() == 1) {
                System.out.println("delete Gboard success");
                delHiResult = "{\"result\": \"success\"}";
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, ps, null);
        }
        return delHiResult;
    }
}
