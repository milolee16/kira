-- 1. 좋아요 테이블 생성
CREATE TABLE diary_like (
                            l_no NUMBER PRIMARY KEY,
                            d_no NUMBER NOT NULL,        -- 게시글 번호
                            u_id VARCHAR2(100) NOT NULL  -- 누른 사람 아이디
);

-- 2. 시퀀스 생성
CREATE SEQUENCE diary_like_seq;