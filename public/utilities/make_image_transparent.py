import os

os.system("mkdir transparent_images")

aryFilesCur = os.listdir()


# convert basic_information_cn.png -transparent white trans.png
for eachfile in aryFilesCur:
    if eachfile.split('.')[-1] == 'png':
        strTmp = "convert " + eachfile + " -transparent white transparent_images/" + eachfile
        os.system(strTmp)

# when it does not work well:
# convert globe.png -channel RGB -threshold 80% black_and_white.png
# convert black_and_white.png -alpha set -transparent white out.png
