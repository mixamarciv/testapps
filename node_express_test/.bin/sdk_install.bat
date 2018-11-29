::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
::задаем основные переменные окружения
@CALL "%curpath%/../../.bin/set_path.bat"


mkdir C:\Users\user\.android
echo "" > C:\Users\user\.android\repositories.cfg

cd c:\pg\app\Android_sdk\tools\bin\

cmd
@PAUSE
