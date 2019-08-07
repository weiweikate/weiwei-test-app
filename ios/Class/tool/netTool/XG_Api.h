//
//  XG_Api.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/2/19.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#ifndef XG_Api_h
#define XG_Api_h

#define ShowApi_query   @"/discover/query@GET"
#define AdApi_query   @"/advertising/queryAdvertisingList"
#define Api_queryBaseUrl   @"/redirect/baseUrl@GET"
#define ChatApi_ShopInfoBySupplierCode @"/product/getProductShopInfoBySupplierCode@GET"
#define ShowApi_mineQuery @"/social/show/content/page/mine/query@GET"
#define ShowApi_mineCollect @"/social/show/content/page/mine/collect@GET"
#define ShowApi_otherQuery @"/social/show/content/page/other/query@GET"
#define ShowApi_Video_Auth @"/social/show/token"
// type 类型 ： 1.点赞 2.收藏3.分享4.下载 5.浏览量 6.人气值
#define ShowApi_reduceCountByType @"/social/show/count/reduceCountByType"
#define ShowApi_incrCountByType @"/social/show/count/incrCountByType"
#endif /* Header_h */
