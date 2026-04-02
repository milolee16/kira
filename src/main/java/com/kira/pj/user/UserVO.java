package com.kira.pj.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserVO {
    private String no;
    private String name;
    private Date birth;
    private String id;
    private String pw;
    private String nickname;
    private Date joinDate;
}
