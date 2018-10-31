::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
::задаем основные переменные окружения
::@CALL "%curpath%/set_path.bat"


@SET NODEJS_PATH=c:\pg\app\nodejs
@SET PHP_PATH=c:\_db_web\php5\

@SET PATH=%PHP_PATH%;%NODEJS_PATH%;%PATH%

@CLS
@echo ==== start ===================================================================
C:\
CD %PHP_PATH%
node %curpath%\app.js
@echo ==== end   ===================================================================
@PAUSE
