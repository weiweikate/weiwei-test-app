//
//  JXFooterView.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "JXFooterView.h"
#import "UIView+SDAutoLayout.h"
#import "UIImageView+WebCache.h"

#define SCREEN_WIDTH ([UIScreen mainScreen].bounds.size.width)

@interface JXFooterView()
@property (nonatomic, strong)UIScrollView * scrollView;
@property (nonatomic,strong) UIButton * zanBtn;
@property (nonatomic,strong) UIButton * downloadBtn;
@property (nonatomic,strong) UIButton * shareBtn;
@property (nonatomic,strong) UILabel * zanNum;
@property (nonatomic,strong) UILabel * downLoadNUm;

@end

@implementation JXFooterView

-(UIScrollView *)scrollView{
    if(!_scrollView){
      _scrollView = [[UIScrollView alloc] init];
      _scrollView.showsHorizontalScrollIndicator = NO;//不显示水平拖地的条
      _scrollView.showsVerticalScrollIndicator=NO;//不显示垂直拖动的条
//      _scrollView.pagingEnabled = YES;//允许分页滑动
      _scrollView.bounces = NO;//到边了就不能再拖地
    }
    return _scrollView;
}

-(UILabel *)zanNum{
    if(!_zanNum){
        _zanNum = [[UILabel alloc]init];
        _zanNum.font = [UIFont systemFontOfSize:10];
        _zanNum.textColor =[UIColor colorWithRed:51/255.0 green:51/255.0 blue:51/255.0 alpha:1.0];
    }
    return _zanNum;
}

-(UILabel *)downLoadNUm{
    if(!_downLoadNUm){
        _downLoadNUm = [[UILabel alloc]init];
        _downLoadNUm.font = [UIFont systemFontOfSize:10];
        _downLoadNUm.textColor =[UIColor colorWithRed:51/255.0 green:51/255.0 blue:51/255.0 alpha:1.0];
    }
    return _downLoadNUm;
    
}

-(UIButton*)zanBtn{
  if(!_zanBtn){
    _zanBtn = [UIButton buttonWithType:UIButtonTypeCustom];
  }
  return _zanBtn;
}

-(UIButton*)downloadBtn{
  if(!_downloadBtn){
    _downloadBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [_downloadBtn setBackgroundImage:[UIImage imageNamed:@"download"] forState:UIControlStateNormal];
  }
  return _downloadBtn;
}

-(UIButton*)shareBtn{
  if(!_shareBtn){
    _shareBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [_shareBtn setImage:[UIImage imageNamed:@"fenxiang"] forState:UIControlStateNormal];
  }
  return _shareBtn;
}

-(instancetype)initWithFrame:(CGRect)frame{
  self = [super initWithFrame:frame];
  if (self) {
    [self setUI];
  }
  return  self;
}

-(void)setUI{
    [self addSubview:self.scrollView];
    [self addSubview:self.zanBtn];
    [self addSubview:self.zanNum];
    [self addSubview:self.downloadBtn];
    [self addSubview:self.downLoadNUm];
    [self addSubview:self.shareBtn];
    
  //点赞
  [_zanBtn addTarget:self action:@selector(tapZanBtn:) forControlEvents:UIControlEventTouchUpInside];
  self.zanBtn.sd_layout.topSpaceToView(self.scrollView,10)
  .heightIs(25).widthIs(25)
  .leftSpaceToView(self, 30);
    
  self.zanNum.sd_layout.centerYEqualToView(self.zanBtn)
  .leftSpaceToView(self.zanBtn, 1)
  .widthIs(40).heightIs(25);

  //下载
  [_downloadBtn addTarget:self action:@selector(tapDownloadBtn:) forControlEvents:UIControlEventTouchUpInside];
  self.downloadBtn.sd_layout.centerYEqualToView(self.zanNum)
  .leftSpaceToView(self.zanNum, 0)
  .widthIs(22).heightIs(22);
    
  self.downLoadNUm.sd_layout.centerYEqualToView(self.downloadBtn)
  .leftSpaceToView(self.downloadBtn, 1)
  .widthIs(40).heightIs(25);

  //分享/转发
  [_shareBtn addTarget:self action:@selector(tapShareBtn:) forControlEvents:UIControlEventTouchUpInside];
  self.shareBtn.sd_layout.centerYEqualToView(self.zanBtn)
     .rightSpaceToView(self, 0)
     .widthIs(60).heightIs(25);
    
  [self setupAutoHeightWithBottomView:self.zanBtn bottomMargin:0];


}

-(void)setProducts:(NSArray *)products{
  if(products.count<=0){
    return;
  }
  _products = products;
  [self setGoodsView];
}

-(void)setDownloadCount:(NSInteger)downloadCount{
    _downloadCount = downloadCount;
  self.downLoadNUm.text = [NSString stringWithFormat:@"%ld",downloadCount];
}

-(void)setLikesCount:(NSInteger)likesCount{
  _likesCount = likesCount;
  self.zanNum.text = [NSString stringWithFormat:@"%ld",likesCount];
}

-(void)setIsLike:(BOOL)isLike{
  if(isLike){
    [_zanBtn setBackgroundImage:[UIImage imageNamed:@"yizan"] forState:UIControlStateNormal];

  }else{
    [_zanBtn setBackgroundImage:[UIImage imageNamed:@"zan"] forState:UIControlStateNormal];
  }
}

-(void)setGoodsView{
    NSInteger len = self.products.count;
    CGFloat width = len>0&&len<=1?(SCREEN_WIDTH-90):(SCREEN_WIDTH-110);
  if(len>0){
    self.scrollView.sd_layout
    .topEqualToView(self)
    .leftEqualToView(self)
    .rightEqualToView(self)
    .heightIs(72);
    
    //移除scrollview子视图
    for(UIView *view in [self.scrollView subviews]){
      [view removeFromSuperview];
    }
    
      self.scrollView.contentSize = len>0&&len<=1?CGSizeMake(width*len+30, 70):CGSizeMake(width*len+10*len+30, 70);
    for (int i=0; i<len; i++) {
        UIView *bgView = [[UIView alloc] init];
        //设置圆角
        bgView.layer.cornerRadius = 5;
        //将多余的部分切掉
        bgView.layer.masksToBounds = YES;
        CGFloat spaceWith = i==0 ? 30:30+10*i;
        bgView.frame = CGRectMake((width)*i+spaceWith, 0, width, 70);
        bgView.backgroundColor = [UIColor colorWithRed:247/255.0 green:247/255.0 blue:247/255.0 alpha:1.0];
        UIImageView* goodsImg = [[UIImageView alloc] init];
        //设置圆角
        goodsImg.layer.cornerRadius = 5;
        //将多余的部分切掉
        goodsImg.layer.masksToBounds = YES;
        goodsImg.image = [UIImage imageNamed:@"welcome3"];
        [goodsImg sd_setImageWithURL:[NSURL URLWithString:[self.products[0] valueForKey:@"imgUrl"]] placeholderImage:[UIImage imageNamed:@"default_avatar"]];
      
      
        UILabel* titile = [[UILabel alloc]init];
        titile.font = [UIFont systemFontOfSize:10];
        titile.textColor = [UIColor colorWithRed:51/255.0 green:51/255.0 blue:51/255.0 alpha:1.0];
        titile.text = [self.products[0] valueForKey:@"name"];
    
        
        UILabel* price = [[UILabel alloc]init];
        price.font = [UIFont systemFontOfSize:10];
        price.textColor = [UIColor lightGrayColor];
//      if([self.products[i][@"price"] && self.products[i][@"originalPrice"]){
        price.attributedText = [self getPriceAttribute:[self.products[i] valueForKey:@"groupPrice"] oldPrice:[self.products[i] valueForKey:@"originalPrice"]];
//        }
      
        UIButton* shopCarBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        shopCarBtn.tag = i+1;
        shopCarBtn.titleLabel.font = [UIFont systemFontOfSize:12];
        [shopCarBtn setImage:[UIImage imageNamed:@"jiarugouwuche"] forState:UIControlStateNormal];
        //加入购物车
        [shopCarBtn addTarget:self action:@selector(addCarBtn:) forControlEvents:UIControlEventTouchUpInside];
        [bgView sd_addSubviews:@[goodsImg,titile,price,shopCarBtn]];
        //商品图片
        goodsImg.sd_layout.topSpaceToView(bgView, 5)
        .leftSpaceToView(bgView, 5)
        .widthIs(60).heightIs(60);
        
        //标题
        titile.sd_layout.topSpaceToView(bgView, 10)
        .leftSpaceToView(goodsImg, 10)
        .rightSpaceToView(bgView, 10)
        .heightIs(20);
        
        //购物车
        shopCarBtn.sd_layout.bottomSpaceToView(bgView, 5)
        .rightSpaceToView(bgView, 10)
        .widthIs(20).heightIs(20);
        
        //价格
        price.sd_layout.bottomEqualToView(goodsImg)
        .leftSpaceToView(goodsImg, 10)
        .rightSpaceToView(shopCarBtn, 1)
        .heightIs(21);
        
        [_scrollView addSubview:bgView];
        
    }
  }
}

-(void)tapZanBtn:(UIButton*)sender{
  if(self.zanBlock){
    self.zanBlock(@"");
  }
}

-(void)tapDownloadBtn:(UIButton*)sender{
  if(self.downloadBlock){
    self.downloadBlock(@"");

  }
}

-(void)tapShareBtn:(UIButton*)sender{
  if(self.shareBlock){
    self.shareBlock(@"");
  }
}

-(void)addCarBtn:(UIButton*)sender{
  if(self.addCarBlock){
    self.addCarBlock(@"");
  }
}

-(NSMutableAttributedString *)getPriceAttribute:(NSString*)price oldPrice:(NSString*)oldPrice{
    CGFloat priceF = [price floatValue];
    CGFloat oldPriceF = [oldPrice floatValue];
  
  NSString *str = [NSString stringWithFormat:@"¥%@",[self decimalNumberWithDouble: priceF]];
  NSString *oldStr = [NSString stringWithFormat:@"¥%@",[self decimalNumberWithDouble: oldPriceF]] ;
    NSInteger len = str.length;
    NSString * string = [NSString stringWithFormat:@"%@  %@",str,oldStr];
    NSMutableAttributedString *attrStr = [[NSMutableAttributedString alloc]
                                          initWithString:string];
    
    [attrStr addAttribute:NSForegroundColorAttributeName value:[UIColor redColor] range:NSMakeRange(0, len)];
    [attrStr addAttribute:NSFontAttributeName value:[UIFont boldSystemFontOfSize:15] range:NSMakeRange(1, len)];
    [attrStr addAttribute:NSStrikethroughStyleAttributeName value:@(1) range:NSMakeRange(len+2, oldStr.length)];
    
    return attrStr;
}

-(NSString *)decimalNumberWithDouble:(CGFloat)conversionValue{
  NSString *doubleString        = [NSString stringWithFormat:@"%.2lf", conversionValue];
  NSDecimalNumber *decNumber    = [NSDecimalNumber decimalNumberWithString:doubleString];
  return [decNumber stringValue];
}
@end
