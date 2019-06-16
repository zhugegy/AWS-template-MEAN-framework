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
2. Change the auth config of MongoDB: /home/bitnami/stack/mongodb/mongodb.conf. Uncomment/comment the lines 'noauth = true' to temporily disable authentication (for the sake of easy importing without username and password).
3. run python3 data_preprocess_and_import.py.
4. Change the auth config of MongoDB back to the previous status (refer to step2).
5. run sudo node /apps/models/establishOverall.js for once, to establish the overallInfo collection.

