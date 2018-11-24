в случае сборки с ошибками вида:

BUILD FAILED in 2m 31s
cmd: Command failed with exit code 1 Error output:
FAILURE: Build failed with an exception.

* What went wrong:
A problem occurred configuring project ':CordovaLib'.
> No toolchains found in the NDK toolchains folder for ABI with prefix: mips64el-linux-android

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output.

* Get more help at https://help.gradle.org

BUILD FAILED in 2m 31s




вообщем если будут ошибки с mips64el-linux-android то исправляем во всех файлах 
gradle-4.1-all.zip на gradle-4.4-all.zip
и
com.android.tools.build:gradle:3.0.1 на com.android.tools.build:gradle:3.1.2



Open android/gradle/gradle-wrapper.properties and change this line:
distributionUrl=https\://services.gradle.org/distributions/gradle-4.1-all.zip
to this line:

distributionUrl=https\://services.gradle.org/distributions/gradle-4.4-all.zip
Open android/build.gradle and change this line:
classpath 'com.android.tools.build:gradle:3.0.1'
to this:

classpath 'com.android.tools.build:gradle:3.1.2'






