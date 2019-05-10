import { observable, computed, action } from 'mobx';
import bridge from '../../../utils/bridge';
import StringUtils from '../../../utils/StringUtils';

const { add, mul } = StringUtils;

export default class SuitProductModel {
    @observable groupCode;
    @observable selectedAmount = 1;
    /*主商品*/
    /*
    * product级别 额外增加字段 选择的sku
    * selectedSkuItem: null,
    * isSelected: false,
    * */
    @observable mainProduct = {};

    /*子商品们*/
    /*product级别 额外增加字段
    * selectedSkuItem: null,
    * isSelected: false,
    * minDecrease: 活动商品最小优惠价格
    * */
    @observable subProductArr = [];
    /*子商品们skuS*/
    @observable selectedItems = [];

    /*去选择的商品*/
    @observable selectItem = {};

    //是否能增加
    @computed get canAddAmount() {
        //最大能点击数 选择里面的最小
        if (this.selectedItems.length === 0 && this.mainProduct.isSelected) {
            return true;
        } else {
            /*子商品*/
            let sellStockList = this.selectedItems.map((item) => {
                return item.promotionStockNum;
            });
            /*主商品*/
            if (this.mainProduct.isSelected) {
                sellStockList.push(this.mainProduct.selectedSkuItem.sellStock);
            }
            let minSellStock = Math.min.apply(null, sellStockList);
            return minSellStock > this.selectedAmount;
        }
    }

    @computed get totalPayMoney() {
        let subPrice = this.selectedItems.reduce((pre, cur) => {
            const { promotionPrice } = cur;
            return add(pre, mul(promotionPrice, this.selectedAmount));
        }, 0);

        const { price = 0 } = this.mainProduct.selectedSkuItem || {};
        return add(subPrice, mul(price, this.selectedAmount));
    }

    @computed get totalSubMoney() {
        return this.selectedItems.reduce((pre, cur) => {
            const { promotionDecreaseAmount } = cur;
            return add(pre, mul(promotionDecreaseAmount, this.selectedAmount));
        }, 0);
    }

    @action addAmount = () => {
        this.selectedAmount++;
        // this.changeArr();
    };

    @action subAmount = () => {
        if (this.selectedAmount === 1) {
            return;
        }
        this.selectedAmount--;
        //是否能选择
        // this.changeArr();
    };

    @action changeItem = (item, isPromotion, isUpdate) => {
        const { isSelected } = this.selectItem;
        if (isSelected && !isUpdate) {
            /*选择了:删除sku和选择状态*/
            this.selectItem.selectedSkuItem = null;
            this.selectItem.isSelected = false;
        } else {
            /*未选择:弹框选择规格后*/
            if ((isPromotion ? item.promotionStockNum : item.sellStock) < this.selectedAmount) {
                bridge.$toast(`所选规格的商品库存不满${this.selectedAmount}件`);
            } else {
                this.selectItem.selectedSkuItem = item;
                this.selectItem.isSelected = true;
            }
        }
        //获取选择的item
        let tempArr = this.subProductArr.filter((item1) => {
            return item1.isSelected;
        });
        this.selectedItems = tempArr.map((item) => {
            return item.selectedSkuItem;
        });
    };

    /*初始化*/
    @action setSubProductArr = (productDetailModel) => {
        const { productData, groupActivity } = productDetailModel;
        let tempProductData = JSON.parse(JSON.stringify(productData || {}));
        let tempGroupActivity = JSON.parse(JSON.stringify(groupActivity || {}));

        this.groupCode = groupActivity.code;

        //主商品不参加活动
        this.mainProduct = {
            ...tempProductData,
            selectedSkuItem: null,
            isSelected: false
        };
        this.subProductArr = (tempGroupActivity.subProductList || []).map((item) => {
            let decreaseList = (item.skuList || []).map((sku) => {
                return sku.promotionDecreaseAmount;
            });
            return {
                ...item,
                /*选择的库存*/
                selectedSkuItem: null,
                isSelected: false,
                minDecrease: decreaseList.length === 0 ? 0 : Math.min.apply(null, decreaseList)
            };
        });
    };
}
