package com.meeruu.commonlib.umeng;

import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.Rect;
import android.net.Uri;
import android.text.TextUtils;
import android.view.View;

import com.alibaba.fastjson.JSON;
import com.facebook.binaryresource.BinaryResource;
import com.facebook.binaryresource.FileBinaryResource;
import com.facebook.cache.common.CacheKey;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.cache.DefaultCacheKeyFactory;
import com.facebook.imagepipeline.core.ImagePipelineFactory;
import com.facebook.imagepipeline.listener.BaseRequestListener;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.meeruu.commonlib.R;
import com.meeruu.commonlib.bean.WXLoginBean;
import com.meeruu.commonlib.utils.BitmapUtils;
import com.meeruu.commonlib.utils.ImageLoadUtils;
import com.meeruu.commonlib.utils.LogUtils;
import com.meeruu.commonlib.utils.SDCardUtils;
import com.meeruu.commonlib.utils.ToastUtils;
import com.umeng.socialize.UMAuthListener;
import com.umeng.socialize.UMShareAPI;
import com.umeng.socialize.bean.SHARE_MEDIA;

import java.io.File;
import java.io.FileOutputStream;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;

public class LoginAndSharingModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext mContext;
    public static final String MODULE_NAME = "LoginAndShareModule";

    /**
     * 构造方法必须实现
     *
     * @param reactContext
     */
    public LoginAndSharingModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mContext = reactContext;
    }

    /**
     * 在rn代码里面是需要这个名字来调用该类的方法
     *
     * @return
     */
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void share(ReadableMap params, Callback success, Callback fail) {
        UMShareUtils.showShare(getCurrentActivity(), params.toHashMap(), success, fail);
    }

    @ReactMethod
    public void loginWX(final Callback callback) {
        final String TAG = "";
        UMShareAPI.get(getCurrentActivity()).getPlatformInfo(getCurrentActivity(), SHARE_MEDIA.WEIXIN, new UMAuthListener() {
            @Override
            public void onStart(SHARE_MEDIA share_media) {
                LogUtils.d("onStart授权开始: ");
            }

            @Override
            public void onComplete(SHARE_MEDIA share_media, int i, Map<String, String> map) {
                //sdk是6.4.5的,但是获取值的时候用的是6.2以前的(access_token)才能获取到值,未知原因
                String uid = map.get("uid");
                String openid = map.get("openid");//微博没有
                String unionid = map.get("unionid");//微博没有
                String access_token = map.get("access_token");
                String refresh_token = map.get("refresh_token");//微信,qq,微博都没有获取到
                String expires_in = map.get("expires_in");
                String name = map.get("name");//名称
                String gender = map.get("gender");//性别
                String iconurl = map.get("iconurl");//头像地址
                umengDeleteOauth(SHARE_MEDIA.WEIXIN);
                WXLoginBean bean = new WXLoginBean();
                bean.setDevice(android.os.Build.DEVICE);
                bean.setAppOpenid(openid);
                bean.setUnionid(unionid);
                bean.setSystemVersion(android.os.Build.VERSION.RELEASE);
                bean.setNickName(name);
                bean.setHeaderImg(iconurl);
                callback.invoke(JSON.toJSONString(bean));
            }

            @Override
            public void onError(SHARE_MEDIA share_media, int i, Throwable throwable) {
                ToastUtils.showToast("授权失败");
                LogUtils.d("onError: " + "授权失败");
            }

            @Override
            public void onCancel(SHARE_MEDIA share_media, int i) {
                ToastUtils.showToast("授权取消");
                LogUtils.d("onError: " + "授权取消");
            }
        });
    }

    private void umengDeleteOauth(SHARE_MEDIA share_media_type) {
        final String TAG = "";
        UMShareAPI.get(getCurrentActivity()).deleteOauth(getCurrentActivity(), share_media_type, new UMAuthListener() {
            @Override
            public void onStart(SHARE_MEDIA share_media) {
                //开始授权
                LogUtils.d("onStart: ");
            }

            @Override
            public void onComplete(SHARE_MEDIA share_media, int i, Map<String, String> map) {
                //取消授权成功 i=1
                LogUtils.d("onComplete: ");
            }

            @Override
            public void onError(SHARE_MEDIA share_media, int i, Throwable throwable) {
                //授权出错
                LogUtils.d("onError: ");
            }

            @Override
            public void onCancel(SHARE_MEDIA share_media, int i) {
                //取消授权
                LogUtils.d("onCancel: ");
            }
        });
    }

    @ReactMethod
    public void creatShareImage(ReadableMap json, Callback success, Callback fail) {
        ShareImageBean shareImageBean = parseParam(json);
        if (shareImageBean == null) {
            fail.invoke("参数出错");
            return;
        }
        getBitmap(mContext, shareImageBean, success, fail);
    }


    @ReactMethod
    public void createPromotionShareImage(String url, Callback success, Callback fail) {
        drawPromotionShare(mContext, url, success, fail);
    }

    @ReactMethod
    public void saveInviteFriendsImage(String url, String headImg, Callback success, Callback fail) {

        if (TextUtils.isEmpty(headImg) || "logo.png".equals(headImg)) {
            Bitmap bitmap = getDefaultIcon(mContext);
            drawInviteFriendsImage(mContext, bitmap, url, success, fail);
        } else {
            downloadHeaderImg(mContext, headImg, url, success, fail);
        }

    }

    private void downloadHeaderImg(final Context context, final String headImg, final String url, final Callback success, final Callback fail) {
        if (Fresco.hasBeenInitialized()) {
            ImageLoadUtils.preFetch(Uri.parse(headImg), 0, 0, new BaseRequestListener() {
                @Override
                public void onRequestSuccess(ImageRequest request, String requestId, boolean isPrefetch) {
                    super.onRequestSuccess(request, requestId, isPrefetch);
                    CacheKey cacheKey = DefaultCacheKeyFactory.getInstance().getEncodedCacheKey(request, this);
                    BinaryResource resource = ImagePipelineFactory.getInstance().getMainFileCache().getResource(cacheKey);
                    if (resource == null) {
                        Bitmap bitmap = getDefaultIcon(context);
                        drawInviteFriendsImage(context, bitmap, url, success, fail);
                        return;
                    }
                    final File file = ((FileBinaryResource) resource).getFile();
                    if (file == null) {
                        Bitmap bitmap = getDefaultIcon(context);
                        drawInviteFriendsImage(context, bitmap, url, success, fail);
                        return;
                    }
                    Bitmap bmp = BitmapFactory.decodeFile(file.getAbsolutePath(), BitmapUtils.getBitmapOption(2));
                    if (bmp != null && !bmp.isRecycled()) {
                        drawInviteFriendsImage(context, bmp, url, success, fail);
                    } else {
                        Bitmap bitmap = getDefaultIcon(context);
                        drawInviteFriendsImage(context, bitmap, url, success, fail);
                    }
                }

                @Override
                public void onRequestFailure(ImageRequest request, String requestId, Throwable throwable, boolean isPrefetch) {
                    super.onRequestFailure(request, requestId, throwable, isPrefetch);
                    Bitmap bitmap = getDefaultIcon(context);
                    drawInviteFriendsImage(context, bitmap, url, success, fail);
                }
            });
        }
    }

    @ReactMethod
    public void saveShopInviteFriendsImage(ReadableMap map, Callback success, Callback fail) {
        drawShopInviteFriendsImage(mContext, map, success, fail);
    }
    //    headerImg: `${shareInfo.headUrl}`,
    //    shopName: `${shareInfo.name}`,
    //    shopId: `ID: ${shareInfo.showNumber}`,
    //    shopPerson: `店主: ${manager.nickname || ''}`,
    //    codeString: this.state.codeString,
    //    wxTip: this.state.wxTip
    public void drawShopInviteFriendsImage(final Context context, final ReadableMap map,
                                           final Callback success, final Callback fail) {
        if (Fresco.hasBeenInitialized()) {
            String headerImgUrl = map.getString("headerImg");
            ImageLoadUtils.preFetch(Uri.parse(headerImgUrl), 0, 0, new BaseRequestListener() {
                @Override
                public void onRequestSuccess(ImageRequest request, String requestId, boolean isPrefetch) {
                    super.onRequestSuccess(request, requestId, isPrefetch);
                    CacheKey cacheKey = DefaultCacheKeyFactory.getInstance().getEncodedCacheKey(request, this);
                    BinaryResource resource = ImagePipelineFactory.getInstance().getMainFileCache().getResource(cacheKey);
                    if (resource == null) {
                        fail.invoke("店主图片下载失败");
                        return;
                    }
                    final File file = ((FileBinaryResource) resource).getFile();
                    if (file == null) {
                        fail.invoke("店主图片下载失败");
                        return;
                    }
                    Bitmap bmp = BitmapFactory.decodeFile(file.getAbsolutePath(), BitmapUtils.getBitmapOption(2));
                    if (bmp != null && !bmp.isRecycled()) {
                        drawShopInviteFriendsImageWithHeader(context, map, bmp, success, fail);
                    } else {
                        fail.invoke("店主图片下载失败");
                    }
                }

                @Override
                public void onRequestFailure(ImageRequest request, String requestId, Throwable throwable, boolean isPrefetch) {
                    super.onRequestFailure(request, requestId, throwable, isPrefetch);
                    fail.invoke("店主图片下载失败");
                }
            });
        }
    }

    private static Bitmap getDefaultIcon(Context context) {
        Bitmap bitmap = BitmapFactory.decodeResource(context.getResources(), R.mipmap.ic_launcher_round);
        return bitmap;
    }

    public void drawShopInviteFriendsImageWithHeader(final Context context, final ReadableMap map, final Bitmap headerBitmap, final Callback success, final Callback fail) {
        Bitmap result = Bitmap.createBitmap(375, 667, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(result);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);

        Bitmap bitmap = BitmapFactory.decodeResource(context.getResources(), R.drawable.yqhy_04);
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int newWidth = 375;
        int newHeight = 667;
        float scaleWidth = ((float) newWidth) / width;
        float scaleHeight = ((float) newHeight) / height;


        Bitmap whiteBitmap = BitmapFactory.decodeResource(context.getResources(), R.drawable.yqhy_03);

        int whiteWidth = whiteBitmap.getWidth();
        int whiteHeight = whiteBitmap.getHeight();
        int newWhiteWidth = 325;
        int newWhiteHeight = 380;
        float scaleWidthWhite = ((float) newWhiteWidth) / whiteWidth;
        float scaleHeightWhite = ((float) newWhiteHeight) / whiteHeight;


        //获取想要缩放的matrix
        Matrix matrix = new Matrix();
        matrix.postScale(scaleWidth, scaleHeight);
        bitmap = Bitmap.createBitmap(bitmap, 0, 0, width, height, matrix, true);
        canvas.drawBitmap(bitmap, 0, 0, paint);

        Matrix whiteMatrix = new Matrix();
        whiteMatrix.postScale(scaleWidthWhite, scaleHeightWhite);
        whiteBitmap = Bitmap.createBitmap(whiteBitmap, 0, 0, whiteWidth, whiteHeight, whiteMatrix, true);
        canvas.drawBitmap(whiteBitmap, 24, 164, paint);


        //头像
        int headerW = headerBitmap.getWidth();
        int headerH = headerBitmap.getHeight();
        int newHeaderLength = 68;
        float scaleWidthHeader = ((float) newHeaderLength) / headerW;
        float scaleHeightHeader = ((float) newHeaderLength) / headerH;
        float scaleHeader = Math.max(scaleHeightHeader, scaleWidthHeader);
        Matrix headerMatrix = new Matrix();
        headerMatrix.postScale(scaleHeader, scaleHeader);


        Bitmap header = Bitmap.createBitmap(headerBitmap, 0, 0, headerW, headerH, headerMatrix, true);
        header = createCircleImage(header, newHeaderLength);
        canvas.drawBitmap(header, 70, 195, paint);


        String shopName = map.getString("shopName");
        paint.setColor(Color.BLACK);
        paint.setTextSize(14);
        Rect bounds = new Rect();
        paint.getTextBounds(shopName, 0, shopName.length(), bounds);
        canvas.drawText(shopName, 150, 215, paint);

        String shopId = map.getString("shopId");
        paint.setTextSize(13);
        bounds = new Rect();
        paint.getTextBounds(shopId, 0, shopId.length(), bounds);
        canvas.drawText(shopId, 150, 235, paint);

        String shopPerson = map.getString("shopPerson");
        paint.setTextSize(13);
        bounds = new Rect();
        paint.getTextBounds(shopPerson, 0, shopPerson.length(), bounds);
        canvas.drawText(shopPerson, 150, 255, paint);


        Bitmap qrBitmap = createQRImage(map.getString("codeString"), 135, 135);
        canvas.drawBitmap(qrBitmap, 120, 310, paint);


        String wxTip = map.getString("wxTip");
        paint.setTextSize(13);
        bounds = new Rect();
        paint.getTextBounds(wxTip, 0, wxTip.length(), bounds);
        canvas.drawText(wxTip, (375 - bounds.width()) / 2, 470, paint);

        HashMap hashMap = map.toHashMap();

        String path = BitmapUtils.saveImageToCache(result, "inviteShop.png", hashMap.toString());

        path = "file://" + path;
        Uri uri = Uri.parse(path);
        saveImageAndRefresh(uri);


        if (bitmap != null && !bitmap.isRecycled()) {
            bitmap.recycle();
            bitmap = null;
        }
        if (whiteBitmap != null && !whiteBitmap.isRecycled()) {
            whiteBitmap.recycle();
            whiteBitmap = null;
        }
        if (qrBitmap != null && !qrBitmap.isRecycled()) {
            qrBitmap.recycle();
            qrBitmap = null;
        }
        success.invoke();

    }

    /**
     * 根据原图和变长绘制圆形图片
     *
     * @param source
     * @param min
     * @return
     */
    private static Bitmap createCircleImage(Bitmap source, int min) {
        final Paint paint = new Paint();
        paint.setAntiAlias(true);
        Bitmap target = Bitmap.createBitmap(min, min, Bitmap.Config.ARGB_8888);
        /**
         * 产生一个同样大小的画布
         */
        Canvas canvas = new Canvas(target);
        /**
         * 首先绘制圆形
         */
        canvas.drawCircle(min / 2, min / 2, min / 2, paint);
        /**
         * 使用SRC_IN
         */
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_IN));
        /**
         * 绘制图片
         */
        canvas.drawBitmap(source, 0, 0, paint);

        return target;
    }


    public void drawInviteFriendsImage(final Context context, Bitmap icon, final String url, final Callback success, final Callback fail) {
        Bitmap result = Bitmap.createBitmap(750, (int) (1334), Bitmap.Config.RGB_565);
        Canvas canvas = new Canvas(result);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        Bitmap bitmap = BitmapFactory.decodeResource(context.getResources(), R.drawable.yqhy);
        Bitmap qrBitmap = createQRImage(url, 360, 360);
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int newWidth = 750;
        int newHeight = 1334;
        float scaleWidth = ((float) newWidth) / width;
        float scaleHeight = ((float) newHeight) / height;

        //获取想要缩放的matrix
        Matrix matrix = new Matrix();
        matrix.postScale(scaleWidth, scaleHeight);
        Bitmap newbitmap = Bitmap.createBitmap(bitmap, 0, 0, width, height, matrix, true);
        canvas.drawBitmap(newbitmap, 0, 0, paint);
        canvas.drawBitmap(qrBitmap, 200, 795, paint);


        int iconW = icon.getWidth();
        int iconH = icon.getHeight();
        // 设置想要的大小
        int newIconLenght = 80;
        // 计算缩放比例
        float iconWidthScale = ((float) newIconLenght) / iconW;
        float iconHeightScale = ((float) newIconLenght) / iconH;
        // 取得想要缩放的matrix参数
        Matrix matrixIcon = new Matrix();
        matrixIcon.postScale(iconWidthScale, iconHeightScale);
        // 得到新的图片
        Bitmap newIcon = Bitmap.createBitmap(icon, 0, 0, iconW, iconH, matrixIcon, true);

        Bitmap roundIcon = createCircleBitmap(newIcon);

        canvas.drawBitmap(roundIcon, 340, 930, paint);

        String path = BitmapUtils.saveImageToCache(result, "inviteFriends.png", url);

        path = "file://" + path;
        Uri uri = Uri.parse(path);
        saveImageAndRefresh(uri);

        if (bitmap != null && !bitmap.isRecycled()) {
            bitmap.recycle();
            bitmap = null;
        }
        if (qrBitmap != null && !qrBitmap.isRecycled()) {
            qrBitmap.recycle();
            qrBitmap = null;
        }
        if (newbitmap != null && !newbitmap.isRecycled()) {
            newbitmap.recycle();
            newbitmap = null;
        }
        if (roundIcon != null && !roundIcon.isRecycled()) {
            roundIcon.recycle();
            roundIcon = null;
        }
        if (icon != null && !icon.isRecycled()) {
            icon.recycle();
            icon = null;
        }
        success.invoke();
    }

    private static Bitmap createCircleBitmap(Bitmap resource) {
        //获取图片的宽度
        int width = resource.getWidth();
        Paint paint = new Paint();
        //设置抗锯齿
        paint.setAntiAlias(true);

        //创建一个与原bitmap一样宽度的正方形bitmap
        Bitmap circleBitmap = Bitmap.createBitmap(width, width, Bitmap.Config.ARGB_8888);
        //以该bitmap为低创建一块画布
        Canvas canvas = new Canvas(circleBitmap);
        //以（width/2, width/2）为圆心，width/2为半径画一个圆
        canvas.drawCircle(width / 2, width / 2, width / 2, paint);

        //设置画笔为取交集模式
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_IN));
        //裁剪图片
        canvas.drawBitmap(resource, 0, 0, paint);
        if (resource != null && !resource.isRecycled()) {
            resource.recycle();
            resource = null;
        }

        return circleBitmap;
    }


    public static void drawPromotionShare(final Context context, final String url, final Callback success, final Callback fail) {
        String info = url;
        String str = "长按扫码打开连接";
        Bitmap result = Bitmap.createBitmap(279, (int) (348), Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(result);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        Bitmap bitmap = BitmapFactory.decodeResource(context.getResources(), R.drawable.red_envelope_bg);


        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int newWidth = 279;
        int newHeight = 348;
        float scaleWidth = ((float) newWidth) / width;
        float scaleHeight = ((float) newHeight) / height;

        //获取想要缩放的matrix
        Matrix matrix = new Matrix();
        matrix.postScale(scaleWidth, scaleHeight);

        Bitmap newbitmap = Bitmap.createBitmap(bitmap, 0, 0, width, height, matrix, true);
        canvas.drawBitmap(newbitmap, 0, 0, paint);
        Bitmap qrBitmap = createQRImage(info, 140, 140);
        canvas.drawBitmap(qrBitmap, 70, 146, paint);
        paint.setColor(Color.WHITE);
        paint.setTextSize(12);
        Rect bounds = new Rect();
        paint.getTextBounds(str, 0, str.length(), bounds);
        canvas.drawText(str, (279 - bounds.width()) / 2, 306, paint);
        String path = BitmapUtils.saveImageToCache(result, "sharePromotionImage.png");
        if (!TextUtils.isEmpty(path)) {
            success.invoke(path);
        } else {
            fail.invoke("图片生成失败");
        }

        if (bitmap != null && !bitmap.isRecycled()) {
            bitmap.recycle();
            bitmap = null;
        }
        if (qrBitmap != null && !qrBitmap.isRecycled()) {
            qrBitmap.recycle();
            qrBitmap = null;
        }
        if (newbitmap != null && !newbitmap.isRecycled()) {
            newbitmap.recycle();
            newbitmap = null;
        }
    }


    public static void getBitmap(final Context context, final ShareImageBean shareImageBean, final Callback success, final Callback fail) {
        if (Fresco.hasBeenInitialized()) {
            ImageLoadUtils.preFetch(Uri.parse(shareImageBean.getImageUrlStr()), 0, 0, new BaseRequestListener() {
                @Override
                public void onRequestSuccess(ImageRequest request, String requestId, boolean isPrefetch) {
                    super.onRequestSuccess(request, requestId, isPrefetch);
                    CacheKey cacheKey = DefaultCacheKeyFactory.getInstance().getEncodedCacheKey(request, this);
                    BinaryResource resource = ImagePipelineFactory.getInstance().getMainFileCache().getResource(cacheKey);
                    if (resource == null) {
                        fail.invoke("图片获取失败");
                        return;
                    }
                    final File file = ((FileBinaryResource) resource).getFile();
                    if (file == null) {
                        fail.invoke("图片获取失败");
                        return;
                    }
                    Bitmap bmp = BitmapFactory.decodeFile(file.getAbsolutePath(), BitmapUtils.getBitmapOption(2));
                    if (bmp != null && !bmp.isRecycled()) {
                        if(TextUtils.equals(shareImageBean.getImageType(),"web") ){
                            drawWeb(context, bmp, shareImageBean, success, fail);
                        }else {
                            draw(context, bmp, shareImageBean, success, fail);
                        }
                    } else {
                        fail.invoke("图片获取失败");
                    }
                }
            });
        }
    }


    public static void drawWeb(Context context, Bitmap bitmap, ShareImageBean shareImageBean, Callback success, Callback fail){

        String info = shareImageBean.getQRCodeStr();
        Bitmap result = Bitmap.createBitmap(345,  525, Bitmap.Config.ARGB_8888) ;

        Canvas canvas = new Canvas(result);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);

        bitmap = Bitmap.createScaledBitmap(bitmap, 345, 440, true);
        canvas.drawBitmap(bitmap, 0, 0, paint);

        //在图片下边画一个白色矩形块用来放文字，防止文字是透明背景，在有些情况下保存到本地后看不出来

        paint.setColor(Color.WHITE);
        canvas.drawRect(0, 440, 345, 525, paint);

        Bitmap qrBitmap = createQRImage(info, 86, 86);
        canvas.drawBitmap(qrBitmap, 131, 417, paint);

        String path = BitmapUtils.saveImageToCache(result, "shareImage.png", shareImageBean.toString());
        if (!TextUtils.isEmpty(path)) {
            success.invoke(path);
        } else {
            fail.invoke("图片生成失败");
        }

        if (qrBitmap != null && !qrBitmap.isRecycled()) {
            qrBitmap.recycle();
            qrBitmap = null;
        }
    }

    public static void draw(Context context, Bitmap bitmap, ShareImageBean shareImageBean, Callback success, Callback fail) {

        String title = shareImageBean.getTitleStr();
        String price = shareImageBean.getPriceStr();
        String info = shareImageBean.getQRCodeStr();
        String retailPrice = shareImageBean.getRetail();
        String spellPrice = shareImageBean.getSpell();

        int titleSize = 26;
        int titleCount = (int) ((440) / titleSize);
        boolean isTwoLine;
        if (title.length() <= titleCount) {
            isTwoLine = false;
        } else {
            isTwoLine = true;
        }
//        height: autoSizeWidth(650 / 2), width: autoSizeWidth(250)

        //680 708
        Bitmap result = isTwoLine ? Bitmap.createBitmap(500, (int) (708), Bitmap.Config.ARGB_8888) : Bitmap.createBitmap(500, (int) (680), Bitmap.Config.ARGB_8888);

        Canvas canvas = new Canvas(result);
        Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);

        bitmap = Bitmap.createScaledBitmap(bitmap, 500, 500, true);
        canvas.drawBitmap(bitmap, 0, 0, paint);

        //在图片下边画一个白色矩形块用来放文字，防止文字是透明背景，在有些情况下保存到本地后看不出来

        paint.setColor(Color.WHITE);
        if (isTwoLine) {
            canvas.drawRect(0, 500, 500, 708, paint);

        } else {
            canvas.drawRect(0, 500, 500, 680, paint);
        }

        //绘制文字
        paint.setColor(Color.parseColor("#666666"));
        paint.setTextSize(titleSize);
        Rect bounds = new Rect();
        if (title.length() <= titleCount) {
            String s = title.substring(0, title.length());
            //获取文字的字宽高以便把文字与图片中心对齐
            paint.getTextBounds(s, 0, s.length(), bounds);
            //画文字的时候高度需要注意文字大小以及文字行间距
            canvas.drawText(s, 30, 500 + 30, paint);
        }
        if (title.length() <= titleCount * 2 && title.length() > titleCount) {
            String s = title.substring(0, titleCount);
            //获取文字的字宽高以便把文字与图片中心对齐
            paint.getTextBounds(s, 0, titleCount, bounds);
            //画文字的时候高度需要注意文字大小以及文字行间距
            canvas.drawText(s, 30, 500 + 30, paint);

            s = title.substring(titleCount, title.length());

            canvas.drawText(s, 30, 500 + 30 + titleSize + bounds.height() / 2, paint);
        }

        if (title.length() > titleCount * 2) {
            String s = title.substring(0, titleCount);
            //获取文字的字宽高以便把文字与图片中心对齐
            paint.getTextBounds(s, 0, titleCount, bounds);
            //画文字的时候高度需要注意文字大小以及文字行间距
            canvas.drawText(s, 30, 500 + 30, paint);

            s = title.substring(titleCount, titleCount * 2 - 2) + "...";

            canvas.drawText(s, 30, 500 + 30 + titleSize + bounds.height() / 2, paint);
        }


        String marketStr = "市场价： ";
        paint.setColor(Color.parseColor("#333333"));
        paint.setTextSize(20);
        Rect market = new Rect();
        paint.getTextBounds(marketStr, 0, marketStr.length(), market);
        canvas.drawText(marketStr, 30, isTwoLine ? 610 : 585, paint);

        paint.setStrikeThruText(true);
        paint.setTextSize(20);
        canvas.drawText(price, market.right + 30, isTwoLine ? 610 : 585, paint);


        String retailStr = "V1价： ";
        paint.setColor(Color.parseColor("#333333"));
        paint.setStrikeThruText(false);

        paint.setTextSize(22);
        Rect retail = new Rect();
        paint.getTextBounds(retailStr, 0, retailStr.length(), retail);
        canvas.drawText(retailStr, 30, isTwoLine ? 640 : 615, paint);

        paint.setTextSize(22);
        paint.setColor(Color.parseColor("#F00050"));
        canvas.drawText(retailPrice, retail.right + 30, isTwoLine ? 640 : 615, paint);


        String spellStr = "拼店价：";
        paint.setColor(Color.parseColor("#333333"));
        paint.setStrikeThruText(false);

        paint.setTextSize(22);
        Rect spell = new Rect();
        paint.getTextBounds(spellStr, 0, spellStr.length(), spell);
        canvas.drawText(spellStr, 30, isTwoLine ? 670 : 645, paint);

        paint.setTextSize(22);
        paint.setColor(Color.parseColor("#F00050"));
        canvas.drawText(spellPrice, spell.right + 30, isTwoLine ? 670 : 645, paint);

        Bitmap qrBitmap = createQRImage(info, 100, 100);
        if (isTwoLine) {
            canvas.drawBitmap(qrBitmap, 370, 590, paint);
        } else {
            canvas.drawBitmap(qrBitmap, 370, 565, paint);
        }


        String path = BitmapUtils.saveImageToCache(result, "shareImage.png", shareImageBean.toString());
        if (!TextUtils.isEmpty(path)) {
            success.invoke(path);
        } else {
            fail.invoke("图片生成失败");
        }

        if (qrBitmap != null && !qrBitmap.isRecycled()) {
            qrBitmap.recycle();
            qrBitmap = null;
        }
    }

    private ShareImageBean parseParam(ReadableMap map) {
        ShareImageBean shareImageBean = new ShareImageBean();
        if (map.hasKey("imageUrlStr")) {
            shareImageBean.setImageUrlStr(map.getString("imageUrlStr"));
        } else {
            return null;
        }

        if (map.hasKey("QRCodeStr")) {
            shareImageBean.setQRCodeStr(map.getString("QRCodeStr"));
        } else {
            return null;
        }

        if (map.hasKey("titleStr")) {
            shareImageBean.setTitleStr(map.getString("titleStr"));
        } else {
            shareImageBean.setTitleStr("");
        }

        if (map.hasKey("priceStr")) {
            shareImageBean.setPriceStr(map.getString("priceStr"));
        } else {
            shareImageBean.setPriceStr("");
        }

        if (map.hasKey("retailPrice")) {
            shareImageBean.setRetail(map.getString("retailPrice"));
        } else {
            shareImageBean.setRetail("");
        }

        if (map.hasKey("spellPrice")) {
            shareImageBean.setSpell(map.getString("spellPrice"));
        } else {
            shareImageBean.setSpell("");
        }

        if(map.hasKey("imageType")){
            shareImageBean.setImageType(map.getString("imageType"));
        }else {
            shareImageBean.setImageType(null);
        }

        return shareImageBean;
    }

    @ReactMethod
    public void saveImage(String path) {
        Uri uri = Uri.parse(path);
        saveImageAndRefresh(uri);
        ToastUtils.showToast("保存成功");
    }

    private void saveImageAndRefresh(Uri uri) {
        Intent intent = new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE);
        intent.setData(uri);
        mContext.sendBroadcast(intent);
    }

    @ReactMethod
    public void creatQRCodeImage(String QRCodeStr, final Callback success, final Callback fail) {
        Bitmap bitmap = createQRImage(QRCodeStr, 300, 300);
        if (bitmap == null) {
            fail.invoke("二维码生成失败！");
            return;
        }
        String path = BitmapUtils.saveImageToCache(bitmap, "shareImage.png", QRCodeStr);
        if (TextUtils.isEmpty(path)) {
            fail.invoke("图片保存失败！");
        } else {
            success.invoke(path);
        }

        if (bitmap != null && !bitmap.isRecycled()) {
            bitmap.recycle();
            bitmap = null;
        }

    }

    @ReactMethod
    public void saveScreen(ReadableMap params, Callback success, Callback fail) {
        screenshot(success, fail);
    }

    /**
     * 获取屏幕
     */
    private void screenshot(Callback success, Callback fail) {
        // 获取屏幕
        View dView = mContext.getCurrentActivity().getWindow().getDecorView();
        dView.setDrawingCacheEnabled(true);
        dView.buildDrawingCache();
        Bitmap bmp = dView.getDrawingCache();
        long date = System.currentTimeMillis();
        String storePath = SDCardUtils.getFileDirPath(mContext, "MR/picture").getAbsolutePath() + File.separator + "screenshotImage.png_" + date;

        File file = new File(storePath);
        if (bmp != null) {
            try {
                if (file.exists()) {
                    file.delete();
                }
                FileOutputStream os = new FileOutputStream(file);
                bmp.compress(Bitmap.CompressFormat.PNG, 100, os);
                os.flush();
                os.close();
                Uri uri = Uri.fromFile(file);
                saveImageAndRefresh(uri);

                success.invoke();
            } catch (Exception e) {
                fail.invoke(e.getMessage());
            }
        } else {
            fail.invoke();
        }
        if (bmp != null && !bmp.isRecycled()) {
            bmp.recycle();
            bmp = null;
        }
    }

    /**
     * 生成二维码 要转换的地址或字符串,可以是中文
     *
     * @param url
     * @param width
     * @param height
     * @return
     */
    public static Bitmap createQRImage(String url, final int width, final int height) {
        try {
            // 判断URL合法性
            if (url == null || "".equals(url) || url.length() < 1) {
                return null;
            }
            Hashtable<EncodeHintType, Object> hints = new Hashtable<>();
            hints.put(EncodeHintType.CHARACTER_SET, "utf-8");
            hints.put(EncodeHintType.MARGIN, 0);
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
            // 图像数据转换，使用了矩阵转换
            BitMatrix bitMatrix = new QRCodeWriter().encode(url, BarcodeFormat.QR_CODE, width, height, hints);
            int[] pixels = new int[width * height];
            // 下面这里按照二维码的算法，逐个生成二维码的图片，
            // 两个for循环是图片横列扫描的结果
            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    if (bitMatrix.get(x, y)) {
                        pixels[y * width + x] = 0xff000000;
                    } else {
                        pixels[y * width + x] = 0xffffffff;
                    }
                }
            }
            // 生成二维码图片的格式，使用ARGB_8888
            Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
            bitmap.setPixels(pixels, 0, width, 0, 0, width, height);
            return bitmap;
        } catch (WriterException e) {
            e.printStackTrace();
        }
        return null;
    }
}
