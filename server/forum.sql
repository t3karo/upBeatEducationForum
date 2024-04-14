--work
drop TABLE if exists account;

create table account (
  id serial primary key,
  email varchar(100) unique not null,
  password varchar(255) not null
);
