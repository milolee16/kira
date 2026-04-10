package com.kira.pj.qna;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class DailyQnaVO {
    private int q_id;
    private String question;
    private String answer;
}
