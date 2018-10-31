::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
::задаем основные переменные окружения
@CALL "%curpath%/../.bin/set_path.bat"



@CLS
@echo ==== start ===================================================================

TITLE test express
CD "%curpath%/.."

node app.js --port 9801 --host=127.0.0.1  

@echo ==== end   ===================================================================
@pause
