-- QnA 창고 테이블 생성
CREATE TABLE qna_list (
                          q_id NUMBER(3) PRIMARY KEY,
                          question VARCHAR2(200 CHAR) NOT NULL
);

-- 질문 더미 데이터
INSERT INTO qna_list VALUES (1, '타임머신을 타고 갈 수 있다면 언제로?');
INSERT INTO qna_list VALUES (2, '나를 한 단어로 표현한다면?');
INSERT INTO qna_list VALUES (3, '최근에 가장 크게 웃었던 일은?');
INSERT INTO qna_list VALUES (4, '로또 1등에 당첨된다면 제일 먼저 할 일은?');
INSERT INTO qna_list VALUES (5, '요즘 나의 가장 큰 관심사는?');
INSERT INTO qna_list VALUES (6, '내가 가장 좋아하는 계절과 그 이유는?');
INSERT INTO qna_list VALUES (7, '무인도에 떨어졌을 때 꼭 챙길 세 가지는?');
INSERT INTO qna_list VALUES (8, '10년 뒤의 나에게 한마디 해준다면?');
INSERT INTO qna_list VALUES (9, '내 인생 최고의 여행지는 어디였나요?');
INSERT INTO qna_list VALUES (10, '우울할 때 기분을 푸는 나만의 확실한 방법은?');
INSERT INTO qna_list VALUES (11, '살면서 해본 가장 큰 일탈은 무엇인가요?');
INSERT INTO qna_list VALUES (12, '절대 포기할 수 없는 나의 소울푸드 1위는?');
INSERT INTO qna_list VALUES (13, '하루 중 내가 가장 좋아하는 시간대는 언제?');
INSERT INTO qna_list VALUES (14, '초능력을 딱 하나 가질 수 있다면 어떤 능력?');
INSERT INTO qna_list VALUES (15, '요즘 나를 가장 소소하게 행복하게 만드는 것은?');
INSERT INTO qna_list VALUES (16, '내 인생을 영화로 만든다면 어떤 장르일까?');
INSERT INTO qna_list VALUES (17, '죽기 전에 꼭 해보고 싶은 버킷리스트 1위는?');
INSERT INTO qna_list VALUES (18, '지금까지 살면서 받았던 가장 감동적인 선물은?');
INSERT INTO qna_list VALUES (19, '스마트폰에서 가장 많이 쓰는 앱 3가지는?');
INSERT INTO qna_list VALUES (20, '지금 당장 눈을 감았다 떴을 때 있었으면 하는 곳은?');
COMMIT;
select * from qna_list;