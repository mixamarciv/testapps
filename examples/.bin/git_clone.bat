::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
::задаем основные переменные окружения
@CALL "%curpath%/../../.bin/set_path.bat"




@echo ==== start ===================================================================
git clone https://github.com/norlin/sea-battle.git
@echo ==== end   ===================================================================
@PAUSE
