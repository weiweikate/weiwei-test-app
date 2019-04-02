package com.meeruu.commonlib.callback;

/**
 * webview回调
 * Created by louis on 17/7/12.
 */

public interface OnWebCommonListener extends OnWebBaseListener {

    void handleTitle(String title);

    void onProgress(int newProgress);
}
