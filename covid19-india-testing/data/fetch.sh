#!/bin/bash

DIRECTORY=`dirname $0`

curl https://api.covid19india.org/state_test_data.json > $DIRECTORY/data.json
snapshot_filename=$(date "+covid-testing-data-snapshot-%Y-%m-%d-%H-%M-%S.json")
cp $DIRECTORY/data.json $DIRECTORY/$snapshot_filename

grep -F "India,IND" $DIRECTORY/covid-19-positive-rate-worldwide.csv > $DIRECTORY/covid-19-positive-rate-india.csv
india_wide_snapshot_filename=$(date "+covid-19-positive-rate-india-snapshot-%Y-%m-%d-%H-%M-%S.csv")
cp $DIRECTORY/covid-19-positive-rate-india.csv $DIRECTORY/$india_wide_snapshot_filename