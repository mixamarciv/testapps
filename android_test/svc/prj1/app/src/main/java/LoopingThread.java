package com.drocher.hex.svc;


import java.util.concurrent.CountDownLatch;
import android.os.*;
import android.os.Handler;

public class LoopingThread extends Thread {
    private CountDownLatch syncLatch = new CountDownLatch(1);
    private Handler handler;

    public LoopingThread() {
        super();
        start();
    }

    public Handler getHandler2() {
        syncLatch.await();
        return handler;
    }

    @Override
    public void run() {
        try {
            Looper.prepare();
            handler = new Handler();
            syncLatch.countDown();
            Looper.loop();
        } catch(Exception e) {
            //Log.d("LoopingThread", e.getMessage());
        }
    }

}

