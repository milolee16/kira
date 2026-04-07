-- 1. 시퀀스 생성
CREATE SEQUENCE visitor_seq START WITH 1 INCREMENT BY 1;

-- 2. 테이블 생성 (ID에 자동증가 삭제)
CREATE TABLE visitor_log
(
    v_id        NUMBER PRIMARY KEY,
    v_writer_id VARCHAR2(50)  NOT NULL,
    v_owner_id  VARCHAR2(50)  NOT NULL,
    v_emoji     NUMBER DEFAULT 1,
    v_date      DATE   DEFAULT SYSDATE
);

ALTER TABLE visitor_log ADD (v_ip VARCHAR2(100));

-- 1. 첫 번째 방문자
INSERT INTO visitor_log (v_writer_id, v_owner_id, v_emoji)
VALUES ('MiniMe123', 'DongMin', 1);

-- 2. 두 번째 방문자
INSERT INTO visitor_log (v_writer_id, v_owner_id, v_emoji)
VALUES ('HappyUser', 'DongMin', 2);

-- 3. 세 번째 방문자
INSERT INTO visitor_log (v_writer_id, v_owner_id, v_emoji)
VALUES ('CyWorldFan', 'DongMin', 5);

SELECT *
FROM visitor_log
ORDER BY v_date DESC;