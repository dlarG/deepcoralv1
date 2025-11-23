--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-10-26 23:59:21

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5907 (class 1262 OID 19575)
-- Name: deep_coral_ai; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE deep_coral_ai WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Philippines.1252';


ALTER DATABASE deep_coral_ai OWNER TO postgres;

\connect deep_coral_ai

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 28064)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 5908 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- TOC entry 1621 (class 1247 OID 19588)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'guest',
    'biologist'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 19675)
-- Name: activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activities (
    id integer NOT NULL,
    user_id integer,
    activity_type character varying(50) NOT NULL,
    activity_description text NOT NULL,
    metadata jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.activities OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 19674)
-- Name: activities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activities_id_seq OWNER TO postgres;

--
-- TOC entry 5909 (class 0 OID 0)
-- Dependencies: 222
-- Name: activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.activities_id_seq OWNED BY public.activities.id;


--
-- TOC entry 219 (class 1259 OID 19577)
-- Name: coral_information; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coral_information (
    id integer NOT NULL,
    coral_type character varying(100) NOT NULL,
    coral_subtype character varying(100),
    classification character varying(100),
    scientific_name character varying(150),
    common_name character varying(100),
    identification text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    image text
);


ALTER TABLE public.coral_information OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 19576)
-- Name: coral_information_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coral_information_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coral_information_id_seq OWNER TO postgres;

--
-- TOC entry 5910 (class 0 OID 0)
-- Dependencies: 218
-- Name: coral_information_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coral_information_id_seq OWNED BY public.coral_information.id;


--
-- TOC entry 236 (class 1259 OID 29194)
-- Name: coral_instances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coral_instances (
    id integer NOT NULL,
    segmentation_id integer,
    instance_number integer,
    area_px integer,
    confidence numeric(3,2),
    bbox_coordinates jsonb
);


ALTER TABLE public.coral_instances OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 29193)
-- Name: coral_instances_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coral_instances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coral_instances_id_seq OWNER TO postgres;

--
-- TOC entry 5911 (class 0 OID 0)
-- Dependencies: 235
-- Name: coral_instances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coral_instances_id_seq OWNED BY public.coral_instances.id;


--
-- TOC entry 232 (class 1259 OID 29162)
-- Name: coral_lifeforms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coral_lifeforms (
    id integer NOT NULL,
    class_name character varying(100) NOT NULL,
    scientific_name character varying(255),
    category character varying(50),
    color_hex character varying(7),
    description text
);


ALTER TABLE public.coral_lifeforms OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 29161)
-- Name: coral_lifeforms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coral_lifeforms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coral_lifeforms_id_seq OWNER TO postgres;

--
-- TOC entry 5912 (class 0 OID 0)
-- Dependencies: 231
-- Name: coral_lifeforms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coral_lifeforms_id_seq OWNED BY public.coral_lifeforms.id;


--
-- TOC entry 230 (class 1259 OID 29145)
-- Name: images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.images (
    id integer NOT NULL,
    filename character varying(255) NOT NULL,
    uploader_id integer,
    uploaded_at timestamp without time zone DEFAULT now(),
    location public.geometry(Point,4326),
    quadrat_crop_path text,
    original_image_path text,
    total_pixels integer,
    analyzed_area_px integer,
    analysis_confidence numeric(3,2),
    processing_status character varying(20) DEFAULT 'pending'::character varying,
    CONSTRAINT enforce_srid_location CHECK ((public.st_srid(location) = 4326))
);


ALTER TABLE public.images OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 29144)
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.images_id_seq OWNER TO postgres;

--
-- TOC entry 5913 (class 0 OID 0)
-- Dependencies: 229
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.images_id_seq OWNED BY public.images.id;


--
-- TOC entry 234 (class 1259 OID 29173)
-- Name: segmentation_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.segmentation_results (
    id integer NOT NULL,
    image_id integer,
    class_id integer,
    instance_count integer DEFAULT 0,
    area_px integer NOT NULL,
    coverage_percent numeric(5,2),
    avg_confidence numeric(3,2),
    mask_path text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.segmentation_results OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 29172)
-- Name: segmentation_results_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.segmentation_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.segmentation_results_id_seq OWNER TO postgres;

--
-- TOC entry 5914 (class 0 OID 0)
-- Dependencies: 233
-- Name: segmentation_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.segmentation_results_id_seq OWNED BY public.segmentation_results.id;


--
-- TOC entry 221 (class 1259 OID 19596)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    firstname character varying(100) NOT NULL,
    middlename character varying(100),
    lastname character varying(100) NOT NULL,
    profile_image text,
    roletype public.user_role DEFAULT 'guest'::public.user_role NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    bio text,
    status text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 19595)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5915 (class 0 OID 0)
-- Dependencies: 220
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 5693 (class 2604 OID 19678)
-- Name: activities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities ALTER COLUMN id SET DEFAULT nextval('public.activities_id_seq'::regclass);


--
-- TOC entry 5687 (class 2604 OID 19580)
-- Name: coral_information id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coral_information ALTER COLUMN id SET DEFAULT nextval('public.coral_information_id_seq'::regclass);


--
-- TOC entry 5702 (class 2604 OID 29197)
-- Name: coral_instances id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coral_instances ALTER COLUMN id SET DEFAULT nextval('public.coral_instances_id_seq'::regclass);


--
-- TOC entry 5698 (class 2604 OID 29165)
-- Name: coral_lifeforms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coral_lifeforms ALTER COLUMN id SET DEFAULT nextval('public.coral_lifeforms_id_seq'::regclass);


--
-- TOC entry 5695 (class 2604 OID 29148)
-- Name: images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images ALTER COLUMN id SET DEFAULT nextval('public.images_id_seq'::regclass);


--
-- TOC entry 5699 (class 2604 OID 29176)
-- Name: segmentation_results id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.segmentation_results ALTER COLUMN id SET DEFAULT nextval('public.segmentation_results_id_seq'::regclass);


--
-- TOC entry 5690 (class 2604 OID 19599)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5893 (class 0 OID 19675)
-- Dependencies: 223
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5889 (class 0 OID 19577)
-- Dependencies: 219
-- Data for Name: coral_information; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.coral_information VALUES (4, 'Favia', 'Brain', 'Hard Coral', 'Favia speciosa', 'Moon Coral', 'Distinguished by maze-like ridges and valleys.', '2025-07-28 17:29:25.086687', '2025-07-28 17:29:25.086687', NULL);
INSERT INTO public.coral_information VALUES (5, 'Turbinaria', 'Scroll', 'Hard Coral', 'Turbinaria reniformis', 'Scroll Coral', 'Has leafy or scroll-like structures.', '2025-07-28 17:29:25.086687', '2025-07-28 17:29:25.086687', NULL);
INSERT INTO public.coral_information VALUES (6, 'Pocillopora', 'Cauliflower', 'Hard Coral', 'Pocillopora damicornis', 'Cauliflower Coral', 'Bushy growth form with small pointed branches.', '2025-07-28 17:29:25.086687', '2025-07-28 17:29:25.086687', NULL);
INSERT INTO public.coral_information VALUES (7, 'Goniopora', 'Flowerpot', 'Hard Coral', 'Goniopora stokesi', 'Flowerpot Coral', 'Polyp coral with long tentacles resembling flowers.', '2025-07-28 17:29:25.086687', '2025-07-28 17:29:25.086687', NULL);
INSERT INTO public.coral_information VALUES (8, 'Zoanthid', 'Colonial', 'Soft Coral', 'Zoanthus spp.', 'Button Polyp', 'Forms colorful mats with button-like polyps.', '2025-07-28 17:29:25.086687', '2025-07-28 17:29:25.086687', NULL);
INSERT INTO public.coral_information VALUES (1, 'Acropora', 'Branching', 'hard coral', 'Acropora cervicornis', 'Staghorn Coral', 'Fast-growing coral with pointed branches.', '2025-07-28 17:29:25.086687', '2025-10-17 21:32:26.355286', 'ea62dcda912c4a4792f6d577cc764172_rovic.jpg');
INSERT INTO public.coral_information VALUES (3, 'Montipora', 'Encrusting', 'soft coral', 'Montipora capricornis', 'Cap Coral', 'Flat, plating coral with a rough surface.', '2025-07-28 17:29:25.086687', '2025-10-17 21:33:03.111415', 'a0b7c7265476474a992f8c051f886377_Screenshot_2023-05-20_183504.png');


--
-- TOC entry 5901 (class 0 OID 29194)
-- Dependencies: 236
-- Data for Name: coral_instances; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5897 (class 0 OID 29162)
-- Dependencies: 232
-- Data for Name: coral_lifeforms; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5895 (class 0 OID 29145)
-- Dependencies: 230
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.images VALUES (1, 'full_quadrat_0_0_batch_0_137917ee.jpg', 1, '2025-10-17 21:25:52.894599', NULL, NULL, NULL, 7577170, 7577170, 0.96, 'completed');
INSERT INTO public.images VALUES (2, 'full_quadrat_0_0_batch_0_2aa788f2.jpg', 1, '2025-10-17 21:27:27.534208', NULL, NULL, NULL, 6665524, 6665524, 0.95, 'completed');
INSERT INTO public.images VALUES (3, 'full_quadrat_0_1_batch_1_75e20ef3.jpg', 1, '2025-10-17 21:27:32.742269', NULL, NULL, NULL, 6838188, 6838188, 0.95, 'completed');
INSERT INTO public.images VALUES (4, 'full_quadrat_0_2_batch_2_1e1103b1.jpg', 1, '2025-10-17 21:27:38.837684', NULL, NULL, NULL, 6187376, 6187376, 0.95, 'completed');
INSERT INTO public.images VALUES (5, 'full_quadrat_0_3_batch_3_f60a6a52.jpg', 1, '2025-10-17 21:27:45.33681', NULL, NULL, NULL, 7577170, 7577170, 0.96, 'completed');
INSERT INTO public.images VALUES (6, 'full_quadrat_0_4_batch_4_0a13ea9d.jpg', 1, '2025-10-17 21:27:49.724339', NULL, NULL, NULL, 7121906, 7121906, 0.97, 'completed');
INSERT INTO public.images VALUES (7, 'full_quadrat_0_5_batch_5_b3c1d854.jpg', 1, '2025-10-17 21:27:52.953604', NULL, NULL, NULL, 6394971, 6394971, 0.97, 'completed');
INSERT INTO public.images VALUES (8, 'full_quadrat_0_6_batch_6_717de38b.jpg', 1, '2025-10-17 21:27:57.468776', NULL, NULL, NULL, 7104060, 7104060, 0.96, 'completed');
INSERT INTO public.images VALUES (9, 'full_quadrat_0_7_batch_7_2ebceae9.jpg', 1, '2025-10-17 21:28:01.187956', NULL, NULL, NULL, 6481068, 6481068, 0.96, 'completed');
INSERT INTO public.images VALUES (10, 'full_quadrat_0_8_batch_8_53db69d1.jpg', 1, '2025-10-17 21:28:05.245157', NULL, NULL, NULL, 6603180, 6603180, 0.96, 'completed');
INSERT INTO public.images VALUES (11, 'full_quadrat_0_9_batch_9_21c57568.jpg', 1, '2025-10-17 21:28:08.959347', NULL, NULL, NULL, 6049068, 6049068, 0.95, 'completed');
INSERT INTO public.images VALUES (12, 'full_quadrat_0_10_batch_10_c5ed02a3.jpg', 1, '2025-10-17 21:28:12.362577', NULL, NULL, NULL, 6700026, 6700026, 0.97, 'completed');
INSERT INTO public.images VALUES (13, 'half_quadrat_0_0_batch_0_b775065e.jpg', 1, '2025-10-17 21:30:00.214011', NULL, NULL, NULL, 11815240, 11815240, 0.71, 'completed');


--
-- TOC entry 5899 (class 0 OID 29173)
-- Dependencies: 234
-- Data for Name: segmentation_results; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5686 (class 0 OID 28386)
-- Dependencies: 225
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5891 (class 0 OID 19596)
-- Dependencies: 221
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (1, 'AnonJeffz', 'scrypt:32768:8:1$qJdyUcAaTdZlHUj4$856f9bfef0ca3261c8b9f39fa9acb65fe4322d0781b80f837d06afb0cc74819cc2cffd2b8ae4fc499590c84653b140915b11137503e22b854dcc48a5c3627ee6', 'Jefferson', NULL, 'Itaok', NULL, 'guest', '2025-07-24 21:30:36.126721', NULL, NULL, NULL, NULL);
INSERT INTO public.users VALUES (4, 'Percival', 'scrypt:32768:8:1$uPSEFQb6gQMmozRd$3fc861807d476a6847dde159c7c5817c8e3036a0631fda9093e6fc5d7becd8c832901b12304eaaaecc8495577c4fee6dcc260532deb5a597436aaa496149a7dc', 'Percival', NULL, 'Admin', NULL, 'admin', '2025-07-28 18:55:11.400382', NULL, NULL, NULL, NULL);
INSERT INTO public.users VALUES (2, 'admin', 'scrypt:32768:8:1$cdylHODYOmBQPHS1$c61934673a9aa72c4e64bdf36132d12cdb041f194d5ef61f71e7417ca4c68a69cdf87df24a7f2c51812e7f9f05a540d14ca35fa4bd69c4c007214c3708fc1ace', 'Admin', NULL, 'Itaok', NULL, 'admin', '2025-07-28 18:08:19.508632', NULL, NULL, NULL, NULL);
INSERT INTO public.users VALUES (7, 'rald', 'pbkdf2:sha256:600000$4nQXxfbBN8XPIr28$2d3127a72bb0fac995808de5c6fb57427b13c131ccd07264af3944a584420fe1', 'Gerald', NULL, 'Catina', NULL, 'admin', '2025-10-17 21:12:47.041237', NULL, NULL, NULL, 'approved');
INSERT INTO public.users VALUES (6, 'AdminJeff', 'scrypt:32768:8:1$x9YKsBrBTSAWIptg$e1848859bb7bed0819aeff9e0dd3d4c85c952030b57e49a2259b3262f44b59c038b2a30134c6c9aa8a80b3c22337aeeb4d595a58d16a5591d5b910f17df29991', 'Admin', NULL, 'Jeffs', NULL, 'admin', '2025-08-19 18:04:59.07843', NULL, NULL, NULL, 'approved');


--
-- TOC entry 5916 (class 0 OID 0)
-- Dependencies: 222
-- Name: activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activities_id_seq', 1, false);


--
-- TOC entry 5917 (class 0 OID 0)
-- Dependencies: 218
-- Name: coral_information_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.coral_information_id_seq', 1, false);


--
-- TOC entry 5918 (class 0 OID 0)
-- Dependencies: 235
-- Name: coral_instances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.coral_instances_id_seq', 1, false);


--
-- TOC entry 5919 (class 0 OID 0)
-- Dependencies: 231
-- Name: coral_lifeforms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.coral_lifeforms_id_seq', 13, true);


--
-- TOC entry 5920 (class 0 OID 0)
-- Dependencies: 229
-- Name: images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.images_id_seq', 13, true);


--
-- TOC entry 5921 (class 0 OID 0)
-- Dependencies: 233
-- Name: segmentation_results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.segmentation_results_id_seq', 1, false);


--
-- TOC entry 5922 (class 0 OID 0)
-- Dependencies: 220
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- TOC entry 5712 (class 2606 OID 19683)
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- TOC entry 5706 (class 2606 OID 19586)
-- Name: coral_information coral_information_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coral_information
    ADD CONSTRAINT coral_information_pkey PRIMARY KEY (id);


--
-- TOC entry 5732 (class 2606 OID 29201)
-- Name: coral_instances coral_instances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coral_instances
    ADD CONSTRAINT coral_instances_pkey PRIMARY KEY (id);


--
-- TOC entry 5724 (class 2606 OID 29171)
-- Name: coral_lifeforms coral_lifeforms_class_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coral_lifeforms
    ADD CONSTRAINT coral_lifeforms_class_name_key UNIQUE (class_name);


--
-- TOC entry 5726 (class 2606 OID 29169)
-- Name: coral_lifeforms coral_lifeforms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coral_lifeforms
    ADD CONSTRAINT coral_lifeforms_pkey PRIMARY KEY (id);


--
-- TOC entry 5722 (class 2606 OID 29155)
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- TOC entry 5730 (class 2606 OID 29182)
-- Name: segmentation_results segmentation_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.segmentation_results
    ADD CONSTRAINT segmentation_results_pkey PRIMARY KEY (id);


--
-- TOC entry 5708 (class 2606 OID 19605)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5710 (class 2606 OID 19607)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 5713 (class 1259 OID 19691)
-- Name: idx_activities_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activities_created_at ON public.activities USING btree (created_at);


--
-- TOC entry 5714 (class 1259 OID 19690)
-- Name: idx_activities_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activities_type ON public.activities USING btree (activity_type);


--
-- TOC entry 5715 (class 1259 OID 19689)
-- Name: idx_activities_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activities_user_id ON public.activities USING btree (user_id);


--
-- TOC entry 5716 (class 1259 OID 19692)
-- Name: idx_activities_user_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activities_user_type ON public.activities USING btree (user_id, activity_type);


--
-- TOC entry 5719 (class 1259 OID 29213)
-- Name: idx_images_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_images_location ON public.images USING gist (location);


--
-- TOC entry 5720 (class 1259 OID 29214)
-- Name: idx_images_uploaded_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_images_uploaded_at ON public.images USING btree (uploaded_at);


--
-- TOC entry 5727 (class 1259 OID 29216)
-- Name: idx_segmentation_results_class_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_segmentation_results_class_id ON public.segmentation_results USING btree (class_id);


--
-- TOC entry 5728 (class 1259 OID 29215)
-- Name: idx_segmentation_results_image_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_segmentation_results_image_id ON public.segmentation_results USING btree (image_id);


--
-- TOC entry 5733 (class 2606 OID 19684)
-- Name: activities activities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5737 (class 2606 OID 29202)
-- Name: coral_instances coral_instances_segmentation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coral_instances
    ADD CONSTRAINT coral_instances_segmentation_id_fkey FOREIGN KEY (segmentation_id) REFERENCES public.segmentation_results(id);


--
-- TOC entry 5734 (class 2606 OID 29156)
-- Name: images images_uploader_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_uploader_id_fkey FOREIGN KEY (uploader_id) REFERENCES public.users(id);


--
-- TOC entry 5735 (class 2606 OID 29188)
-- Name: segmentation_results segmentation_results_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.segmentation_results
    ADD CONSTRAINT segmentation_results_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.coral_lifeforms(id);


--
-- TOC entry 5736 (class 2606 OID 29183)
-- Name: segmentation_results segmentation_results_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.segmentation_results
    ADD CONSTRAINT segmentation_results_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.images(id) ON DELETE CASCADE;


-- Completed on 2025-10-26 23:59:21

--
-- PostgreSQL database dump complete
--

