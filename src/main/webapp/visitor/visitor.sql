-- 1. 시퀀스 생성
CREATE SEQUENCE visitor_seq START WITH 1 INCREMENT BY 1;

-- 2. 테이블 생성 (ID에 자동증가 삭제)
CREATE TABLE visitor_log
(
    v_id        NUMBER PRIMARY KEY,
    v_writer_id VARCHAR2(50) NOT NULL,
    v_owner_id  VARCHAR2(50) NOT NULL,
    v_emoji     NUMBER DEFAULT 1,
    v_date      DATE   DEFAULT SYSDATE
);
ALTER TABLE visitor_log
    RENAME COLUMN v_writer_id TO v_writer_pk;

ALTER TABLE visitor_log
    RENAME COLUMN v_owner_id TO v_owner_pk;

SELECT *
FROM visitor_log
ORDER BY v_date DESC;