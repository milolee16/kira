CREATE TABLE photo (
                       photo_id    NUMBER PRIMARY KEY,        -- PK (시퀀스)
                       user_id     VARCHAR2(50) NOT NULL,     -- 작성자
                       img_name    VARCHAR2(255) NOT NULL,    -- 저장된 파일명
                       title       VARCHAR2(200) NOT NULL,    -- 제목
                       content     CLOB,                      -- 내용
                       reg_date    DATE DEFAULT SYSDATE       -- 등록일
);

CREATE SEQUENCE photo_seq START WITH 1 INCREMENT BY 1;

INSERT INTO photo (photo_id, user_id, img_name, title, content, reg_date) VALUES (photo_seq.NEXTVAL, 'user01', 'sunset.jpg', '노을 사진', '어제 본 노을이 너무 예뻐서 공유합니다.', SYSDATE);
INSERT INTO photo (photo_id, user_id, img_name, title, content, reg_date) VALUES (photo_seq.NEXTVAL, 'user02', 'coffee.png', '모닝 커피', '오늘 아침은 시원한 아이스 아메리카노 한 잔!', SYSDATE);
INSERT INTO photo (photo_id, user_id, img_name, title, content, reg_date) VALUES (photo_seq.NEXTVAL, 'admin', 'notice.jpg', '공지사항 안내', '게시판 이용 수칙을 반드시 준수해 주세요.', SYSDATE);
INSERT INTO photo (photo_id, user_id, img_name, title, content, reg_date) VALUES (photo_seq.NEXTVAL, 'user03', 'cat.jpg', '우리집 고양이', '하루 종일 잠만 자는 귀여운 나비입니다.', SYSDATE);
INSERT INTO photo (photo_id, user_id, img_name, title, content, reg_date) VALUES (photo_seq.NEXTVAL, 'user04', 'mountain.png', '등산 성공', '관악산 정상 찍고 왔습니다! 공기가 좋네요.', SYSDATE);

INSERT INTO photo (photo_id, user_id, img_name, title, content, reg_date) VALUES (photo_seq.NEXTVAL, 'user01', 'pasta.jpg', '오늘의 점심', '맛있는 봉골레 파스타를 만들어 먹었어요.', SYSDATE);
INSERT INTO photo (photo_id, user_id, img_name, title, content, reg_date) VALUES (photo_seq.NEXTVAL, 'user05', 'sky.jpg', '파란 하늘', '구름 한 점 없는 맑은 가을 하늘입니다.', SYSDATE);
INSERT INTO photo (photo_id, user_id, img_name, title, content, reg_date) VALUES (photo_seq.NEXTVAL, 'user02', 'book.png', '독서 기록', '최근에 읽은 자기계발서인데 내용이 참 알차네요.', SYSDATE);
INSERT INTO photo (photo_id, user_id, img_name, title, content, reg_date) VALUES (photo_seq.NEXTVAL, 'user06', 'flower.jpg', '길가에 핀 꽃', '산책하다가 우연히 발견한 이름 모를 예쁜 꽃.', SYSDATE);
INSERT INTO photo (photo_id, user_id, img_name, title, content, reg_date) VALUES (photo_seq.NEXTVAL, 'user07', 'work.jpg', '야근 중', '사무실에서 바라보는 야경은 참 씁쓸하네요.', SYSDATE);

INSERT INTO photo (photo_id, user_id, img_name, title, content, reg_date) VALUES (photo_seq.NEXTVAL, 'user08', 'gym.png', '오운완', '오늘 운동 완료! 뿌듯한 하루입니다.', SYSDATE);
INSERT INTO photo (photo_id, user_id, img_name, title, content, reg_date) VALUES (photo_seq.NEXTVAL, 'user01', 'sea.jpg', '강릉 바다', '오랜만에 바다 보러 왔는데 파도 소리가 좋네요.', SYSDATE);
INSERT INTO photo (photo_id, user_id, img_name, title, content, reg_date) VALUES (photo_seq.NEXTVAL, 'user09', 'dog.png', '강아지 산책', '동네 공원에서 강아지랑 신나게 뛰놀았습니다.', SYSDATE);
INSERT INTO photo (photo_id, user_id, img_name, title, content, reg_date) VALUES (photo_seq.NEXTVAL, 'user10', 'cake.jpg', '생일 파티', '친구들이 준비해준 케이크! 너무 고마워.', SYSDATE);
INSERT INTO photo (photo_id, user_id, img_name, title, content, reg_date) VALUES (photo_seq.NEXTVAL, 'user03', 'coding.png', '코딩 공부', '쿼리 짜는 게 생각보다 재밌네요. 열공!', SYSDATE);

INSERT INTO photo (photo_id, user_id, img_name, title, content, reg_date) VALUES (photo_seq.NEXTVAL, 'user04', 'ramen.jpg', '야식 타임', '결국 참지 못하고 라면을 끓이고 말았습니다.', SYSDATE);
INSERT INTO photo (photo_id, user_id, img_name, title, content, reg_date) VALUES (photo_seq.NEXTVAL, 'user11', 'car.png', '드라이브', '주말 나들이 가는 길, 차가 좀 막히네요.', SYSDATE);
INSERT INTO photo (photo_id, user_id, img_name, title, content, reg_date) VALUES (photo_seq.NEXTVAL, 'user12', 'concert.jpg', '공연 관람', '최애 가수의 콘서트에 다녀왔습니다. 대박!', SYSDATE);
INSERT INTO photo (photo_id, user_id, img_name, title, content, reg_date) VALUES (photo_seq.NEXTVAL, 'user02', 'snow.jpg', '첫눈', '드디어 첫눈이 내려요! 다들 감기 조심하세요.', SYSDATE);
INSERT INTO photo (photo_id, user_id, img_name, title, content, reg_date) VALUES (photo_seq.NEXTVAL, 'user05', 'star.png', '밤하늘', '시골 할머니 댁에서 본 별들이 쏟아질 것 같아요.', SYSDATE);

-- 모든 데이터를 반영하려면 꼭 실행해 주세요
select * from photo;