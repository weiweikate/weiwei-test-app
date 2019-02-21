package com.meeruu.sharegoods.rn.showground;

import android.content.Context;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.StaggeredGridLayoutManager;
import android.view.LayoutInflater;
import android.view.View;

import com.chad.library.adapter.base.BaseQuickAdapter;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.presenter.ShowgroundPresenter;
import com.meeruu.sharegoods.rn.showground.view.IShowgroundView;
import com.meeruu.sharegoods.rn.showground.widgets.CustomLoadMoreView;
import com.meeruu.sharegoods.rn.showground.widgets.RnRecyclerView;

import java.util.ArrayList;
import java.util.List;

public class ShowGroundViewManager extends SimpleViewManager<View> implements IShowgroundView , SwipeRefreshLayout.OnRefreshListener {
    private static final String COMPONENT_NAME = "ShowGroundView";
    private int page = 1;
    private int size = 10;
    private SwipeRefreshLayout swipeRefreshLayout;
    private RnRecyclerView recyclerView;
    private ShowGroundAdapter adapter;
    private ShowgroundPresenter presenter;


    @Override
    public String getName() {
        return COMPONENT_NAME;
    }

    @Override
    protected View createViewInstance(ThemedReactContext reactContext) {
        LayoutInflater inflater = LayoutInflater.from(reactContext);
        View view = inflater.inflate(R.layout.view_showground, null);
        initView(reactContext,view);
        initData();
        return view;
    }

    private void initView(Context context, View view) {
        swipeRefreshLayout = view.findViewById(R.id.refresh_control);
        swipeRefreshLayout.setColorSchemeResources(R.color.app_main_color);
        recyclerView = view.findViewById(R.id.home_recycler_view);
        swipeRefreshLayout.setOnRefreshListener(this);
        swipeRefreshLayout.post(new Runnable() {
            @Override
            public void run() {
                swipeRefreshLayout.setRefreshing(true);
                presenter.initShowground();
            }
        });

        adapter = new ShowGroundAdapter();
        adapter.openLoadAnimation(BaseQuickAdapter.ALPHAIN);
        adapter.setPreLoadNumber(3);
        final StaggeredGridLayoutManager layoutManager = new StaggeredGridLayoutManager(2,StaggeredGridLayoutManager.VERTICAL);
        layoutManager.setGapStrategy(StaggeredGridLayoutManager.GAP_HANDLING_NONE);
        recyclerView.setLayoutManager(layoutManager);
        adapter.setEnableLoadMore(true);
        adapter.setOnLoadMoreListener(new BaseQuickAdapter.RequestLoadMoreListener() {
            @Override
            public void onLoadMoreRequested() {
                presenter.loadMore(page);
            }
        });
        adapter.setLoadMoreView(new CustomLoadMoreView());
        recyclerView.setAdapter(adapter);
        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(RecyclerView recyclerView, int newState) {
                super.onScrollStateChanged(recyclerView, newState);
                StaggeredGridLayoutManager layoutManager = (StaggeredGridLayoutManager)recyclerView.getLayoutManager();
                int[] first = new int[2];
                layoutManager.findFirstCompletelyVisibleItemPositions(first);
                if (newState == RecyclerView.SCROLL_STATE_IDLE && (first[0] == 1 || first[1] == 1)) {
                    layoutManager.invalidateSpanAssignments();
                }
            }

        });

    }

    private void initData() {
        presenter = new ShowgroundPresenter(this);
    }

    @Override
    public void onRefresh() {
        adapter.setEnableLoadMore(false);
        page = 1;
        presenter.initShowground();
    }

    @Override
    public void loadMoreFail(){
        if(adapter != null){
            adapter.loadMoreFail();
        }
    }

    @Override
    public void viewLoadMore(final List data){
        page++;

        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                adapter.addData(data);
            }
        });
    }

    @Override
    public void refreshShowground(final List data) {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                adapter.setEnableLoadMore(true);
                if(adapter != null){
                    adapter.setNewData(data);
                    swipeRefreshLayout.setRefreshing(false);
                }
            }
        });
}

    @Override
    public void loadMoreEnd() {
        if(adapter != null){
            UiThreadUtil.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    adapter.loadMoreEnd();
                }
            });
        }
    }

    @Override
    public void loadMoreComplete() {
        adapter.loadMoreComplete();
        }
    }


