# Steps for Importing New Data

## 1. Data Source Format
The data source should be a folder, which contains the following files/folder:

- admin_active.txt
- admin_former.txt
- admin_inactive.txt
- admin_semi_active.txt
- bot.txt
- revisions (folder), which contains the raw data queried from WikiPedia API
- data_preprocess_and_import.py

The revisions folder should solely contain .json files.

## 2. Begin to Import

Follow the steps:

1. (Optional) Dump the original collection: revisons and overallInfo.
2. Stop the server. forever stopall
3. Change the auth config of MongoDB: /home/bitnami/stack/mongodb/mongodb.conf. Uncomment/comment the lines 'noauth = true' to temporily disable authentication (for the sake of easy importing without username and password).
4. Restart MongoDB. sudo bash /home/bitnami/stack/ctlscript.sh restart mongodb
5. run python3 data_preprocess_and_import.py.
6. Change the auth config of MongoDB back to the previous status (refer to step2).
7. run sudo node /apps/models/establishOverall.js for once, to establish the overallInfo collection.
8. Restart the server. forever start article_insights_server.js

