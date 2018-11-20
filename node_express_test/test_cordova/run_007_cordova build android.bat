::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
::задаем основные переменные окружения
@CALL "%curpath%/../../.bin/set_path.bat"


@SET path=%curpath%/../node_modules/.bin/;%path%


::@SET ANDROID_HOME=C:\Users\user\AppData\Local\Android\sdk
::@SET path=%path%;%ANDROID_HOME%


::@SET JAVA_HOME=c:\pg\app\Java\jdk-11.0.1
::@SET path=%path%;%JAVA_HOME%\bin\


@CLS
@echo ==== start ===================================================================

TITLE cordova build android
CD "%curpath%/buildcordovaapp"

cordova build android > "./../log.txt" 2>&1

::copy "%curpath%hello/platforms/android/app/build/outputs/apk/debug/app-debug.apk" %curpath%app.apk"
::copy "C:/pg/prjs/testapps/node_express_test/test_cordova/hello/platforms/android/app/build/outputs/apk/debug/app-debug.apk" "C:/pg/prjs/testapps/node_express_test/test_cordova/app.apk"
@echo ==== end   ===================================================================
@pause
