import { observable, computed, action, flow } from "mobx"
import ShowApi from './ShowApi'

//推广 1：精选 2：热门 3：推荐 4：最新 全部则不传
const tag = {
    'Featured': 1,
    'Hot': 2,
    'Recommend': 3,
    'New': 4
}

export const tagName = {
    [tag.Featured]: '精选',
    [tag.Hot]: '热门',
    [tag.Recommend]: '推荐',
    [tag.New]: '最新'
}


export class HomeShowModules {
    @observable showList = []
    @computed get showImage() {
        if (this.showList.length > 0) {
            return this.showList[0].img
        } else {
            return ''
        }
     }

    @action loadShowList = flow(function * (params) {
        try {
            const result = yield ShowApi.showQuery()
            this.showList = result.data.data
        } catch (error) {
            console.log(error)
        }
    })
}

export class ShowBannerModules {
    @observable bannerList = []
    @computed get bannerCount() {
        return this.bannerList.length
    }
    @action loadBannerList = () => {
        this.bannerList = [
            {
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://imgsrc.baidu.com/imgad/pic/item/34fae6cd7b899e51ec89f83949a7d933c8950d9c.jpg'
            },
            {
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg'
            },
            {
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg'
            }
        ]
    }
}

export class ShowChoiceModules {
    @observable choiceList = []
    @computed get choiceCount() {
        return this.choiceList.length
    }
    @action loadChoiceList = flow(function * (params) {
        try {
            const result = yield ShowApi.showQuery({generalize: tag.Featured})
            this.choiceList = result.data.data
        } catch (error) {
            console.log(error)
        }
    })
}

export class ShowFindModules {
    @observable findList = []
    @computed get findCount() {
        return this.choiceList.length
    }
    @action loadFindList = () => {
        this.findList = [
            {
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://imgsrc.baidu.com/imgad/pic/item/34fae6cd7b899e51ec89f83949a7d933c8950d9c.jpg',
                number: 1234,
                portrait: 'http://a.hiphotos.baidu.com/zhidao/wh%3D450%2C600/sign=0179844a868ba61edfbbc02b7404bb3c/64380cd7912397dd11081a845d82b2b7d0a28739.jpg',
                name: '上课了',
                time: '1分钟'
            },
            {
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg',
                number: 1234,
                portrait: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7155dd0b7fd5266a77e34129b28bb13/e1fe9925bc315c6002763ad48cb1cb134954772d.jpg',
                name: '上课了',
                time: '1分钟'
            },
            {
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg',
                number: 1234,
                portrait: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7155dd0b7fd5266a77e34129b28bb13/e1fe9925bc315c6002763ad48cb1cb134954772d.jpg',
                name: '上课了',
                time: '1分钟'
            }
        ]
    }
}

export class ShowHotModules {
    @observable hotList = []
    @computed get hotCount() {
        return this.hotList.length
    }
    @action loadHotList = flow(function * (params) {
        try {
            const result = yield ShowApi.showQuery({generalize: tag.Hot})
            this.hotList = result.data.data
        } catch (error) {
            console.log(error)
        }
    })
}


export class ShowRecommendModules {
    @observable recommendList = []
    @observable selectedList = new Map()
    @computed get recommendCount() {
        return this.recommendList.length
    }
    @action loadRecommendList = () => {
        return [
            {
                id: 1,
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://imgsrc.baidu.com/imgad/pic/item/34fae6cd7b899e51ec89f83949a7d933c8950d9c.jpg',
                number: 1234,
                portrait: 'http://a.hiphotos.baidu.com/zhidao/wh%3D450%2C600/sign=0179844a868ba61edfbbc02b7404bb3c/64380cd7912397dd11081a845d82b2b7d0a28739.jpg',
                name: '上课了',
                time: '1分钟',
                width: 300,
                height: 300
            },
            {
                id: 2,
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg',
                number: 1234,
                portrait: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7155dd0b7fd5266a77e34129b28bb13/e1fe9925bc315c6002763ad48cb1cb134954772d.jpg',
                name: '上课了',
                time: '1分钟',
                width: 300,
                height: 400
            },
            {
                id: 3,
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg',
                number: 1234,
                portrait: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7155dd0b7fd5266a77e34129b28bb13/e1fe9925bc315c6002763ad48cb1cb134954772d.jpg',
                name: '上课了',
                time: '1分钟',
                width: 400,
                height: 500
            },
            {
                id: 4,
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg',
                number: 1234,
                portrait: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7155dd0b7fd5266a77e34129b28bb13/e1fe9925bc315c6002763ad48cb1cb134954772d.jpg',
                name: '上课了',
                time: '1分钟',
                width: 300,
                height: 400
            }
        ]
    }

    @action getMoreRecommendList = () => {
        let time = new Date().getTime()
        return [
            {
                id: time + 1,
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://imgsrc.baidu.com/imgad/pic/item/34fae6cd7b899e51ec89f83949a7d933c8950d9c.jpg',
                number: 1234,
                portrait: 'http://a.hiphotos.baidu.com/zhidao/wh%3D450%2C600/sign=0179844a868ba61edfbbc02b7404bb3c/64380cd7912397dd11081a845d82b2b7d0a28739.jpg',
                name: '上课了',
                time: '1分钟',
                width: 300,
                height: 300
            },
            {
                id: time + 2,
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg',
                number: 1234,
                portrait: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7155dd0b7fd5266a77e34129b28bb13/e1fe9925bc315c6002763ad48cb1cb134954772d.jpg',
                name: '上课了',
                time: '1分钟',
                width: 300,
                height: 400
            },
            {
                id: time + 3,
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg',
                number: 1234,
                portrait: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7155dd0b7fd5266a77e34129b28bb13/e1fe9925bc315c6002763ad48cb1cb134954772d.jpg',
                name: '上课了',
                time: '1分钟',
                width: 400,
                height: 500
            },
            {
                id: time + 4,
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg',
                number: 1234,
                portrait: 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=b7155dd0b7fd5266a77e34129b28bb13/e1fe9925bc315c6002763ad48cb1cb134954772d.jpg',
                name: '上课了',
                time: '1分钟',
                width: 300,
                height: 400
            }
        ]
    }

    @action selectedAction = (data) => {
        data.selected = !data.selected
        // let index = this.selectedList.findIndex((value) => data.id === value.id)
        // console.log('selectedAction', data, index)
        // if (this.selectedList.has(data.id)) {
        //     this.selectedList.delete(data.id)
        // } else {
        //     this.selectedList.set(data.id, true)
        // }
        // console.log('this.selectedList', this.selectedList.toJS())
    }
}

export class ShowDetail {
    @observable detail = ''
    @action loadDetail = flow(function * (id) {
        try {
            const result = yield ShowApi.showDetail({id: id})
            console.log('result', result.data)
            this.detail = result.data
        } catch (error) {
            console.log(error)
        }
    })

}
