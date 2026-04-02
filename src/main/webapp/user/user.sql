create table userReg(
                       u_pk varchar2(15 char) primary key,
                       u_name varchar2(30 char) not null,
                       u_birth date not null,
                       u_id varchar2(30 char) not null unique,
                       u_pw varchar2(100 char) not null,
                       u_nickname varchar2(30 char) not null unique,
                       u_join_date date default sysdate not null

);

alter table userReg add u_email varchar2(100 char) unique;

select * from USERREG;

delete from USERREG where u_id='weweww';