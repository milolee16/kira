create table diary_test
(
    d_no         int primary key,
    d_id         varchar2(50)   not null,
    d_date       Date           not null,
    d_title      varchar2(100)  not null,
    d_txt        varchar2(1000) not null,
    d_created_at Date           not null
);

create sequence diary_test_seq;

SELECT *
FROM diary_test;

-- 일기 테이블에 '공개 범위(d_visibility)' 칸을 추가합니다.
-- 0-나만보기 1-친구만 공개 2- 전체공개
-- 기본값(DEFAULT)은 2(전체 공개)로 설정합니다.
ALTER TABLE diary_test
    ADD (d_visibility NUMBER(1) DEFAULT 2);

-- 댓글 좋아요 테이블

-- 1. 댓글 고유 번호 자판기
CREATE SEQUENCE diary_reply_seq;

-- 2. 댓글(포스트잇) 테이블 만들기
CREATE TABLE diary_reply
(
    r_no   NUMBER(5) PRIMARY KEY,  -- 댓글 번호
    d_no   NUMBER(5)     NOT NULL, -- ★ 어떤 일기에 달린 댓글인지? (부모 일기 번호)
    r_id   VARCHAR2(20)  NOT NULL, -- 댓글 쓴 사람 (로그인 아이디)
    r_txt  VARCHAR2(500) NOT NULL, -- 댓글 내용
    r_date DATE DEFAULT SYSDATE    -- 댓글 쓴 날짜
);

-- 3. 자동 청소기 달아주기 (일기 지우면 댓글도 같이 싹 지워짐!)
ALTER TABLE diary_reply
    ADD CONSTRAINT fk_diary_reply
        FOREIGN KEY (d_no)
            REFERENCES diary_test (d_no)
                ON DELETE CASCADE;