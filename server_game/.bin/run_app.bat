::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
::задаем основные переменные окружения
@CALL "%curpath%/../../.bin/set_path.bat"



@CLS
@echo ==== start ===================================================================

TITLE server_game
CD "%curpath%/.."

node app.js

@echo ==== end   ===================================================================
@pause
