package com.kira.pj.photo;

import com.google.gson.Gson;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PhotoDTO {
        private int    photoId;
        private String userId;
        private String imgName;
        private String title;
        private String content;
        private String regDate;

        public String toJSON(){
            Gson gson = new Gson();
            return  gson.toJson(this);
        }
}
