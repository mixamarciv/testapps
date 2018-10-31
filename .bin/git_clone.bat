::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
::задаем основные переменные окружения
@CALL "%curpath%/set_path.bat"



@CLS
@echo ==== start ===================================================================
git clone https://github.com/mixamarciv/testapps.git
@echo ==== end   ===================================================================
@PAUSE
