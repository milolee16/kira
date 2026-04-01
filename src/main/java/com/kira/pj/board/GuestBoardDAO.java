package com.kira.pj.board;

import com.kira.pj.main.DBManager;
import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

public class GuestBoardDAO {
    public static final GuestBoardDAO GBDAO = new GuestBoardDAO();

    public Connection con = null;

    private GuestBoardDAO() {
        try {
            con = DBManager.connect();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    public void showGuestBoard(HttpServletRequest request, HttpServletResponse response) {
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            request.setCharacterEncoding("utf-8");
            String sql = "select guest_nick, board_content, is_private, created_at from guestboard_test";

            ps = con.prepareStatement(sql);
            rs = ps.executeQuery();
            GuestBoardVO guestboard = new GuestBoardVO();
            ArrayList<GuestBoardVO> guestBoards = new ArrayList<>();
            while (rs.next()) {
                guestboard.setBoard_content(rs.getString("board_content"));
                guestboard.setGuest_nick(rs.getString("guest_nick"));
                guestboard.setIs_private(rs.getInt("is_private"));
                guestboard.setCreated_at(rs.getTimestamp("created_at").toLocalDateTime());
                guestBoards.add(guestboard);
            }

            System.out.println("showGuestBoard success");
            request.setAttribute("guestBoard", guestBoards);

        }catch (Exception e){
            e.printStackTrace();
        }finally {
            DBManager.close(con,ps,rs);
        }



    }

    public void addHi(HttpServletRequest request, HttpServletResponse response) {
        PreparedStatement ps = null;
        try {
        request.setCharacterEncoding("utf-8");



        String pk = NanoIdUtils.randomNanoId(NanoIdUtils.DEFAULT_NUMBER_GENERATOR,NanoIdUtils.DEFAULT_ALPHABET,15);
        String guest_pk = "2";
        String host_id = "2";
        String guest_nick = "test2";
        String board_content = request.getParameter("content");
        int is_private = 0;

        String sql = "insert into guestboard_test values(?,?,?,?,?,?,?,DEFAULT)";

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

}
