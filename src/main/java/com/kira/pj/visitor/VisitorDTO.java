package com.kira.pj.visitor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor


public class VisitorDTO {
    private int v_id;
    private String v_writer_id;
    private String v_owner_id;
    private int v_emoji;
    private String v_date;
    private String v_ip; // [추가] 접속자 IP 저장용
    }
