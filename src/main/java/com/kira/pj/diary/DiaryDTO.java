package com.kira.pj.diary;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiaryDTO {
    private int d_no;
    private String d_id;
    private Date d_date;
    private String d_title;
    private String d_txt;
    private Date d_created_at;

    public void setD_date(String formattedDate) {
    }
}

