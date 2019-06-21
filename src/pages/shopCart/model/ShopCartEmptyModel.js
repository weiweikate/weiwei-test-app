import { observable, action } from 'mobx';
import ShopCartAPI from '../api/ShopCartApi';
import user from '../../../model/user';

const EmptyViewTypes = {
    topEmptyItem: 'topEmptyItem',
    recommendListItem: 'recommendListItem'
};

class ShopCartEmptyModel {
    @observable
    emptyViewList = [];
    @observable
    isFetching = false;
    @observable
    errorMsg = '';
    @observable
    isEnd = false;

    pageSize = 2;

    page = 1;

    constructor(props) {
        this.createData();
    }

    createData = () => {

        this.emptyViewList.push(
            {
                id: 0,
                type: EmptyViewTypes.topEmptyItem,
                height: 168 + 98,
                imageHeight: 168
            }
        );

    };
    @observable
    isRefreshing = false;
    @action
    getRecommendProducts = (isRefresh = true) => {

        if (isRefresh) {
            this.page = 0;
        } else {
            this.isFetching = true;
            this.page = this.page + 1;
        }
        if (user.isLogin) {
            ShopCartAPI.recommendProducts({
                page: this.page,
                pageSize: this.pageSize
            }).then(result => {
                let goodList = result.data || [];
                let tempArr = [];
                let newArr = [];

                tempArr = goodList.map((goodItem, index) => {
                    return {
                        ...goodItem,
                        id: index,
                        type: EmptyViewTypes.recommendListItem,
                        height: 168 + 98,
                        imageHeight: 168
                    };
                });
                if (isRefresh) {
                    newArr.push({
                        id: 0,
                        type: EmptyViewTypes.topEmptyItem,
                        height: 168 + 98,
                        imageHeight: 168
                    });
                    newArr = newArr.concat(tempArr);
                } else {
                    if (goodList.length < this.pageSize) {
                        this.isEnd = true;
                    }
                    newArr = newArr.concat([...this.emptyViewList.slice(), ...tempArr]);
                }
                this.emptyViewList = newArr;
                console.log(result);
            }).catch(error => {
            });
        } else {
            ShopCartAPI.recommend_products_not_login({
                page: this.page,
                pageSize: this.pageSize
            }).then(result => {
                let goodList = result.data || [];
                let tempArr = [];
                let newArr = [];

                tempArr = goodList.map((goodItem, index) => {
                    return {
                        ...goodItem,
                        id: index,
                        type: EmptyViewTypes.recommendListItem,
                        height: 168 + 98,
                        imageHeight: 168
                    };
                });
                if (isRefresh) {
                    newArr.push({
                        id: 0,
                        type: EmptyViewTypes.topEmptyItem,
                        height: 168 + 98,
                        imageHeight: 168
                    });
                    newArr = newArr.concat(tempArr);
                } else {
                    if (goodList.length < this.pageSize) {
                        this.isEnd = true;
                    }
                    newArr = newArr.concat([...this.emptyViewList.slice(), ...tempArr]);
                }
                this.emptyViewList = newArr;
                console.log(result);
            }).catch(error => {

            });
        }

    };


}

const shopCartEmptyModel = new ShopCartEmptyModel();

export { shopCartEmptyModel, EmptyViewTypes };
