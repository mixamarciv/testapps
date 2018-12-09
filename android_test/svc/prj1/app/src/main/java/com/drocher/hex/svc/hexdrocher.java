package com.drocher.hex.svc;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;

import java.io.OutputStream;
import java.io.OutputStreamWriter;

public class hexdrocher extends Service {
    private final static String FILENAME = "sample_log3000.txt"; // имя файла
    private void saveFile(String text) {
        try {
            OutputStream outputStream = openFileOutput(FILENAME, MODE_APPEND);
            OutputStreamWriter osw = new OutputStreamWriter(outputStream);
            osw.write(text+"\n");
            osw.flush();
            osw.close();
        } catch (Throwable t) {
            return;
        }
    }

    public hexdrocher() {
    }

    @Override
    public IBinder onBind(Intent intent) {
        saveFile("onBind()");
        // TODO: Return the communication channel to the service.
        throw new UnsupportedOperationException("Not yet implemented");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        //вызывается каждый раз, когда сервис стартует с помощью метода startService()
        // поэтому может быть выполнен несколько раз на протяжении работы
        // Вы должны убедиться, что ваш сервис это предусматривает.
        //Метод onStartCommand() заменяет устаревший метод onStart() который использовался в Android 2.0
        // В отличие от onStart() новый метод позволяет указать системе, каким образом обрабатывать перезапуски,
        // если сервис остановлен системой без явного вызова методов stopService() или stopSelf().
        saveFile("onStartCommand()");
        Thread loopThread = new LoopingThread(); // будет выполняться вечно
        loopThread.getHandler().post(new Runnable() {
            @Override
            public void run() {
                doLongAndComplicatedTask();
            }
        });
        return Service.START_STICKY;
    }

    @Override
    public void onCreate() {
        saveFile("onCreate()");
        super.onCreate();
        //Toast.makeText(this, "Служба создана",
        //        Toast.LENGTH_SHORT).show();
        //mPlayer = MediaPlayer.create(this, R.raw.flower_romashka);
        //mPlayer.setLooping(false);
    }

    @Override
    public void onDestroy() {
        saveFile("onDestroy()");
        super.onDestroy();
        //Toast.makeText(this, "Служба остановлена",
        //        Toast.LENGTH_SHORT).show();
        //mPlayer.stop();
    }

}
