package com.kira.pj.diary;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiaryDTO {
    private int no;
    private String id;
    private Date date;
    private String title;
    private String txt;
    private Date created_at;

    public void setD_date(String formattedDate) {
    }
}

