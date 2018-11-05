/*
 * 首页 滚动设置
 */

header_height=$('#shouye header').height();
bottom_height=$('nav').height();
scroll_height=$('#shouye .mui-content .mui-scroll-wrapper').height()-header_height-bottom_height;


mui('.mui-content .mui-scroll-wrapper').scroll({
	deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
	indicators: false,
});

$('.mui-content .mui-scroll-wrapper').css('top',header_height+'px');
$('.mui-content .mui-scroll-wrapper').css('height',scroll_height+'px');