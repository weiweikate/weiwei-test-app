package com.meeruu.sharegoods.rn.showground;

import android.content.Context;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.SimpleItemAnimator;
import android.support.v7.widget.StaggeredGridLayoutManager;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.chad.library.adapter.base.BaseQuickAdapter;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.meeruu.sharegoods.R;
import com.meeruu.sharegoods.rn.showground.adapter.ProductsAdapter;
import com.meeruu.sharegoods.rn.showground.adapter.ShowRecommendAdapter;
import com.meeruu.sharegoods.rn.showground.bean.NewestShowGroundBean;
import com.meeruu.sharegoods.rn.showground.bean.ShowRecommendBean;
import com.meeruu.sharegoods.rn.showground.event.addCartEvent;
import com.meeruu.sharegoods.rn.showground.event.onEndScrollEvent;
import com.meeruu.sharegoods.rn.showground.event.onItemPressEvent;
import com.meeruu.sharegoods.rn.showground.event.onNineClickEvent;
import com.meeruu.sharegoods.rn.showground.event.onScrollStateChangedEvent;
import com.meeruu.sharegoods.rn.showground.event.onStartRefreshEvent;
import com.meeruu.sharegoods.rn.showground.event.onStartScrollEvent;
import com.meeruu.sharegoods.rn.showground.event.onZanPressEvent;
import com.meeruu.sharegoods.rn.showground.presenter.ShowgroundPresenter;
import com.meeruu.sharegoods.rn.showground.view.IShowgroundView;
import com.meeruu.sharegoods.rn.showground.widgets.CustomLoadMoreView;
import com.meeruu.sharegoods.rn.showground.widgets.GridView.NineGridView;
import com.meeruu.sharegoods.rn.showground.widgets.RnRecyclerView;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ShowRecommendView  implements IShowgroundView, SwipeRefreshLayout.OnRefreshListener{
    private RnRecyclerView recyclerView;
    private ShowRecommendAdapter adapter;
    private EventDispatcher eventDispatcher;
    private onStartScrollEvent startScrollEvent;
    private onEndScrollEvent endScrollEvent;
    private onZanPressEvent onZanPressEvent;
    private ShowgroundPresenter presenter;
    private WeakReference<View> showgroundView;
    private onStartRefreshEvent startRefreshEvent;
    private onItemPressEvent itemPressEvent;
    private SwipeRefreshLayout swipeRefreshLayout;
    private Handler handler;
    private View errView;
    private View errImg;

    private int page = 1;

    public ViewGroup getShowRecommendView(ReactContext reactContext) {
        eventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();

        LayoutInflater inflater = LayoutInflater.from(reactContext);
        View view = inflater.inflate(R.layout.view_showground, null);
        initView(reactContext, view);
        initData();

        return (ViewGroup) view;
    }

    public void initView(Context context, final View view) {
        handler = new Handler();
        errView = view.findViewById(R.id.err_view);
        errImg = view.findViewById(R.id.errImg);
        errImg.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                swipeRefreshLayout.setVisibility(View.VISIBLE);
                errView.setVisibility(View.INVISIBLE);
                swipeRefreshLayout.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        swipeRefreshLayout.setRefreshing(true);
                        onRefresh();
                    }
                }, 200);
            }
        });

        errView.setVisibility(View.INVISIBLE);
        showgroundView = new WeakReference<>(view);
        startRefreshEvent = new onStartRefreshEvent();
        swipeRefreshLayout = view.findViewById(R.id.refresh_control);
        swipeRefreshLayout.setColorSchemeResources(R.color.app_main_color);
        swipeRefreshLayout.setOnRefreshListener(this);
        swipeRefreshLayout.postDelayed(new Runnable() {
            @Override
            public void run() {
                swipeRefreshLayout.setRefreshing(true);
                onRefresh();
            }
        }, 200);
        final onNineClickEvent onNineClickEvent = new onNineClickEvent();
        final addCartEvent addCartEvent = new addCartEvent();
        final onScrollStateChangedEvent onScrollStateChangedEvent = new onScrollStateChangedEvent();
        recyclerView = view.findViewById(R.id.home_recycler_view);
        startScrollEvent = new onStartScrollEvent();
        endScrollEvent = new onEndScrollEvent();
        itemPressEvent = new onItemPressEvent();
        onZanPressEvent = new onZanPressEvent();

        recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(@NonNull RecyclerView recyclerView, int newState) {
//                public static final int SCROLL_STATE_IDLE = 0;
//                public static final int SCROLL_STATE_DRAGGING = 1;
//                public static final int SCROLL_STATE_SETTLING = 2;
                super.onScrollStateChanged(recyclerView, newState);
                onScrollStateChangedEvent.init(view.getId());
                WritableMap map = Arguments.createMap();
                map.putInt("state",newState);
                onScrollStateChangedEvent.setData(map);
                eventDispatcher.dispatchEvent(onScrollStateChangedEvent);

                switch (newState) {
                    case RecyclerView.SCROLL_STATE_IDLE:
                        endScrollEvent.init(view.getId());
                        eventDispatcher.dispatchEvent(endScrollEvent);
                        break;
                    case RecyclerView.SCROLL_STATE_DRAGGING:
                        startScrollEvent.init(view.getId());
                        eventDispatcher.dispatchEvent(startScrollEvent);
                        break;
                    default:
                        break;
                }
            }
        });
        ProductsAdapter.AddCartListener addCartListener =  new ProductsAdapter.AddCartListener() {
            @Override
            public void onAddCart(String code) {
                addCartEvent.init(view.getId());
                WritableMap map = Arguments.createMap();
                map.putString("prodCode",code);
                addCartEvent.setData(map);
                eventDispatcher.dispatchEvent(addCartEvent);
            }
        };

        NineGridView.clickL clickL = new NineGridView.clickL() {
            @Override
            public void imageClick(List urls, int index) {
                onNineClickEvent.init(view.getId());
                WritableMap map = Arguments.createMap();
                WritableArray array = Arguments.makeNativeArray(urls);
                map.putArray("imageUrls",array);
                map.putInt("index",index);
                onNineClickEvent.setData(map);
                eventDispatcher.dispatchEvent(onNineClickEvent);
            }
        };


        adapter = new ShowRecommendAdapter(clickL,addCartListener);
        adapter.setPreLoadNumber(3);
        adapter.setHasStableIds(true);
        LinearLayoutManager layoutManager = new LinearLayoutManager(context);
        recyclerView.setLayoutManager(layoutManager);
        adapter.setEnableLoadMore(true);
        adapter.setOnLoadMoreListener(new BaseQuickAdapter.RequestLoadMoreListener() {
            @Override
            public void onLoadMoreRequested() {
                page++;
                presenter.getShowList(page);
            }
        }, recyclerView);
        adapter.setOnItemClickListener(new BaseQuickAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(final BaseQuickAdapter adapter, View view1, final int position) {
                final List<NewestShowGroundBean.DataBean> data = adapter.getData();
                if (data != null) {
                    NewestShowGroundBean.DataBean item = data.get(position);
                    String json = JSONObject.toJSONString(item);
                    Map map = JSONObject.parseObject(json, new TypeReference<Map>() {
                    });
                    map.put("index", position);
                    WritableMap realData = Arguments.makeNativeMap(map);
                    if (eventDispatcher != null) {
                        itemPressEvent.init(view.getId());
                        itemPressEvent.setData(realData);
                        eventDispatcher.dispatchEvent(itemPressEvent);
                    }
                }
            }
        });
        adapter.setLoadMoreView(new CustomLoadMoreView());
        recyclerView.setAdapter(adapter);
    }

    private void initData() {
        presenter = new ShowgroundPresenter(this);
    }


    @Override
    public void onRefresh() {
        if (eventDispatcher != null) {
            View view = showgroundView.get();
            if (view != null) {
                startRefreshEvent.init(view.getId());
                eventDispatcher.dispatchEvent(startRefreshEvent);
            }
        }
        adapter.setEnableLoadMore(false);
        page = 1;
        presenter.getShowList(page);
    }

    @Override
    public void loadMoreFail(final String code) {
        swipeRefreshLayout.setRefreshing(false);
        if (adapter != null) {
            adapter.loadMoreFail();
        }

        handler.post(new Runnable() {
            @Override
            public void run() {
                if (TextUtils.equals(code, "9999") && page == 1) {
                    errView.setVisibility(View.VISIBLE);
                    swipeRefreshLayout.setVisibility(View.INVISIBLE);
                } else {
                    errView.setVisibility(View.INVISIBLE);
                    swipeRefreshLayout.setVisibility(View.VISIBLE);
                }
            }
        });
    }

    @Override
    public void viewLoadMore(final List data) {
        showList();
        if (data != null) {
            adapter.addData(data);
        }
    }

    @Override
    public void addDataToTop(String s) {

    }

    @Override
    public void repelaceItemData(final int index, final String value) {
        if (adapter != null && !TextUtils.isEmpty(value)) {
            final List<NewestShowGroundBean.DataBean> data = adapter.getData();
            recyclerView.postDelayed(new Runnable() {
                @Override
                public void run() {
                    NewestShowGroundBean.DataBean bean =  JSON.parseObject(value, NewestShowGroundBean.DataBean.class);
                    data.set(index,bean);
                    adapter.replaceData(data);
                }
            }, 200);
        }
    }

    @Override
    public void refreshShowground(final List data) {
        if (adapter != null) {
            adapter.setEnableLoadMore(true);
            adapter.setNewData(data);
            swipeRefreshLayout.setRefreshing(false);
        }
    }

    @Override
    public void loadMoreEnd() {
        showList();
        if (adapter != null) {
            adapter.loadMoreEnd();
        }
    }

    @Override
    public void repelaceData(final int index, final int clickNum) {
//        if (adapter != null) {
//            final List<NewestShowGroundBean.DataBean> data = adapter.getData();
//
//            recyclerView.postDelayed(new Runnable() {
//                @Override
//                public void run() {
//                    NewestShowGroundBean.DataBean bean = data.get(index);
//                    bean.setClick(clickNum);
//                    adapter.replaceData(data);
//
//                }
//            }, 200);
//        }
    }

    @Override
    public void loadMoreComplete() {
        showList();
        adapter.loadMoreComplete();
    }

    public void addHeader(View view) {
        int i = adapter.getHeaderLayoutCount();
        if (i != 0) {
            adapter.removeAllHeaderView();
        }
        adapter.addHeaderView(view);
        recyclerView.scrollToPosition(0);
    }

    public void setParams(HashMap map) {
        if (presenter != null) {
            presenter.setParams(map);
        }
    }

    private void showList() {
        handler.post(new Runnable() {
            @Override
            public void run() {
                errView.setVisibility(View.INVISIBLE);
                swipeRefreshLayout.setVisibility(View.VISIBLE);
            }
        });
    }
}
