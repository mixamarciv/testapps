::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
::задаем основные переменные окружения
@CALL "%curpath%/../../.bin/set_path.bat"


@SET path=%curpath%/../node_modules/.bin/;%path%


@CLS
@echo ==== start ===================================================================

TITLE cordova build android
CD "%curpath%/buildcordovaapp"

SET logfile="./../log.txt"
echo ===== start %date% %time% ========================================= > %logfile% 2>&1
del "C:\pg\prjs\testapps\node_express_test\test_cordova\buildcordovaapp\www\clientfiles\app\app-debug.apk" >> %logfile% 2>&1
cordova build android >> %logfile% 2>&1
echo ===== end %date% %time% ========================================= >> %logfile% 2>&1

::copy "%curpath%hello/platforms/android/app/build/outputs/apk/debug/app-debug.apk" %curpath%app.apk"
::copy "C:/pg/prjs/testapps/node_express_test/test_cordova/hello/platforms/android/app/build/outputs/apk/debug/app-debug.apk" "C:/pg/prjs/testapps/node_express_test/test_cordova/app.apk"
@echo ==== end   ===================================================================
@pause
