::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
::задаем основные переменные окружения
@CALL "%curpath%/../../.bin/set_path.bat"


@SET path=%curpath%/../node_modules/.bin/;%path%

@CLS
@echo ==== start ===================================================================

TITLE cordova platform add browser
CD "%curpath%/buildcordovaapp1"


cordova platform add browser

@echo ==== end   ===================================================================
@pause
