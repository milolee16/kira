CREATE TABLE main_test (
                           host_id VARCHAR2(15 CHAR) NOT NULL UNIQUE,
                           hompy_title VARCHAR2(100 CHAR) NOT NULL,    -- ⭐ 미니홈피 제목 추가!
                           st_message VARCHAR2(100 CHAR) NOT NULL,
                           my_img VARCHAR2(100 CHAR) NOT NULL,
                           main_img VARCHAR2(100 CHAR) NOT NULL
);
INSERT INTO main_test VALUES ('test124', '동민이의 소소한 일상', '테스트 메세지입니다.', 'test_img.jpg', 'main_img.jpg');
INSERT INTO main_test VALUES ('user1', '프론트엔드 정복기', '코딩 너무 재밌다!', 'my_pic.jpg', 'cover.jpg');
-- USERREG의 아이디와 1:1로 매칭되는 메인 데이터입니다.
INSERT INTO main_test VALUES ('user01', '철수의 아늑한 다락방', '오늘도 평화로운 하루입니다.', 'chulsoo_p.jpg', 'chulsoo_m.jpg');
INSERT INTO main_test VALUES ('user02', '영희의 비밀 정원', '꽃들이 만개하는 계절이네요. 🌸', 'yh_profile.png', 'yh_main.png');
INSERT INTO main_test VALUES ('user03', '지민이의 연습실', '춤추는 게 제일 행복해!', 'jimin_v.jpg', 'jimin_bg.jpg');
INSERT INTO main_test VALUES ('coder_kim', '코드 깎는 노인의 작업실', '버그 없는 세상에서 살고 싶다...', 'kim_code.png', 'kim_main.png');
INSERT INTO main_test VALUES ('java_master', 'Java Master의 성지', '객체 지향은 예술입니다.', 'java_p.jpg', 'java_m.jpg');
INSERT INTO main_test VALUES ('spring_guy', '스프링이 좋아!', '의존성 주입은 제 삶의 일부입니다.', 'spring_p.jpg', 'spring_m.jpg');
INSERT INTO main_test VALUES ('front_dev', '반짝이는 화면 구현소', 'CSS는 정답이 없다. 감각일 뿐.', 'front_p.jpg', 'front_m.jpg');
INSERT INTO main_test VALUES ('back_dev', '데이터가 흐르는 강', '서버는 멈추지 않는다.', 'back_p.jpg', 'back_m.jpg');
INSERT INTO main_test VALUES ('db_admin', 'SQL의 모든 것', '인덱스 설계가 끝났습니다.', 'db_p.jpg', 'db_m.jpg');
INSERT INTO main_test VALUES ('ui_ux', '디자인이 세상을 구한다', '사용자 경험을 디자인합니다.', 'uiux_p.jpg', 'uiux_m.jpg');
INSERT INTO main_test VALUES ('fullstack', '풀스택 개발자의 하루', '프론트부터 백엔드까지 쭉!', 'full_p.jpg', 'full_m.jpg');
INSERT INTO main_test VALUES ('html_css', '마크업의 정석', '시맨틱 태그는 필수죠.', 'html_p.jpg', 'html_m.jpg');
INSERT INTO main_test VALUES ('js_ninja', 'JavaScript Ninja', '클로저의 세계로 오세요.', 'js_p.jpg', 'js_m.jpg');
INSERT INTO main_test VALUES ('react_fan', 'React Playground', '컴포넌트 쪼개기가 취미입니다.', 'react_p.jpg', 'react_m.jpg');
INSERT INTO main_test VALUES ('vue_lover', 'Vue.js가 미래다', '양방향 바인딩은 사랑입니다.', 'vue_p.jpg', 'vue_m.jpg');
INSERT INTO main_test VALUES ('node_boy', 'Node.js 런타임', '비동기 논블로킹의 매력.', 'node_p.jpg', 'node_m.jpg');
INSERT INTO main_test VALUES ('sql_pro', '쿼리 마스터의 공간', '최적화된 쿼리만 취급합니다.', 'sql_p.jpg', 'sql_m.jpg');
INSERT INTO main_test VALUES ('aws_cloud', '클라우드 위에서', '서버리스는 혁명입니다.', 'cloud_p.jpg', 'cloud_m.jpg');
INSERT INTO main_test VALUES ('git_hub', '1일 1커밋 저장소', '잔디 심기가 제일 뿌듯해.', 'git_p.jpg', 'git_m.jpg');
INSERT INTO main_test VALUES ('linux_user', '우분투와 함께라면', '터미널은 제 집 같습니다.', 'linux_p.jpg', 'linux_m.jpg');

-- 데이터 반영 확정
ALTER TABLE main_test ADD st_date DATE DEFAULT SYSDATE;
select * from main_test;