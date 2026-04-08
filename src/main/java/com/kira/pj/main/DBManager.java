package com.kira.pj.main;

import org.apache.commons.dbcp2.BasicDataSource;

import java.sql.*;

public class DBManager {
    private static BasicDataSource dataSource;
    static {
        System.out.println("db 연결 시도 ---------------------");
        dataSource = new BasicDataSource();
        dataSource.setUrl("jdbc:oracle:thin:@10.1.82.127:1521:XE");
        dataSource.setUsername("c##kira");
        dataSource.setPassword("kira1004");
        dataSource.setMinIdle(50);        // 최소 유휴 커넥션
        dataSource.setMaxIdle(100);       // 최대 유휴 커넥션
        dataSource.setMaxOpenPreparedStatements(200); // 풀에서 열린 최대 준비된 sql문 개수


    }
    public static Connection connect() throws SQLException {
        System.out.println("you?");
        return dataSource.getConnection();
    }


    public static Connection connection() throws SQLException {
         Connection conn = DriverManager.getConnection("jdbc:oracle:thin:@10.1.82.127:1521:XE", "c##kira", "kira1004");
        System.out.println("connect??????????");
         return conn;
    }

    public static void close(Connection con, PreparedStatement ps, ResultSet rs) {
        try {
            if (rs != null) {
                rs.close();
            }
            if(ps != null){
                ps.close();
            }
            if (con != null) {
                con.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

    }
}