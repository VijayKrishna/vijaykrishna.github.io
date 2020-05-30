#!/bin/bash

DIRECTORY=`dirname $0`

curl https://api.covid19india.org/state_test_data.json > $DIRECTORY/data.json
snapshot_filename=$(date "+covid-testing-data-snapshot-%Y-%m-%d-%H-%M-%S.json")
cp $DIRECTORY/data.json $DIRECTORY/$snapshot_filename