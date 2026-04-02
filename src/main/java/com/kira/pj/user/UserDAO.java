package com.kira.pj.user;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import com.kira.pj.main.DBManager;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Properties;
import java.util.Random;


public class UserDAO {
    public static final UserDAO DAO = new UserDAO();

    private UserDAO() {
    }

    public boolean join(HttpServletRequest request) {
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            String name = request.getParameter("name");
            String birth = request.getParameter("birth");
            String id = request.getParameter("id");
            String pw = request.getParameter("pw");
            String pwChk = request.getParameter("pwChk");
            String nickname = request.getParameter("nickname");
            String email = request.getParameter("email");
            String emailCode = request.getParameter("emailCode");

            String idChecked = request.getParameter("idChecked");
            String checkedId = request.getParameter("checkedId");
            String nicknameChecked = request.getParameter("nicknameChecked");
            String checkedNickname = request.getParameter("checkedNickname");
            String emailVerified = request.getParameter("emailVerified");
            String verifiedEmail = request.getParameter("verifiedEmail");

            keepJoinFormData(request);

            if (pw == null || pwChk == null || !pw.equals(pwChk)) {
                request.setAttribute("msg", "비밀번호와 비밀번호 확인이 다릅니다.");
                return false;
            }

            if (!"Y".equals(idChecked) || checkedId == null || !checkedId.equals(id)) {
                request.setAttribute("msg", "아이디 중복확인을 먼저 완료해주세요.");
                return false;
            }

            if (!"Y".equals(nicknameChecked) || checkedNickname == null || !checkedNickname.equals(nickname)) {
                request.setAttribute("msg", "닉네임 중복확인을 먼저 완료해주세요.");
                return false;
            }

            if (!"Y".equals(emailVerified) || verifiedEmail == null || !verifiedEmail.equals(email)) {
                request.setAttribute("msg", "이메일 인증을 먼저 완료해주세요.");
                return false;
            }

            if (isIdExists(id)) {
                request.setAttribute("msg", "이미 사용중인 아이디 입니다.");
                request.setAttribute("idChecked", "N");
                request.setAttribute("checkedId", "");
                return false;
            }

            if (isNicknameExists(nickname)) {
                request.setAttribute("msg", "이미 사용중인 닉네임 입니다.");
                request.setAttribute("nicknameChecked", "N");
                request.setAttribute("checkedNickname", "");
                return false;
            }

            if (isEmailExists(email)) {
                request.setAttribute("msg", "이미 사용중인 이메일 입니다.");
                request.setAttribute("emailVerified", "N");
                request.setAttribute("verifiedEmail", "");
                return false;
            }

            String pk = NanoIdUtils.randomNanoId(
                    NanoIdUtils.DEFAULT_NUMBER_GENERATOR,
                    NanoIdUtils.DEFAULT_ALPHABET,
                    15
            );

            conn = DBManager.connect();

            String sql = "insert into userReg " +
                    "(u_pk, u_name, u_birth, u_id, u_pw, u_nickname, u_email, u_join_date) " +
                    "values (?, ?, ?, ?, ?, ?, ?, sysdate)";

            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, pk);
            pstmt.setString(2, name);
            pstmt.setDate(3, Date.valueOf(birth));
            pstmt.setString(4, id);
            pstmt.setString(5, pw);
            pstmt.setString(6, nickname);
            pstmt.setString(7, email);

            if (pstmt.executeUpdate() == 1) {
                HttpSession session = request.getSession();
                session.removeAttribute("emailAuthCode");
                session.removeAttribute("emailAuthTarget");
                return true;
            }

            request.setAttribute("msg", "회원가입 실패");
            return false;

        } catch (Exception e) {
            e.printStackTrace();
            request.setAttribute("msg", "회원가입 실패");
            return false;
        } finally {
            DBManager.close(conn, pstmt, null);
        }
    }

    public void checkId(HttpServletRequest request) {
        try {
            String id = request.getParameter("id");

            keepJoinFormData(request);

            if (id == null || id.trim().isEmpty()) {
                request.setAttribute("msg", "아이디를 입력해주세요.");
                request.setAttribute("idChecked", "N");
                request.setAttribute("checkedId", "");
                return;
            }

            if (isIdExists(id)) {
                request.setAttribute("msg", "이미 사용중인 아이디 입니다.");
                request.setAttribute("idChecked", "N");
                request.setAttribute("checkedId", "");
            } else {
                request.setAttribute("msg", "사용 가능한 아이디 입니다.");
                request.setAttribute("idChecked", "Y");
                request.setAttribute("checkedId", id);
            }

        } catch (Exception e) {
            e.printStackTrace();
            request.setAttribute("msg", "아이디 중복확인 실패");
            request.setAttribute("idChecked", "N");
            request.setAttribute("checkedId", "");
        }
    }

    public void checkNickname(HttpServletRequest request) {
        try {
            String nickname = request.getParameter("nickname");

            keepJoinFormData(request);

            if (nickname == null || nickname.trim().isEmpty()) {
                request.setAttribute("msg", "닉네임을 입력해주세요.");
                request.setAttribute("nicknameChecked", "N");
                request.setAttribute("checkedNickname", "");
                return;
            }

            if (isNicknameExists(nickname)) {
                request.setAttribute("msg", "이미 사용중인 닉네임 입니다.");
                request.setAttribute("nicknameChecked", "N");
                request.setAttribute("checkedNickname", "");
            } else {
                request.setAttribute("msg", "사용 가능한 닉네임 입니다.");
                request.setAttribute("nicknameChecked", "Y");
                request.setAttribute("checkedNickname", nickname);
            }

        } catch (Exception e) {
            e.printStackTrace();
            request.setAttribute("msg", "닉네임 중복확인 실패");
            request.setAttribute("nicknameChecked", "N");
            request.setAttribute("checkedNickname", "");
        }
    }

    public void sendEmailAuth(HttpServletRequest request) {
        try {
            String email = request.getParameter("email");

            keepJoinFormData(request);

            if (email == null || email.trim().isEmpty()) {
                request.setAttribute("msg", "이메일을 입력해주세요.");
                request.setAttribute("emailVerified", "N");
                request.setAttribute("verifiedEmail", "");
                return;
            }

            email = email.trim();

            if (!(email.endsWith("@gmail.com") || email.endsWith("@naver.com"))) {
                request.setAttribute("msg", "구글 메일과 네이버 메일만 사용할 수 있습니다.");
                request.setAttribute("emailVerified", "N");
                request.setAttribute("verifiedEmail", "");
                return;
            }

            if (isEmailExists(email)) {
                request.setAttribute("msg", "이미 사용중인 이메일 입니다.");
                request.setAttribute("emailVerified", "N");
                request.setAttribute("verifiedEmail", "");
                return;
            }

            String code = String.valueOf(100000 + new Random().nextInt(900000));

            HttpSession session = request.getSession();
            session.setAttribute("emailAuthCode", code);
            session.setAttribute("emailAuthTarget", email);

            sendMail(email, code);

            request.setAttribute("msg", "인증번호를 이메일로 전송했습니다.");
            request.setAttribute("emailVerified", "N");
            request.setAttribute("verifiedEmail", "");

        } catch (Exception e) {
            e.printStackTrace();
            request.setAttribute("msg", "이메일 전송 실패");
            request.setAttribute("emailVerified", "N");
            request.setAttribute("verifiedEmail", "");
        }
    }

    public void checkEmailAuth(HttpServletRequest request) {
        try {
            String email = request.getParameter("email");
            String emailCode = request.getParameter("emailCode");

            keepJoinFormData(request);

            HttpSession session = request.getSession();
            String sessionCode = (String) session.getAttribute("emailAuthCode");
            String sessionEmail = (String) session.getAttribute("emailAuthTarget");

            if (sessionCode != null && sessionEmail != null
                    && sessionCode.equals(emailCode)
                    && sessionEmail.equals(email)) {

                request.setAttribute("msg", "이메일 인증이 완료되었습니다.");
                request.setAttribute("emailVerified", "Y");
                request.setAttribute("verifiedEmail", email);

            } else {
                request.setAttribute("msg", "인증번호가 일치하지 않습니다.");
                request.setAttribute("emailVerified", "N");
                request.setAttribute("verifiedEmail", "");
            }

        } catch (Exception e) {
            e.printStackTrace();
            request.setAttribute("msg", "이메일 인증 확인 실패");
            request.setAttribute("emailVerified", "N");
            request.setAttribute("verifiedEmail", "");
        }
    }

    private void keepJoinFormData(HttpServletRequest request) {
        String name = request.getParameter("name");
        String birth = request.getParameter("birth");
        String id = request.getParameter("id");
        String pw = request.getParameter("pw");
        String pwChk = request.getParameter("pwChk");
        String nickname = request.getParameter("nickname");
        String email = request.getParameter("email");
        String emailCode = request.getParameter("emailCode");

        String idChecked = request.getParameter("idChecked");
        String checkedId = request.getParameter("checkedId");
        String nicknameChecked = request.getParameter("nicknameChecked");
        String checkedNickname = request.getParameter("checkedNickname");
        String emailVerified = request.getParameter("emailVerified");
        String verifiedEmail = request.getParameter("verifiedEmail");

        request.setAttribute("name", name);
        request.setAttribute("birth", birth);
        request.setAttribute("id", id);
        request.setAttribute("pw", pw);
        request.setAttribute("pwChk", pwChk);
        request.setAttribute("nickname", nickname);
        request.setAttribute("email", email);
        request.setAttribute("emailCode", emailCode);

        request.setAttribute("idChecked", idChecked);
        request.setAttribute("checkedId", checkedId);
        request.setAttribute("nicknameChecked", nicknameChecked);
        request.setAttribute("checkedNickname", checkedNickname);
        request.setAttribute("emailVerified", emailVerified);
        request.setAttribute("verifiedEmail", verifiedEmail);
    }

    private void sendMail(String toEmail, String code) throws Exception {
        String host = "smtp.gmail.com";
        String from = "aagfd13@gmail.com";
        String password = "ohxb afjf anea zauh";

        Properties props = new Properties();
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");

        Session mailSession = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(from, password);
            }
        });

        Message message = new MimeMessage(mailSession);
        message.setFrom(new InternetAddress(from));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
        message.setSubject("회원가입 이메일 인증번호");
        message.setText("인증번호는 [" + code + "] 입니다.");

        Transport.send(message);
    }

    public boolean isIdExists(String id) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = DBManager.connect();

            String sql = "select * from userReg where u_id = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, id);

            rs = pstmt.executeQuery();
            return rs.next();

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            DBManager.close(conn, pstmt, rs);
        }
    }

    public boolean isNicknameExists(String nickname) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = DBManager.connect();

            String sql = "select * from userReg where u_nickname = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, nickname);

            rs = pstmt.executeQuery();
            return rs.next();

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            DBManager.close(conn, pstmt, rs);
        }
    }

    public boolean isEmailExists(String email) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            conn = DBManager.connect();

            String sql = "select * from userReg where u_email = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, email);

            rs = pstmt.executeQuery();
            return rs.next();

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            DBManager.close(conn, pstmt, rs);
        }
    }

    public boolean login(HttpServletRequest request) {
        Connection conn = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            String id = request.getParameter("id");
            String pw = request.getParameter("pw");

            // 입력값 유지
            request.setAttribute("id", id);
            request.setAttribute("pw", pw);

            // 빈칸 검사
            if (id == null || id.trim().isEmpty()) {
                request.setAttribute("msg", "아이디를 입력해주세요.");
                return false;
            }

            if (pw == null || pw.trim().isEmpty()) {
                request.setAttribute("msg", "비밀번호를 입력해주세요.");
                return false;
            }

            conn = DBManager.connect();

            String sql = "select * from userReg where u_id = ? and u_pw = ?";
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, id);
            pstmt.setString(2, pw);

            rs = pstmt.executeQuery();

            if (rs.next()) {
                HttpSession session = request.getSession();

                session.setAttribute("loginUserPk", rs.getString("u_pk"));
                session.setAttribute("loginUserName", rs.getString("u_name"));
                session.setAttribute("loginUserId", rs.getString("u_id"));
                session.setAttribute("loginUserNickname", rs.getString("u_nickname"));
                session.setAttribute("loginUserEmail", rs.getString("u_email"));

                return true;
            } else {
                request.setAttribute("msg", "아이디 또는 비밀번호가 올바르지 않습니다.");
                return false;
            }

        } catch (Exception e) {
            e.printStackTrace();
            request.setAttribute("msg", "로그인 실패");
            return false;
        } finally {
            DBManager.close(conn, pstmt, rs);
        }
    }
    
    public void logout(HttpServletRequest request) {
        HttpSession session = request.getSession();
        session.invalidate();
    }

    public boolean isLogin(HttpServletRequest request) {
        HttpSession session = request.getSession();
        return session.getAttribute("loginUserId") != null;
    }
}