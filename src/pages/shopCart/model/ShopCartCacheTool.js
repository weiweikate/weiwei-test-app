import ShopCartAPI from '../api/ShopCartApi';
import bridge from '../../../utils/bridge';
import user from '../../../model/user';
import shopCartStore from './ShopCartStore';
import store from '@mr/rn-store';
import apiEnvironment from '../../../api/ApiEnvironment';

class ShopCartCacheTool {

    static  shopCartLocalStorageKey = '@mr/' + apiEnvironment.getCurrentHostUrl() + 'shopCartLocalStorageKey';

    /**
     * 删除本地数据
     */
    deleteAllLocalData() {
        store.deleted(ShopCartCacheTool.shopCartLocalStorageKey);
    }

    /*同步购物车商品*/
    synchronousData() {
        //用户非登入状态
        store.get(ShopCartCacheTool.shopCartLocalStorageKey).then(res => {
            res = res ? res : [];
            let [...localValue] = res;
            if (localValue && (localValue instanceof Array && localValue.length > 0)) {
                ShopCartAPI.addItem(
                    {
                        shoppingCartParamList: localValue
                    }
                ).then(res => {
                    bridge.hiddenLoading();
                    //同步完数据组装
                    shopCartStore.packingShopCartGoodsData(res.data);
                    //同步成功删除本地数据
                    this.deleteAllLocalData();
                }).catch(error => {
                    bridge.hiddenLoading();
                });
            } else {
                //不存在本地缓存 但他妈的也得拉一下数据老铁
                shopCartStore.getShopCartListData();
            }
        }).catch(error => {
            // console.warn('获取购物车本地缓存异常');本地未获取到购物车信息,也需要从服务器拉取一下
            shopCartStore.getShopCartListData();
        });
    }

    /**
     * 删除购物车数据
     */

    deleteShopCartGoods(skuCodes) {
        if (user.isLogin) {
            //登陆状态 直接后台删除
            shopCartStore.deleteItemWithIndex(skuCodes);
        } else {
            //从本地拿出数据删除掉
            store.get(ShopCartCacheTool.shopCartLocalStorageKey).then(res => {
                res = res ? res : [];
                let [...localValue] = res;
                if (localValue && (localValue instanceof Array)) {
                    localValue.map((itemData) => {
                        skuCodes.map(skuCode => {
                            if (skuCode.skuCode === itemData.skuCode) {
                                localValue.splice(localValue.indexOf(itemData), 1);
                            }
                        });
                    });
                }
                //再存入本地
                store.save(ShopCartCacheTool.shopCartLocalStorageKey, localValue).then(() => {
                    //拉取刷新
                    shopCartStore.getShopCartListWithNoLogin(localValue);
                }).catch(error => {

                });
            }).catch(error => {
            });
        }
    }

    /*
    * 参数对象必须包括参数
    * "amount": 10, 商品数量
    * "priceId": 10, 商品规格id
    * "productId": 10, 商品id
    *  "timestamp": 1536633469102 时间戳(非必须)
    * */
    addGoodItem(goodsItem) {
        if (goodsItem instanceof Array && goodsItem.length > 0) {
            goodsItem.map((good, index) => {
                good.timestamp = (new Date().getTime());
                goodsItem[index] = good;
            });
            if (user.isLogin) {
                //在来一单
                shopCartStore.addOneMoreList(goodsItem);
            }
        } else {
            //为商品添加时间戳
            // goodsItem.timestamp = (new Date().getTime());
            if (user.isLogin) {
                //将数据添加到后台服务器
                shopCartStore.addItemToShopCart(goodsItem);
            } else {
                //缓存本地
                store.get(ShopCartCacheTool.shopCartLocalStorageKey).then(res => {
                    //为商品添加spuCode
                    goodsItem.spuCode = goodsItem.productCode;
                    res = res ? res : [];
                    let [...localValue] = res;
                    if (localValue && (localValue instanceof Array) && localValue.length > 0) {
                        //检测购物车数量是否已够80
                        if (localValue.length >= 80) {
                            bridge.$toast('本地购物车商品类型已达80种上限');
                            return;
                        }
                        let isHave = false;
                        localValue.map((localItem, indexPath) => {
                            if (localItem.skuCode === goodsItem.skuCode &&
                                localItem.productCode === goodsItem.productCode) {
                                let newAmount = localItem.amount + goodsItem.amount;
                                if (newAmount > 200) {
                                    goodsItem.amount = 200;
                                } else {
                                    goodsItem.amount = newAmount;
                                }
                                localValue[indexPath] = goodsItem;
                                isHave = true;
                            }
                        });
                        if (!isHave) {
                            localValue.unshift(goodsItem);
                        }
                    } else {
                        localValue = [];
                        localValue.push(goodsItem);
                    }
                    store.save(ShopCartCacheTool.shopCartLocalStorageKey, localValue).then(() => {
                        //存入成功后,从后台拉取详细信息
                        shopCartStore.getShopCartListWithNoLogin(localValue);
                    }).catch(() => {
                        bridge.$toast('本地加入购物车失败');
                    });
                }).catch(error => {

                });
            }
        }

    }

    /*获取购物车数据 总入口*/
    getShopCartGoodsListData() {
        if (user.isLogin) {
            //用户登录状态
            shopCartStore.getShopCartListData();
        } else {
            //用户非登入状态
            store.get(ShopCartCacheTool.shopCartLocalStorageKey).then(res => {
                //拿到数据后拉去详情
                res = res ? res : [];
                let [...localValue] = res;
                shopCartStore.getShopCartListWithNoLogin(localValue);
            }).catch(error => {
                alert(error);
                bridge.$toast('读取本地数据异常');
            });
        }
    }

    /*更新购物车数据*/
    updateShopCartDataLocalOrService(itemData, rowId) {
        //判断商品是否有效
        if (itemData.status === 0) {
            bridge.$toast('此商品已下架~');
            return;
        }
        //判断商品数量
        if (itemData.amount > 200) {
            itemData.amount = 200;
            bridge.$toast('单个商品最大数量上限为200个');
        }
        if (user.isLogin) {
            shopCartStore.updateCartItem(itemData, rowId);
        } else {
            /*未登录状态登录状态更新本地*/
            store.get(ShopCartCacheTool.shopCartLocalStorageKey).then(res => {
                res = res ? res : [];
                let [...localValue] = res;
                if (localValue instanceof Array && localValue.length > 0) {
                    localValue.map((localItemGood, indexPath) => {
                        if (localItemGood.spuCode === itemData.spuCode &&
                            localItemGood.skuCode === itemData.skuCode) {
                            localValue[indexPath] = itemData;
                        }
                    });
                }
                //重新缓存
                store.save(ShopCartCacheTool.shopCartLocalStorageKey, localValue).then(() => {
                    //重新拉去数据
                    shopCartStore.getShopCartListWithNoLogin(localValue);
                }).catch(() => {
                    console.warn('缓存本地购物车数据异常');
                });
            }).catch(() => {
                console.warn('获取本地购物车数据异常');
            });
        }
    }
}

const shopCartCacheTool = new ShopCartCacheTool();

export default shopCartCacheTool;

