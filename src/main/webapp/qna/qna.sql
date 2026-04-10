CREATE TABLE daily_qna_log (
                               host_id VARCHAR2(50),      -- 미니홈피 주인 ID
                               q_date VARCHAR2(10),       -- 날짜 (예: '2026-04-09')
                               q_id NUMBER,               -- 랜덤으로 뽑힌 질문 번호
                               answer VARCHAR2(1000),     -- 사용자가 작성한 답변 (안 썼으면 null)
                               PRIMARY KEY (host_id, q_date) -- 한 사람당 하루에 딱 1개의 질문만!
);

-- 기존 데이터가 있다면 날리고 깔끔하게 시작하고 싶을 때 주석 해제
-- DELETE FROM qna_list;

-- 1. 며칠 전 작성했던 과거의 답변 기록 (조회용 테스트)
INSERT INTO daily_qna_log (host_id, q_date, q_id, answer)
VALUES ('test_user', '2026-04-05', 3, '당연히 가을이지! 선선한 바람 불 때 노래 들으면서 걷는 게 최고야🍂');

INSERT INTO daily_qna_log (host_id, q_date, q_id, answer)
VALUES ('test_user', '2026-04-07', 9, 'Needy girl Overdose 무한 반복 중...🎧');

-- 2. "오늘" 질문은 뽑혔는데 아직 답변을 안 적은 상태 (입력창 뜨는지 테스트용)
-- (만약 오늘 이미 DB에 값이 들어갔다면 ORA-00001 에러가 날 수 있으니 무시하셔도 됩니다)
INSERT INTO daily_qna_log (host_id, q_date, q_id, answer)
VALUES ('test_user', '2026-04-09', 20, NULL);

-- 3. 다른 유저의 기록 (파도타기 했을 때 남의 홈피 답변이 잘 보이는지 테스트용)
INSERT INTO daily_qna_log (host_id, q_date, q_id, answer)
VALUES ('friend_user', '2026-04-09', 5, '자바스크립트 버그 드디어 잡았을 때!! 짜릿했다 ✨');

COMMIT;

select * from daily_qna_log;