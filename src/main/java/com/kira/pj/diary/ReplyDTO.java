package com.kira.pj.diary;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReplyDTO {
    private int r_no;      // 댓글 번호
    private int d_no;      // ★ 핵심: 어떤 일기의 댓글인가? (일기 번호)
    private String r_id;   // 작성자 아이디
    private String r_txt;  // 댓글 내용
    private Date r_date;   // 작성 날짜
}