//
//  Recommended Cell.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "RecommendedCell.h"
#import "UIView+SDAutoLayout.h"
#import "View/JXHeaderView.h"
#import "View/JXBodyView.h"
#import "View/JXFooterView.h"


@interface RecommendedCell()
@property (nonatomic,strong)JXHeaderView* headView;
@property (nonatomic,strong)JXBodyView* bodyView;
@property (nonatomic,strong)JXFooterView* footerView;
@property (nonatomic,strong) UILabel * contentLab;
@property (nonatomic, strong) UILabel *foldLabel;       // 展开按钮

@end

@implementation RecommendedCell

-(UILabel *)contentLab{
    if(!_contentLab){
        _contentLab = [[UILabel alloc]init];
        _contentLab.font = [UIFont systemFontOfSize:13];
        _contentLab.textColor = [UIColor colorWithRed:102/255.0 green:102/255.0 blue:102/255.0 alpha:1.0];
      _contentLab.userInteractionEnabled=YES;
      UITapGestureRecognizer *labelTapGestureRecognizer = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(labelTouchUpInside)];
      
      [_contentLab addGestureRecognizer:labelTapGestureRecognizer];
    }
    return _contentLab;
}


-(UILabel *)foldLabel{
    if (!_foldLabel) {
        _foldLabel = [[UILabel alloc] init];
        _foldLabel.font = [UIFont systemFontOfSize:13.f];
        _foldLabel.textColor = [UIColor colorWithRed:255/255.0 green:0/255.0 blue:80/255.0 alpha:1.0];
        _foldLabel.userInteractionEnabled = YES;
        UITapGestureRecognizer *foldTap =[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(foldNewsOrNoTap:)];
        [_foldLabel addGestureRecognizer:foldTap];
        _foldLabel.hidden = NO;
        [_foldLabel sizeToFit];
    }
    return _foldLabel;
}

-(JXHeaderView *)headView{
  if (!_headView) {
    _headView = [[JXHeaderView alloc] init];
  }
  return _headView;
}
-(JXBodyView *)bodyView{
  if (!_bodyView) {
    _bodyView = [[JXBodyView alloc] init];
    __weak RecommendedCell *weakSelf = self;
    _bodyView.imgBlock =  ^(NSString* a){
      NSLog(@"imgBlock");
      __strong RecommendedCell *strongSelf = weakSelf;
      if (strongSelf.cellDelegate) {
          [strongSelf.cellDelegate imageClick:strongSelf];
      }
    };
  }
  return _bodyView;
}

-(JXFooterView *)footerView{
  if (!_footerView) {
    _footerView = [[JXFooterView alloc] init];
    __weak RecommendedCell *weakSelf = self;
    _footerView.zanBlock =  ^(NSString* a){
      NSLog(@"zanClick");
      if (weakSelf.cellDelegate) {
        [weakSelf.cellDelegate zanClick:weakSelf];
      }
    };
    _footerView.downloadBlock =  ^(NSString* a){
      NSLog(@"downloadClick");
      if (weakSelf.cellDelegate) {
        [weakSelf.cellDelegate downloadClick:weakSelf];
      }
    };
    _footerView.shareBlock =  ^(NSString* a){
      NSLog(@"shareClick");
      if (weakSelf.cellDelegate) {
        [weakSelf.cellDelegate shareClick:weakSelf];
      }
    };
    _footerView.addCarBlock = ^(NSString* a){
      if (weakSelf.cellDelegate) {
        [weakSelf.cellDelegate addCar:weakSelf];
      }
    };
  }
  return _footerView;
}

- (void)awakeFromNib {
    [super awakeFromNib];
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];
}

-(instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier{
  
  if (self = [super initWithStyle:style reuseIdentifier:reuseIdentifier]) {
    self.selectionStyle = UITableViewCellSelectionStyleNone;
    self.contentView.backgroundColor = [UIColor colorWithRed:247/255.0 green:247/255.0 blue:247/255.0 alpha:1.0];
    [self setUI];
  }
  
  return self;
}

-(void)setUI{
  UIView*  bgView = [[UIView alloc] init];
    bgView.backgroundColor =  [UIColor colorWithRed:255/255.0 green:255/255.0 blue:255/255.0 alpha:1.0];
  [bgView.layer setCornerRadius:4.0];
  [self.contentView addSubview:bgView];
    
  [bgView addSubview:self.headView];
  [bgView addSubview:self.bodyView];
  [bgView addSubview:self.footerView];
  [bgView addSubview:self.contentLab];
  [bgView addSubview:self.foldLabel];
  
    bgView.sd_layout
    .leftSpaceToView(self.contentView, 0)
    .rightSpaceToView(self.contentView, 0)
    .topSpaceToView(self.contentView, 5)
    .autoHeightRatio(0);
  
  self.headView.sd_layout
  .topSpaceToView(bgView, 9)
  .leftSpaceToView(bgView, 0)
  .rightSpaceToView(bgView, 5)
  .heightIs(34);
  
    //内容
  self.contentLab.sd_layout.topSpaceToView(self.headView, 8)
  .leftSpaceToView(bgView, 45)
  .rightSpaceToView(bgView, 30)
  .autoHeightRatio(0);
    
  self.foldLabel.sd_layout.topSpaceToView(self.contentLab, 5)
  .leftSpaceToView(bgView, 45)
  .widthIs(40)
  .heightIs(20);
    
  self.bodyView.sd_layout
  .topSpaceToView(self.foldLabel, 5)
  .leftSpaceToView(bgView, 45);
    
    //
  self.footerView.sd_layout
  .topSpaceToView(self.bodyView, 10)
  .leftSpaceToView(bgView, 15)
  .rightSpaceToView(bgView, 15)
  .heightIs(120);
    
  [bgView setupAutoHeightWithBottomView:self.footerView bottomMargin:5];
  [self setupAutoHeightWithBottomView:bgView bottomMargin:5];
}

-(void)setModel:(JXModelData *)model{
    _model = model;
    self.headView.UserInfoModel =  (NSMutableDictionary*)model.userInfoVO;
    self.headView.time = model.publishTimeStr;
    self.bodyView.sources = model.resource;
    self.contentLab.text = model.content;
    
    self.footerView.products = model.products;
    self.footerView.downloadCount = model.downloadCount;
    self.footerView.likesCount = model.likesCount;
    self.footerView.shareCount = model.shareCount;
    self.footerView.isLike = model.like;

  
//    if( model.content.length>60){
//        self.foldLabel.hidden = NO;
//        if (model.isOpening) {
//            self.foldLabel.sd_layout.heightIs(20);
//            [self.contentLab setMaxNumberOfLinesToShow:0];
//            self.foldLabel.text = @"收起";
//        }else{
//            self.foldLabel.sd_layout.heightIs(20);
//            [self.contentLab setMaxNumberOfLinesToShow:3];
//            self.foldLabel.text = @"展开";
//        }
//    }else{
        [self.contentLab setMaxNumberOfLinesToShow:3];
        self.foldLabel.sd_layout.heightIs(0);
        self.foldLabel.hidden = YES;

//    }
}

/**
 *  折叠展开按钮的点击事件
 *
 *  @param recognizer 点击手势
 */
- (void)foldNewsOrNoTap:(UITapGestureRecognizer *)recognizer{
    if(recognizer.state == UIGestureRecognizerStateEnded){
        
        if (self.cellDelegate && [self.cellDelegate respondsToSelector:@selector(clickFoldLabel:)]) {
            
            [self.cellDelegate clickFoldLabel:self];
        }
    }
}

-(void)labelTouchUpInside{
  if (self.cellDelegate) {
    [self.cellDelegate labelClick:self];
  }
}

@end
