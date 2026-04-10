create table guestboard_test(
    gboard_pk varchar2(15 char) primary key,
    guest_id varchar2(15 char) not null,
    host_id varchar2(30 char) not null,
    guest_nick  varchar2(30 char) not null,
    board_content varchar2(300 char) not null,
    is_private number(1) default 0 check (is_private in (0,1)),
    created_at timestamp default systimestamp
);

insert into guestboard_test values ('1','1','1','test','test_content',0,systimestamp);

select * from guestboard_test;
select guest_nick, board_content, is_private, created_at from guestboard_test;


-- ALTER TABLE guestboard_test RENAME COLUMN guest_pk TO guest_id;

