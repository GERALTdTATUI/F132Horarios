#!/bin/bash

sed -e "s|\"#clmnHdrs#\"|${clmnHdrs//&/\\&}|g" \
-e "s|\"#data_sources#\"|${data_sources//&/\\&}|g" \
-e "s|\"#excelLastEditedSource#\"|${excelLastEditedSource//&/\\&}|g" \
-e "s|\"#ignoredWordFilters#\"|${ignoredWordFilters//&/\\&}|g" \
-e "s|\"#ignoredExclusiveFilters#\"|${ignoredExclusiveFilters//&/\\&}|g" \
parameters.template.js > parameters.js

exit 0;