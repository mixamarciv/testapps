::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
::задаем основные переменные окружения
@CALL "%curpath%/../../.bin/set_path.bat"


@SET path=%curpath%/../node_modules/.bin/;%path%
@SET path=%path%;c:\pg\app\Android_sdk\tools\platform-tools

@CLS
@echo ==== start ===================================================================

TITLE adb logcat
SET from=C:\pg\prjs\testapps\node_express_test\test_cordova\buildcordovaapp\platforms\android\app\build\outputs\apk\debug\app-debug.apk 
SET to=C:\pg\prjs\testapps\node_express_test\test_cordova\buildcordovaapp\www\clientfiles\app\app-debug.apk 
copy /y "%from%" "%to%"
@echo ==== end   ===================================================================
@pause
