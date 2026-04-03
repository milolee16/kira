CREATE TABLE bgm_track (
                           track_id    NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                           title       VARCHAR2(200),
                           youtube_id  VARCHAR2(20),   -- 유튜브 영상 ID만 저장 (URL 아님)
                           duration    NUMBER,          -- 초 단위 (예: 3분7초 = 187)
                           track_order NUMBER
);

-- 더미 데이터
INSERT INTO bgm_track (title, youtube_id, duration, track_order)
VALUES ('NeedygirlOverdose', 'BnkhBwzBqlQ', 222, 1);

INSERT INTO bgm_track (title, youtube_id, duration, track_order)
VALUES ('Attention - NewJeans', 'b9PFMqKi7gg', 213, 2);

select * from bgm_track;

COMMIT;