package com.meeruu.qiyu.activity;

import android.os.Bundle;
import android.view.View;
import android.widget.LinearLayout;

import com.meeruu.commonlib.utils.ScreenUtils;
import com.meeruu.commonlib.utils.SoftKeyboardFixerForFullscreen;
import com.meeruu.commonlib.utils.StatusBarUtils;
import com.qiyukf.unicorn.R;
import com.qiyukf.unicorn.ui.activity.ServiceMessageActivity;

public class QiyuServiceMessageActivity extends ServiceMessageActivity {

    @Override
    protected void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        SoftKeyboardFixerForFullscreen.assistActivity(this);
        int result = StatusBarUtils.setLightMode(this);
        int statusColor = android.R.color.white;
        if (result == 3) {
            // 6.0以上沉浸式
            StatusBarUtils.setColor(this, getResources().getColor(statusColor), 0);
            handleTop();
        } else if (result == 4) {
            // 其它半透明效果
            StatusBarUtils.setColor(this, getResources().getColor(statusColor));
        } else {
            // miui、flyme沉浸式
            StatusBarUtils.setColor(this, getResources().getColor(statusColor), 0);
            handleTop();
        }
    }

    private void handleTop() {
        View titleBar = findViewById(R.id.ysf_title_bar);
        if (titleBar.getPaddingTop() != ScreenUtils.getStatusHeight()) {
            titleBar.setPadding(0, ScreenUtils.getStatusHeight(), 0, 0);
            LinearLayout.LayoutParams param = (LinearLayout.LayoutParams) titleBar.getLayoutParams();
            param.height += ScreenUtils.getStatusHeight();
            titleBar.setLayoutParams(param);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        int result = StatusBarUtils.setLightMode(this);
        int statusColor = android.R.color.white;
        if (result == 3) {
            // 6.0以上沉浸式
            StatusBarUtils.setColor(this, getResources().getColor(statusColor), 0);
        } else if (result == 4) {
            // 其它半透明效果
            StatusBarUtils.setColor(this, getResources().getColor(statusColor));
        } else {
            // miui、flyme沉浸式
            StatusBarUtils.setColor(this, getResources().getColor(statusColor), 0);
        }
    }
}
