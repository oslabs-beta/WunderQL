CREATE TABLE public.users (
	"_id" serial PRIMARY KEY,
	"username" varchar UNIQUE,
	"password" varchar
) WITH (
  OIDS=FALSE
);


CREATE TABLE public.projects (
	"_id" serial PRIMARY KEY,
	"project_name" varchar,
	"user_id" bigint,
	FOREIGN KEY (user_id) REFERENCES users (_id)
) WITH (
  OIDS=FALSE
);


CREATE TABLE public.graphqlurls (
	"_id" serial PRIMARY KEY,
	"url" varchar,
	"project_id" bigint,
	FOREIGN KEY (project_id) REFERENCES projects (_id)
) WITH (
  OIDS=FALSE
);

CREATE TABLE public.queries (
	"_id" serial PRIMARY KEY,
	"query_string" varchar,
	"url_id" bigint,
	FOREIGN KEY (url_id) REFERENCES graphqlurls (_id)
) WITH (
  OIDS=FALSE
);

CREATE TABLE public.response_times (
	"_id" serial PRIMARY KEY,
  "date" bigint,
  "response_time" float,
	"query_id" bigint,
	FOREIGN KEY (query_id) REFERENCES queries (_id)
) WITH (
  OIDS=FALSE
);

