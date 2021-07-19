CREATE TABLE public.users (
  "_id" serial PRIMARY KEY,
  "name" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "username" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL
) WITH (
  OIDS=FALSE
);

CREATE TABLE public.graphqlurls (
  "_id" serial PRIMARY KEY,
  "nickname" varchar NOT NULL,
  "url" varchar NOT NULL,
  "user_id" bigint NOT NULL,
  UNIQUE (url, user_id)
  FOREIGN KEY (user_id) REFERENCES users (_id)
) WITH (
  OIDS=FALSE
);

CREATE TABLE public.queries (
  "_id" serial PRIMARY KEY,
  "query_name" varchar NOT NULL,
  "query_string" varchar NOT NULL,
  "url_id" bigint NOT NULL,
  UNIQUE (query_string, url_id)
  FOREIGN KEY (url_id) REFERENCES graphqlurls (_id)
) WITH (
  OIDS=FALSE
);

CREATE TABLE public.response_times (
  "_id" serial PRIMARY KEY,
  "date" varchar NOT NULL,
  "response_time" float NOT NULL,
  "query_id" bigint NOT NULL,
  FOREIGN KEY (query_id) REFERENCES queries (_id)
) WITH (
  OIDS=FALSE
);

CREATE TABLE public.load_test_response_times (
  "_id" serial PRIMARY KEY,
  "date" varchar NOT NULL,
  "number_of_child_processes" bigint NOT NULL,
  "average_response_time" float NOT NULL,
  "result" varchar NOT NULL,
  "query_id" bigint NOT NULL,
  FOREIGN KEY (query_id) REFERENCES queries (_id)
) WITH (
  OIDS=FALSE
);

insert into users(name, email, username, password) values('frank', 'frank@codesmith.com', 'frank', '123')

INSERT INTO graphqlurls(nickname, url, user_id) VALUES ('my_first_endpoint', 'https://api.spacex.land/graphql/', 1) returning _id

INSERT INTO queries(query_name, query_string, url_id) VALUES ('my_first_query','query {
  launchesPast(limit: 10) {
      mission_name
      launch_date_local
      launch_site {
          site_name_long
        }
      }
    }', 1)

INSERT INTO response_times(response_time, query_id, date) VALUES (200.5, 1, '2021-07-17T20:25:48.261Z')

INSERT INTO load_test_response_times (date, number_of_child_processes, average_response_time, result, query_id) VALUES('2021-07-17T20:23:12.820Z', 4, 300.5, 'Success', 1)



  

  