::получаем curpath:
@FOR /f %%i IN ("%0") DO SET curpath=%~dp0
::задаем основные переменные окружения
@CALL "%curpath%/../../.bin/set_path.bat"


@SET path=%curpath%/../node_modules/.bin/;%path%
@SET path=%path%;c:\pg\app\Android_sdk\tools\platform-tools

@CLS
@echo ==== start ===================================================================

TITLE adb logcat
::adb logcat
   
adb kill-server      
adb start-server     
adb devices      
echo run:
echo adb logcat
cmd
@echo ==== end   ===================================================================
@pause


adb -d logcat <your package name>:<log level> *:S
adb -d logcat com.example.example:I *:S
adb -d logcat System.out:I *:S

adb -d logcat io.cordova.hellocordova:V *:S
adb -d logcat hellocordova:V *:S
adb -d logcat helloworld:V *:S
adb -d logcat HelloCordova:V *:S

adb logcat | findstr cordova
adb logcat | findstr io.cordova.hellocordova

The priority is one of the following character values, ordered from lowest to highest priority:
V: Verbose (lowest priority)
D: Debug
I: Info
W: Warning
E: Error
F: Fatal
S: Silent (highest priority, on which nothing is ever printed)


