
SET PHP_PATH=c:\_db_web\php5\
SET PATH=%PHP_PATH%;

taskkill /IM php-cgi.exe /F

START /D "%PHP_PATH%" /B php-cgi.exe -b 127.0.0.1:9000 -c %PHP_PATH%/php.ini
START /D "%PHP_PATH%" /B php-cgi.exe -b 127.0.0.1:9001 -c %PHP_PATH%/php.ini
START /D "%PHP_PATH%" /B php-cgi.exe -b 127.0.0.1:9002 -c %PHP_PATH%/php.ini
START /D "%PHP_PATH%" /B php-cgi.exe -b 127.0.0.1:9003 -c %PHP_PATH%/php.ini
START /D "%PHP_PATH%" /B php-cgi.exe -b 127.0.0.1:9004 -c %PHP_PATH%/php.ini

::pause

