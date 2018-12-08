::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
::задаем основные переменные окружения
@CALL "%curpath%/../../.bin/set_path.bat"


@SET path=%curpath%/../node_modules/.bin/;%path%
@SET path=%curpath%/buildcordovaapp/node_modules/.bin/;%path%

@CLS
@echo ==== start ===================================================================

TITLE plugin add cordova-plugin-browsersync
CD "%curpath%/buildcordovaapp"


cordova-hcp server  > "./../log-cordova-hcp_server.txt" 2>&1
cmd
::buildcordovaapp\node_modules\winattr\lib\whichLib.js:87
@echo ==== end   ===================================================================
@pause
