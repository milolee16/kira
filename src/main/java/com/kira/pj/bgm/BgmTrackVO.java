package com.kira.pj.bgm;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BgmTrackVO {

        private int trackId;
        private String title;
        private String youtubeId;
        private int duration;
        private int trackOrder;
        private String userId;

        public String getTitle()      { return title; }
        public void setTitle(String v){ this.title = v; }
        public String getYoutubeId()      { return youtubeId; }
        public void setYoutubeId(String v){ this.youtubeId = v; }
        public int getDuration()      { return duration; }
        public void setDuration(int v){ this.duration = v; }
        public int getTrackOrder()      { return trackOrder; }
        public void setTrackOrder(int v){ this.trackOrder = v; }
        public String getUserId()       { return userId; }
        public void setUserId(String v) { this.userId = v; }


}
