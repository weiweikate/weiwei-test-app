package com.meeruu.commonlib.customview.loopbanner;

import android.content.Context;
import android.util.AttributeSet;

import androidx.annotation.Nullable;
import androidx.recyclerview.widget.RecyclerView;


public class LoopViewPager extends RecyclerView {

    private static final int FLING_MAX_VELOCITY = 5000; // 最大顺时滑动速度
    private static boolean mEnableLimitVelocity = true; // 最大顺时滑动速度

    public LoopViewPager(Context context) {
        super(context);
    }

    public LoopViewPager(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public LoopViewPager(Context context, @Nullable AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
    }


    @Override
    public boolean fling(int velocityX, int velocityY) {
        if (mEnableLimitVelocity) {
            velocityX = solveVelocity(velocityX);
            velocityY = solveVelocity(velocityY);
        }
        return super.fling(velocityX, velocityY);
    }

    private int solveVelocity(int velocity) {
        if (velocity > 0) {
            return Math.min(velocity, FLING_MAX_VELOCITY);
        } else {
            return Math.max(velocity, -FLING_MAX_VELOCITY);
        }
    }
}
