package com.kira.pj.main;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Properties;
import java.util.UUID;

public class SupabaseModel {

    public static String uploadSupabase(HttpServletRequest req) throws ServletException, IOException {
        String fileUrl = null;
        try {
            InputStream is = req.getServletContext().getResourceAsStream("/WEB-INF/config.properties");
            Properties props = new Properties();
            props.load(is);

            String supabaseUrl = props.getProperty("supabase.url");
            String apiKey = props.getProperty("supabase.key");
            String bucket = props.getProperty("supabase.bucket");

            // 1️⃣ 클라이언트가 보낸 파일 가져오기
            Part filePart = req.getPart("file"); // input 태그 name과 동일
            String originalFileName = filePart.getSubmittedFileName();
            InputStream fileContent = filePart.getInputStream();

            // 2️⃣ 파일 확장자 안전하게 추출
            String ext = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                ext = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            // 3️⃣ UUID 기반 랜덤 파일명 + 확장자
            String fileName = UUID.randomUUID().toString().split("-")[0] + ext;
            // 4️⃣ Supabase Storage URL 및 인증
            URL url = new URL(supabaseUrl + "/storage/v1/object/" + bucket + "/" + fileName);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setDoOutput(true);
            conn.setRequestMethod("POST"); // PUT 필수
            conn.setRequestProperty("Authorization", "Bearer " + apiKey);
            conn.setRequestProperty("Content-Type", filePart.getContentType());

            // 5️⃣ 파일 내용을 OutputStream으로 전송
            try (OutputStream os = conn.getOutputStream()) {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = fileContent.read(buffer)) != -1) {
                    os.write(buffer, 0, bytesRead);
                }
                os.flush();
            }

            // 6️⃣ 요청 완료 후 응답 확인
            int responseCode = conn.getResponseCode();
            System.out.println("응답 코드: " + responseCode);

            if (responseCode == 200 || responseCode == 201) {
                fileUrl = supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + fileName;
                System.out.println("업로드 성공 URL: " + fileUrl);
            } else {
                System.out.println("업로드 실패");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return fileUrl;
    }
}
