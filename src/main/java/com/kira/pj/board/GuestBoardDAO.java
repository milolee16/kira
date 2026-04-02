package com.kira.pj.board;

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
    public void showGuestBoard(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd a hh:mm", Locale.KOREAN);
            String gbDate = request.getParameter("date");
            con = DBManager.connect();
            request.setCharacterEncoding("utf-8");

            if (gbDate == null || gbDate.isEmpty()) {
                gbDate  = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

            }

            String sql = "select * from guestboard_test where to_char(created_at, 'YYYY-MM-DD') = ? order by created_at desc ";
            ps = con.prepareStatement(sql);
            ps.setString(1,gbDate);

            rs = ps.executeQuery();
            GuestBoardVO guestboard = null;
            ArrayList<GuestBoardVO> guestBoards = new ArrayList<>();
            while (rs.next()) {
                guestboard = new GuestBoardVO();
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

            System.out.println("showGuestBoard success");
            System.out.println(guestBoards);
            request.setAttribute("guestBoards", guestBoards);
            request.setAttribute("selectedDate",gbDate);

        }catch (Exception e){
            e.printStackTrace();
        }finally {
            DBManager.close(con,ps,rs);
        }



    }

    public void addHi(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        PreparedStatement ps = null;
        try {
            con = DBManager.connect();
        request.setCharacterEncoding("utf-8");



        String pk = NanoIdUtils.randomNanoId(NanoIdUtils.DEFAULT_NUMBER_GENERATOR,NanoIdUtils.DEFAULT_ALPHABET,15);
        String guest_pk = "2";
        String host_id = "2";
        String guest_nick = "test2";
        String board_content = request.getParameter("content");
        int is_private = 0;

        String sql = "insert into guestboard_test values(?,?,?,?,?,?,DEFAULT)";

            ps = con.prepareStatement(sql);
            ps.setString(1,pk);
            ps.setString(2,guest_pk);
            ps.setString(3,host_id);
            ps.setString(4,guest_nick);
            ps.setString(5,board_content);
            ps.setInt(6,is_private);

            if(ps.executeUpdate()==1){
                System.out.println("addHi success");
            }

        }catch (Exception e){
            e.printStackTrace();
        }finally {
            DBManager.close(con,ps,null);
        }


    }

    public void UpdateGuestBoard(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        PreparedStatement ps = null;

        try {
            con = DBManager.connect();
            request.setCharacterEncoding("utf-8");



            String board_content = request.getParameter("guest_board");
            String gboard_pk = request.getParameter("gboard_pk");

            String sql = "update guestboard_test set board_content = ? where gboard_pk = ? ";

            ps = con.prepareStatement(sql);
            ps.setString(1, board_content);
            ps.setString(2, gboard_pk);
            if (ps.executeUpdate() == 1) {
                System.out.println("update Gboard success");
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, ps, null);
        }
    }

    public void delGB(HttpServletRequest request, HttpServletResponse response) {

        Connection con = null;
        PreparedStatement ps = null;

        try {
            con = DBManager.connect();
            request.setCharacterEncoding("utf-8");




            String gboard_pk = request.getParameter("gboard_pk");

            String sql = "delete guestboard_test where gboard_pk = ? ";

            ps = con.prepareStatement(sql);

            ps.setString(1, gboard_pk);
            if (ps.executeUpdate() == 1) {
                System.out.println("delete Gboard success");
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            DBManager.close(con, ps, null);
        }
    }
}
