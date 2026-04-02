package com.kira.pj.visitor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor


public class VisitorDTO {

    private int v_id;           // PK (자동증가 NUMBER)
    private String v_writer_id;  // 작성자 ID (방문한 사람)
    private String v_owner_id;   // 홈피 주인 ID
    private int v_emoji;        // 이모지 번호 (NUMBER)
    private String v_date;      // 방문 날짜 (DATE -> String으로 변환해서 사용)

}
