package com.kira.pj.bgm;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BgmTrackVO {

        private String title;      // 영상 제목
        private String youtubeId;  // 유튜브 영상 ID
        private int duration;      // 재생시간 (초 단위)
        private int trackOrder;    // 사용자별 재생순서
        private String uPk;        // userReg PK (사용자 식별)
        private String userNickname; // 화면 표시용 닉네임

        // 생성자 / getter / setter 생략 가능
}
