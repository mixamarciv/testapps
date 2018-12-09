
import java.util.concurrent.CountDownLatch;

public class LoopingThread extends Thread {
    private CountdownLatch syncLatch = new CountdownLatch(1);
    private Handler handler;

    public LoopingThread() {
        super();
        start();
    }

    @Override
    public void run() {
        try {
            Looper.prepare();
            handler = new Handler();
            syncLatch.countDown();
            Looper.loop();
        } catch(Exception e) {
            Log.d("LoopingThread", e.getMessage());
        }
    }

    public Handler getHandler() {
        syncLatch.await();
        return handler;
    }
}