create table userReg(
                       u_pk varchar2(15 char) primary key,
                       u_name varchar2(30 char) not null,
                       u_birth date not null,
                       u_id varchar2(30 char) not null unique,
                       u_pw varchar2(100 char) not null,
                       u_nickname varchar2(30 char) not null unique,
                       u_join_date date default sysdate not null
);
select * from USERREG;




insert into USERREG values('test1test1test1','DongMin','2001-01-01','test123','test123','DongMin','2026-03-31','test@email.com');

insert into USERREG values('user01', '김철수', '1995-05-12', 'pass01', 'pass01', '철수쓰', '2026-04-01', 'chulsoo@email.com');
insert into USERREG values('user02', '이영희', '1998-11-23', 'pass02', 'pass02', '영희꽃', '2026-04-02', 'younghee@email.com');
insert into USERREG values('user03', '박지민', '2000-02-14', 'pass03', 'pass03', '지민팍', '2026-04-03', 'jimin@email.com');
insert into USERREG values('coder_kim', '김코드', '1992-07-08', 'dev123', 'dev123', '코딩왕', '2026-04-04', 'coder@email.com');
insert into USERREG values('java_master', '박자바', '1990-12-01', 'java123', 'java123', '자바요정', '2026-04-04', 'java@email.com');
insert into USERREG values('spring_guy', '최스프링', '1996-03-15', 'sp123', 'sp123', '스프링맨', '2026-04-05', 'spring@email.com');
insert into USERREG values('front_dev', '오프론트', '1999-09-09', 'front1', 'front1', '프론트깎이', '2026-04-05', 'front@email.com');
insert into USERREG values('back_dev', '정백엔', '1994-06-20', 'back12', 'back12', '백엔드신', '2026-04-06', 'back@email.com');
insert into USERREG values('db_admin', '강디비', '1988-01-30', 'dbdb12', 'dbdb12', '디비디비딥', '2026-04-06', 'dbadmin@email.com');
insert into USERREG values('ui_ux', '윤디자인', '1997-04-18', 'uiux12', 'uiux12', '금손디자이너', '2026-04-07', 'design@email.com');
insert into USERREG values('fullstack', '송풀스', '1993-08-22', 'full12', 'full12', '풀스택마스터', '2026-04-07', 'fullstack@email.com');
insert into USERREG values('html_css', '조마크', '2002-10-10', 'html12', 'html12', '마크업장인', '2026-04-08', 'markup@email.com');
insert into USERREG values('js_ninja', '임자바', '2001-05-05', 'jsjs12', 'jsjs12', '제이에스닌자', '2026-04-08', 'js@email.com');
insert into USERREG values('react_fan', '한리액', '1995-12-25', 'react1', 'react1', '리액트러버', '2026-04-09', 'react@email.com');
insert into USERREG values('vue_lover', '백뷰뷰', '1998-03-03', 'vue123', 'vue123', '뷰가미래다', '2026-04-09', 'vue@email.com');
insert into USERREG values('node_boy', '노드군', '1996-07-07', 'node12', 'node12', '노드소년', '2026-04-10', 'node@email.com');
insert into USERREG values('sql_pro', '안쿼리', '1991-09-11', 'sql123', 'sql123', '쿼리깎는노인', '2026-04-10', 'sql@email.com');
insert into USERREG values('aws_cloud', '구클라', '1989-11-11', 'aws123', 'aws123', '구름위산책', '2026-04-11', 'cloud@email.com');
insert into USERREG values('git_hub', '허깃헙', '2000-01-20', 'git123', 'git123', '1일1커밋', '2026-04-11', 'github@email.com');
insert into USERREG values('linux_user', '황리눅', '1994-04-04', 'linux1', 'linux1', '우분투러버', '2026-04-12', 'linux@email.com');

DELETE FROM userReg WHERE u_id = 'test2';
