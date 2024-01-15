\echo 'Delete and recreate captap db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE captap;
CREATE DATABASE captap;
\connect captap

\i captap-schema.sql
\i captap-seed.sql

\echo 'Delete and recreate captap_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE captap_test;
CREATE DATABASE captap_test;
\connect captap_test

\i captap-schema.sql
