#!/bin/bash

DATE=`date +'%Y%m%d'`


7z a -r "$DATE-mdbitwarden-chromeext.zip" src/
mv "$DATE-mdbitwarden-chromeext.zip" builds/


echo ""
echo "DONE, .zip in builds/"
