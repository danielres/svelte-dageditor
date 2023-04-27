#!/bin/bash

pg_ctl -D data stop
rm -rf data
mkdir -p data 
initdb -D data 
pg_ctl -D data start
createuser -s postgres 

pnpm db:migration:run
ENV=test pnpm db:migration:run