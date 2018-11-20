::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
::задаем основные переменные окружения
@CALL "%curpath%/../.bin/set_path.bat"


@SET path=%curpath%/../node_modules/.bin/;%path%

@CLS
@echo ==== start ===================================================================

TITLE cordova run browser --live-reload
CD "%curpath%/buildcordovaapp"

cordova platform add android
@echo ==== end   ===================================================================
@pause
