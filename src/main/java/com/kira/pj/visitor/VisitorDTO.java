package com.kira.pj.visitor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class VisitorDTO {
    private int v_id;
    private String v_writer_pk; // 작성자의 식별자 (userReg의 u_pk)
    private String v_owner_pk;  // 홈피 주인의 식별자 (userReg의 u_pk)
    private int v_emoji;
    private String v_date;
}