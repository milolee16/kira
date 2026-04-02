package com.kira.pj.board;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GuestBoardVO {
    public String guest_nick;
    public String board_content;
    public int is_private;
    public String created_at;
}
