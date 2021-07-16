CREATE TABLE public.users (
  "_id" serial PRIMARY KEY,
  "name" varchar,
  "email" varchar,
  "username" varchar UNIQUE,
  "password" varchar
) WITH (
  OIDS=FALSE
);

CREATE TABLE public.graphqlurls (
  "_id" serial PRIMARY KEY,
  "nickname" varchar,
  "url" varchar,
  "user_id" bigint,
  FOREIGN KEY (user_id) REFERENCES users (_id)
) WITH (
  OIDS=FALSE
);

CREATE TABLE public.queries (
  "_id" serial PRIMARY KEY,
  "query_name" varchar,
  "query_string" varchar,
  "url_id" bigint,
  FOREIGN KEY (url_id) REFERENCES graphqlurls (_id)
) WITH (
  OIDS=FALSE
);

CREATE TABLE public.response_times (
  "_id" serial PRIMARY KEY,
  "date" varchar,
  "response_time" float,
  "query_id" bigint,
  FOREIGN KEY (query_id) REFERENCES queries (_id)
) WITH (
  OIDS=FALSE
);

CREATE TABLE public.load_test_response_times (
  "_id" serial PRIMARY KEY,
  "date" varchar,
  "number_of_child_processes" bigint,
  "average_response_time" float,
  "result" varchar,
  "query_id" bigint,
  FOREIGN KEY (query_id) REFERENCES queries (_id)
) WITH (
  OIDS=FALSE
);
