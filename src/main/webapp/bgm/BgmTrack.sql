-- 분할할경우 이렇게
/*
CREATE TABLE track
(
    track_id   NUMBER PRIMARY KEY,            -- 트랙 고유 ID (시퀀스 track_seq 사용)
    youtube_id VARCHAR2(20 CHAR) NOT NULL,    -- 유튜브 고유 ID, 중복 허용 안 함
    title      VARCHAR2(100 CHAR),            -- 트랙 제목
    duration   NUMBER,                        -- 트랙 길이(초 단위)
    CONSTRAINT uq_youtube UNIQUE (youtube_id) -- youtube_id는 유일해야 함
);


-- ==========================================
-- 유저별 플레이리스트 테이블 (user_track)
-- ==========================================

CREATE TABLE user_track
(
    user_track_id NUMBER PRIMARY KEY,                                      -- 유저별 트랙 고유 ID (시퀀스 user_track_seq 사용)
    u_pk          VARCHAR2(15 CHAR)    NOT NULL,                           -- 유저 고유 ID (userReg 테이블 참조)
    track_id      NUMBER               NOT NULL,                           -- 트랙 ID (track 테이블 참조)
    title         VARCHAR2(100 CHAR)  NOT NULL,                           -- 트랙 제목 (조회 편의용, 중복 저장)
    track_order   NUMBER               NOT NULL,                           -- 플레이리스트 내 트랙 순서
    add_date      DATE DEFAULT SYSDATE NOT NULL,                           -- 트랙 추가 날짜, 기본값 현재 시각
    CONSTRAINT fk_user FOREIGN KEY (u_pk) REFERENCES userReg (u_pk),       -- 유저 외래키
    CONSTRAINT fk_track FOREIGN KEY (track_id) REFERENCES track (track_id) -- 트랙 외래키
);
*/

-- ==========================================
-- 트랙 정보 테이블 (track)
-- ==========================================
-- 테이블 (u_pk를 userReg와 연결)

CREATE TABLE bgm_track
(
    u_pk       VARCHAR2(15 CHAR) NOT NULL,   -- 유저 ID
    youtube_id VARCHAR2(20 CHAR) NOT NULL,   -- 곡 고유 ID
    title      VARCHAR2(100 CHAR) NOT NULL,  -- 곡 제목
    duration   NUMBER NOT NULL,              -- 재생 시간(초)
    track_order NUMBER NOT NULL,             -- 플레이리스트 내 순서
    PRIMARY KEY(u_pk, youtube_id)           -- 유저별 곡 복합키로 중복 방지
);

create sequence bgm_track_seq
start with 1
increment by 1;

drop sequence bgm_track_seq;

-- 1. 정확히 일치하는 이름으로 조회 후 추가 (DongMin)
INSERT INTO bgm_track(u_pk, youtube_id, title, duration, track_order)
VALUES ((SELECT u_pk FROM userReg WHERE u_name = 'DongMin'), -- 정확 일치
        'BnkhBwzBqlQ','Needygirl Overdose',214,1);

-- 2. LIKE 검색으로 조회 후 추가 (DongMin)
INSERT INTO bgm_track(u_pk, youtube_id, title, duration, track_order)
VALUES ((SELECT u_pk FROM userReg WHERE u_name LIKE '%DongMin%'), -- 이름 일부 검색
        'wZlv3qDPfjk','차가운 상어 아가씨',155,2);

-- 3. 이미 알고 있는 u_pk 직접 입력 (test1test1test1)
INSERT INTO bgm_track(u_pk, youtube_id, title, duration, track_order)
VALUES ('test1test1test1','YcxhmHEykPg','처형박수 (Execution Clap)',194,3);

-- 4. 직접 u_pk 입력, 신규 곡 추가 (test1test1test1)
INSERT INTO bgm_track(u_pk, youtube_id, title, duration, track_order)
VALUES ('test1test1test1','Kpf2mmyzuMM','Legend-Changer',241,4);

COMMIT;

select * from bgm_track;

drop table bgm_track;