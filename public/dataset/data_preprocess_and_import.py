import os
import json

g_constStrDataSourceFolderName = "revisions"

g_constStrDataBaseName = "wikipedia"
g_constStrCollectionName = "revisions"

g_constStrAdminActiveFile = "admin_active.txt"
g_constStrAdminFormerFile = "admin_former.txt"
g_constStrAdminInactiveFile = "admin_inactive.txt"
g_constStrAdminSemiActiveFile = "admin_semi_active.txt"
g_constStrBotFile = "bot.txt"

g_consStrAffix = "_preprocessed"

def import_new_json_files_to_collection():
    global g_constStrDataSourceFolderName
    global g_constStrDataBaseName
    global g_constStrCollectionName
    print("importing pre-processed json files to database...")
    strExePath = os.getcwd() + "/"
    strDataPath = strExePath + g_constStrDataSourceFolderName + g_consStrAffix + "/"
    lstJsonDataFiles = os.listdir(strDataPath)

    nCounter = 0
    for eachFile in lstJsonDataFiles:
        strTmp = "mongoimport --jsonArray --db "  + g_constStrDataBaseName + " --collection " + g_constStrCollectionName + " --file " + "\"" + strDataPath + eachFile + "\""
        os.system(strTmp)
        nCounter += 1

    print("finished importing. File count: " + str(nCounter))


if __name__ == '__main__':
    print("constructing name dictionaries...")
    aryAdminActive = [line.rstrip('\n') for line in open(g_constStrAdminActiveFile, encoding='utf-8')]
    aryAdminFormer = [line.rstrip('\n') for line in open(g_constStrAdminFormerFile, encoding='utf-8')]
    aryAdminInactive = [line.rstrip('\n') for line in open(g_constStrAdminInactiveFile, encoding='utf-8')]
    aryAdminSemiActive = [line.rstrip('\n') for line in open(g_constStrAdminSemiActiveFile, encoding='utf-8')]
    aryBot = [line.rstrip('\n') for line in open(g_constStrBotFile, encoding='utf-8')]

    #print(aryAdminActive[-20:])

    print("constructing data file list...")
    strExePath = os.getcwd() + "/"
    strDataSourceFolderPath = strExePath + g_constStrDataSourceFolderName + "/"
    lstJsonDataFiles = os.listdir(strDataSourceFolderPath)

    strNewDirectoryName = g_constStrDataSourceFolderName + g_consStrAffix
    print("making temporary file holder: " + strNewDirectoryName  + "...")

    if os.path.isdir(strNewDirectoryName) == True:
        print("Directory " + strNewDirectoryName + " already exists. Please delete this directory and restart the script!")
        #os.system("pause")
        exit()

    os.system("mkdir " + strNewDirectoryName)

    print("pre-processing data files...")
    for eachFile in lstJsonDataFiles:
        if eachFile.split('.')[-1] != 'json':
            continue
        print("current file name: 【" + eachFile + "】")
        lstObjects = json.load(open(strDataSourceFolderPath + eachFile, "r", encoding='utf-8'))
        # counter format:
        # 0: anon 1: admin_active 2: admin_former 3: admin_inactive 4: admin_semi_active 5: bot  6: regular  7:hidden
        aryNCounter = [0, 0, 0, 0, 0, 0, 0, 0]
        for eachObject in lstObjects:
            bIsAnon = eachObject.get('anon')
            if bIsAnon != None:
                eachObject['user_type'] = "anon"
                aryNCounter[0] += 1
                continue

            strUserName = eachObject.get('user')
            if strUserName != None:
                if strUserName in aryAdminActive:
                    eachObject['user_type'] = "admin_active"
                    aryNCounter[1] += 1
                elif strUserName in aryAdminFormer:
                    eachObject['user_type'] = "admin_former"
                    aryNCounter[2] += 1
                elif strUserName in aryAdminInactive:
                    eachObject['user_type'] = "admin_inactive"
                    aryNCounter[3] += 1
                elif strUserName in aryAdminSemiActive:
                    eachObject['user_type'] = "admin_semi_active"
                    aryNCounter[4] += 1
                elif strUserName in aryBot:
                    eachObject['user_type'] = "bot"
                    aryNCounter[5] += 1
                else:
                    eachObject['user_type'] = "regular"
                    aryNCounter[6] += 1
            elif eachObject.get('userhidden') != None:
                eachObject['user_type'] = "hidden"
                aryNCounter[7] += 1


        print("anon: " + str(aryNCounter[0]) + "\r\n" +
              "admin_active: " + str(aryNCounter[1]) + "\r\n" +
              "admin_former: " + str(aryNCounter[2]) + "\r\n" +
              "admin_inactive: " + str(aryNCounter[3]) + "\r\n" +
              "admin_semi_active: " + str(aryNCounter[4]) + "\r\n" +
              "bot: " + str(aryNCounter[5]) + "\r\n" +
              "regular: " + str(aryNCounter[6]) + "\r\n" +
              "hidden: " + str(aryNCounter[7]) + "\r\n")
        print("Total: " + str(aryNCounter[0] + aryNCounter[1] + aryNCounter[2] + aryNCounter[3] + aryNCounter[4] + aryNCounter[5] + aryNCounter[6] + aryNCounter[7]))
        # (Total != Check) means abnormal :
        # this object does not have 'user' (which is very bad), and it does not have 'userhidden' either (which is even worse).
        print("Check: " + str(len(lstObjects)))

        json.dump(lstObjects, open(strNewDirectoryName + "/" + eachFile, "w"), indent=4, sort_keys=True)

    print("finished pre-processing!")
    #print("press ENTER to import pre-processed data to MongoDB.")
    #os.system("pause")
    import_new_json_files_to_collection()
    print("success!")
