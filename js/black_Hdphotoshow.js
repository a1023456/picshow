/*
* Title Hd_photo
* Cn 高清图片新闻专用脚本:1.0;
* Date 2011.06.07 by xiaocong;
* 2012.02.29 修复自动播放不停止bug;
* 2012.02.8 修改图片高度自适应,幻灯播放设置成5秒;(chrome 下第一次打开不能读到)
*
*/
var _nowphoto = 0; 						//当前图片序号
var _ThumbnailListId = "qlpiclist";  	//缩略图列表 id
var _photod = "photod"; 				// 大图图片显示id
var _bigpicurlId = "bigpicurl";			//查看原图显示id
var _Thumbnaillist = "";				//全局缩略图列表
var _qlpicTextId = "qlpicText";			// 图片介绍id
var _pictitpageId = "pictitpage";		//页码显示 id
var _picTitleOn = true;					//是否开启图片独立标题
var _picshowtitle = "picshowtitle"; 	//图片标题id
var _picShowTextql = "";				//存放上下翻页函数
var _qlpicPrevtk = "qlpicPrevtk";		//图片上一张 k id
var _qlpicNexttk = "qlpicNexttk"; 		//图片上一张 k id
var _qlpicPrevt = "qlpicPrevt";			//图片上一张 a id
var _qlpicNextt = "qlpicNextt"; 		//图片上一张 a id
var _listwidthm = 575;					//初始缩略图列表长度
var _listwidth = _listwidthm;
var _qlpicList_Prevt = "qlpicList_Prevt"	//列表图片上一张 a id
var _qlpicList_Nextt = "qlpicList_Nextt"	//列表图片一张 a id
var _qlLoadimg = "images/qlloader.gif";  // lodding 图片地址
var picAutoPlay = false ;// 是否自动播放
var picAutoPlayId = "autoplay" ; //自动播放ID 
var mdev = "";
var endplayId = "endcentuj"; //播放结束后
var once=1;
var _theQ = 0;//切换状态标示 向下:next 向上prev
var _defaultHdImgheight = 650;//默认图片高度
function clTuiJian(){
	_endad.off();
}

$(document).ready(function(){
	_Thumbnaillist = document.getElementById(_ThumbnailListId).getElementsByTagName("li"); 
	//初始缩略图 视图长度
	_listwidth = _Thumbnaillist.length*_Thumbnaillist[0].clientWidth;
	_listwidth = ( _listwidth <_listwidthm) ? _listwidthm : _listwidth ;
	//_qlLoadimg = document.getElementById(_photod).getAttribute("src"); //初始 loding 图片地址
	//缩略图列表
	// 添加 缩略图列表 click 事件
	$("#"+_ThumbnailListId+">li>a").bind("click", function(){
		_picshow(this); return false;					   
	});
	$("#"+picAutoPlayId).bind("click", function(){
		_hdpicHshu._pdAutoPlay(); return false;
	});
	
	// 添加 图片上一张 click 事件
	$("#"+_qlpicPrevt).bind("click",function(){
		_hdpicHshu._prev();
		return false;
	});
	// 添加 图片上一张焦点获取 click 事件
	$("#"+_qlpicPrevtk).bind({
		mousemove:function(){
			_hdpicHshu._onPrevt();
		},
		mouseout:function(){
			_hdpicHshu._offPrevt();
			//alert(1);
		},
		click:function(){
			_hdpicHshu._prev();
			return false;
		}
	});
	
	// 添加 图片下一张 click 事件
	$("#"+_qlpicNextt).bind("click",function(){
							_hdpicHshu._next();
							return false;
							});
	
	// 添加 图片下一张焦点获取 click 事件
	$("#"+_qlpicNexttk).bind({
		mousemove:function(){
			_hdpicHshu._onNextt();
		},
		mouseout:function(){
			_hdpicHshu._offNextt();
		},
		click:function(){
			_hdpicHshu._next();
			return false;
		}
	});	
	// 添加 图片下一张焦点获取隐藏 click 事件
						
	// 添加 图片上一张 click 事件
	$("#"+_qlpicList_Prevt).bind("click",function(){
		_hdpicHshu._prev();
		return false;
	});
	// 添加 图片下一张 click 事件
	$("#"+_qlpicList_Nextt).bind("click",function(){
		_hdpicHshu._next();
		return false;
	});
	/*$("#"+qlscroll_in).bind({
		mousedown:function(){
			qlsltScroll._ScrollOn(e);
		},
		mouseup:function(){
			qlsltScroll._ScrollOff(e);
		}
	});
	*/
	
	 //onclick="javascript:_picshow(this);return false;"
	 _picshow(_nowphoto);// 首次运行函数;
});

//切换显示图片
/*
@ 参数 bby 图片 a 链接 或请求的图片当前序号 从零开始.
*/
function _picshow(bby){
	if(isNaN(bby)){
		_endad.off();
		//如果	 bby 传有href 参数则是 this;
	}else if(bby >= 0 && bby <= _Thumbnaillist.length){//如果	 bby 传值是请求图片序号;
		if(document.location.hash){
			var pichash = (document.location.hash).replace(/#/,"");
			//alert(pichash+","+ bby+","+ _Thumbnaillist.length)
			//if(Number(pichash) > 0 && Number(pichash) <= _Thumbnaillist.length){
				if((pichash != bby) && ( pichash !=bby + 2 )){
					bby = pichash - 1;					
				}
			//}
		}
		bby = _Thumbnaillist[bby].getElementsByTagName("a")[0];
	}else{//如果不是序号 也没href 抛出异常
		//alert("请求图片地址错误,请检查");
	}
	var hdurl = bby.getAttribute("href"); 
	// 获取图片大图地址
	if(document.getElementById(_bigpicurlId)){
		document.getElementById(_bigpicurlId).setAttribute("href",hdurl)
	}
	var num = $(bby.parentNode).index(); //当图片的位置
	var _picShowTextql = new _picShowText(num);
	photoCurrent(num);//显示缩略图样式
	_nowphoto = num;
	_hashqiehua(num); // 修改hash值
	//_hdpicHshu._stopPN();	//关闭左右开关
	_picShowTextql.description();		//显示图片描述
	_picShowTextql.pages();				//显示当前页数
	_picShowTextql.pictitle();			//显示标题
	_hdpicHshu._gdthdfn();
	if(document.getElementById(_photod)){
		//document.getElementById(_photod).setAttribute("src",hdurl);
		//document.getElementById(_photod).setAttribute("height","");
		//document.getElementById(_photod).setAttribute("width","");
		imgload(hdurl);
	}
}

function _hashqiehua(hashnum){ //hash 锚链接切换
	document.location.hash = hashnum+1;
}

// 图片loding
function imgload(imgurl){
	var img = new Image();
	//_imagesBox.reHeight(_defaultHdImgheight); //先恢复默认图片高度;
	document.getElementById(_photod).setAttribute("src",_qlLoadimg);
	/*
	img.onload = function(){
		document.getElementById(_photod).setAttribute("src",img.src);
		imagesMax();
	}
	*/
	img.src = imgurl; //("?"+Math.floor(Math.random()*10000));
	img.onload = function(){
		document.getElementById(_photod).src = imgurl ;	
		//_imagesBox.reHeight(img.height);
		imagesMax(imgurl);
	}
	/*ie6 会检测*/
	if(img.readyState=="complete"){ //解决ie运行一次onreadystatechange 便不再运行onreadystatechange
		document.getElementById(_photod).src = imgurl ;
		imagesMax(imgurl);
		//_imagesBox.reHeight(img.height);	
	}else{
		img.onreadystatechange = function(){
			if (img.readyState=="complete"){
				document.getElementById(_photod).src = imgurl ;	
				//_imagesBox.reHeight(img.height);
				imagesMax(imgurl);
			}
		}	
	}
	
	/*
	document.getElementById(_photod).src = imgurl ;
	imagesMax();
	this.clientHeight = document.getElementById(_photod).clientHeight;
	_imagesBox.reHeight(this.clientHeight);
	*/
}

//改变页码与图片介绍 图片标题
function _picShowText(num){
	var qlpicTexthtml = "";
	this.description = function(){
			if(document.getElementById(_qlpicTextId)){//如果有图片介绍区域
				qlpicTexthtml = _Thumbnaillist[num].getElementsByTagName("i")[0].innerHTML; //当前图片介绍
				if(qlpicTexthtml == ""){//如果为空不执行
							
				}else{//不为空则执行
					
				}
				document.getElementById(_qlpicTextId).innerHTML = qlpicTexthtml;
			}
		}
	this.pages = function(){
			if(document.getElementById(_pictitpageId)){
				var pagehtml = "(<b>"+(num+1)+"<\/b>\/"+_Thumbnaillist.length+")";
				document.getElementById(_pictitpageId).innerHTML = pagehtml;
			}else{
				//alert("页数打印错误");
			}
	}
	this.pictitle = function(){
		if(_picTitleOn){//如果开启独立图片标题
			if(document.getElementById(_picshowtitle)){
				var pictitlehtml = _Thumbnaillist[num].getElementsByTagName("a")[0].getAttribute("title");
				document.getElementById(_picshowtitle).innerHTML = pictitlehtml;
			}else{
				//alert("标题打印错误");
			}		
		}
		
	}
	
}

//图片大小根据参数图片地址 自适应屏幕图片大小
function imagesMax(imgurl){
	if(imgurl){
		img = new Image();
		img.src = imgurl;
		_imagesBox.reHeight(img.height); //运行页面填充
	}	
	var maxHeight = document.getElementById(_photod).parentNode.clientHeight;
	var maxWidth = document.getElementById(_photod).parentNode.clientWidth;
	//alert(maxHeight+",父宽度"+maxWidth+",图片高度"+this.clientHeight+",图片宽度"+this.clientWidth);
	//this.clientHeight = document.getElementById(_photod).clientHeight;
	//_imagesBox.reHeight(this.clientHeight);
	if(document.getElementById(_photod).clientHeight > maxHeight){
		//document.getElementById(_photod).setAttribute("height",(maxHeight+"px"));
	}
	if(document.getElementById(_photod).clientWidth > maxWidth){
		//document.getElementById(_photod).setAttribute("width",(maxWidth+"px"));
		//this.clientWidth = document.getElementById(_photod).clientWidth; 
	}
	//alert(maxHeight+",父宽度"+maxWidth+",图片高度"+this.clientHeight+",图片宽度"+this.clientWidth);
 };
 
 //修改所需页面宽度
function imagesBox(){
	this.nph = 43 ;//设置一半的下一页按钮
}
imagesBox.prototype = {
	reHeight:function(h){//设置高度
		if(h <650){h=650;};
		var pxh = h || 0;
		if(!pxh){return ;}
		pxh = pxh + "px";
		$(".qlPicShow").height(pxh); //设置图片盒子大小
		$(".qlPicShow").css("line-height",pxh);//设置盒子行高
		$(".qlpicimage").height(pxh); //设置图片框高度
		$("#qlpicPrevtk").height(pxh); //设置上一页遮挡层高度
		var pt = (Math.ceil( h / 2 ) - this.nph) + "px";
		$(".qlpicPre").css("padding-top",pt); //设置上一页padding 高度
		$("#qlpicNexttk").height(pxh); //设置下一页遮挡层高度
		$(".qlpicNext").css("padding-top", pt); //设置下一页padding 高度
	},
	reWidth:function(w){////设置宽度
		
	}
}

var _imagesBox = new imagesBox();

 
//缩略图ul 长度计算
function qlPicListWidth(){
	if(document.getElementById(_ThumbnailListId)){
		if(_Thumbnaillist.length ==0){
			return ;
		}
		_picshow(_nowphoto);//首次初始 第一张缩略图样式;
		_listwidth = _Thumbnaillist.length*_Thumbnaillist[0].clientWidth;
		_listwidth = (_listwidth<_listwidthm) ? _listwidthm : _listwidth ;
		document.getElementById(_ThumbnailListId).style.width = _listwidth+"px";
	}else{
		alert("没找到id="+_ThumbnailListId+"的div");
	}
}

//定义当前缩略图 样式
function photoCurrent(now){
	for(i=0 ; i<_Thumbnaillist.length; i++ ){
		//var dds = _Thumbnaillist[0];
		if(i == now){//当前所缩略图样式
			_Thumbnaillist[i].getElementsByTagName("a")[0].className= "now";
		}else{
			_Thumbnaillist[i].getElementsByTagName("a")[0].className= "";
		}
		
	}
}


// 图片切换函数  改变全局当前图片序号
function hdpicHshu(){
	//var _Thumbnaillist = _Thumbnaillist;
	//listt = _Thumbnaillist;
	var TotalPagesone = 4; //设置每页图片数量;
	var TotalPages =  Math.ceil((_Thumbnaillist.length/TotalPagesone));  
	/*计算总共分页数;*/
}

hdpicHshu.prototype = {
	_next:function(){// 向下翻图
		_theQ = "next";
		if(once!=2){//正在图片之间时
			if(_nowphoto !== ( _Thumbnaillist.length - 1)){
				if(_nowphoto >( _Thumbnaillist.length - 1) || _nowphoto < 0 ){
					//抛出异常
					//this._stopPN();
					if(_nowphoto >= _Thumbnaillist.length){
						//document.getElementById(endplayId+1).style.display="block";
						/*
						document.getElementById(endplayId).style.display = "block";	
						document.getElementById(endplayId).style.zIndex="9999";
						*/
						_endad.on();//打开广告
						picAutoPlay = false; //设置关闭幻灯播放停止参数
						this._autoPlay();   //运行关闭播放停止
						once++;
					}
					//alert("在往下没有了,你还增加?请求页码是"+ _nowphoto);
				}else{
					_nowphoto++	;
					_picshow(_nowphoto); //执行下一张
				}
			}else if(_nowphoto == (_Thumbnaillist.length - 1)){
				// 最后一页执行;
				//alert(_nowphoto);						
				//alert("最后一张了");
				_endad.on();//打开广告
				_nowphoto++	;
				/*
				picAutoPlay = false;
				this._autoPlay();
				mdev = self.clearInterval(mdev);//停止幻灯播放
				if(document.getElementById(picAutoPlayId)){
				document.getElementById(picAutoPlayId).innerHTML = "幻灯播放";
				}
				*/
			}
		}
	},
	_prev:function(){// 向上翻图
		_theQ = "prev";
		_endad.off(); // 关闭推荐
		if(_nowphoto !== 0){
			if(_nowphoto >_Thumbnaillist.length || _nowphoto < 0){
				//抛出异常
				
				//alert("在往上没有了,你还增加?请求页码是"+ _nowphoto);
				//alert(_Thumbnaillist.length);
				//_endad.off(); // 关闭推荐	
				_nowphoto = _Thumbnaillist.length -1;
			}else{
				_nowphoto--	;
				_picshow(_nowphoto); //执行上一张	
			}
		}else if(_nowphoto == 0){
			// 第一页执行;
			//alert("这是第一张了");
		}
	},	
	_stopPN:function(){//停止翻页
		if(_nowphoto==0){//第一张隐藏上一页按钮
			document.getElementById(_qlpicPrevt).style.display = "none";
		}else{
			document.getElementById(_qlpicPrevt).style.display = "";
		}
		
		if(_nowphoto== _Thumbnaillist.length){//最后一张隐藏下一页按钮
			//document.getElementById(endplayId).setAttribute("style","display:block");
			document.getElementById(_qlpicNextt).style.display = "none";
		}else if(_nowphoto == _Thumbnaillist.length){
			//document.getElementById(endplayId).style.display = "block";
		}else{
			document.getElementById(_qlpicNextt).style.display = "";
		}
	},
	_onPrevt:function(){//上一页激活翻页
		if(_nowphoto==0){//第一张隐藏上一页按钮
			document.getElementById(_qlpicPrevt).style.display = "none";
		}else{
			document.getElementById(_qlpicPrevt).style.display = "block";
		}
	},
	_offPrevt:function(){//上一页隐藏翻页
		document.getElementById(_qlpicPrevt).style.display = "none";
	},
	_onNextt:function(){//下一页激活翻页
		if(_nowphoto == (_Thumbnaillist.length - 1)){//最后一张隐藏下一页按钮
			//document.getElementById(endplayId).style.display = "block";
			//document.getElementById(_qlpicNextt).style.display = "none";
		}else if(_nowphoto >= _Thumbnaillist.length){
			//document.getElementById(endplayId).style.display = "block";
		}else{
			document.getElementById(_qlpicNextt).style.display = "block";
		}
	},
	_offNextt:function(){//下一页隐藏翻页
		document.getElementById(_qlpicNextt).style.display = "none";
	},
	_listNext:function(){
		//							 
	},
	_listPrev:function(){
		//						 
	},
	_gdthdfn:function(){
		var _TpOffsetX = "";
		/*
		if(_nowphoto>0 && _nowphoto <= _Thumbnaillist.length){
			_TpOffsetX = _Thumbnaillist[0].clientWidth*(_nowphoto);	
		}
		*/
		if( _Thumbnaillist.length == 5){
			var temp__len = 6
		}else{
			var temp__len =  _Thumbnaillist.length;	
		}
		if( _nowphoto>0 && _nowphoto < ( temp__len - 1 ) ){//如果当前图片大于0 小于倒数2
			_TpOffsetX = _Thumbnaillist[0].clientWidth*(_nowphoto-1);
			if(_TpOffsetX > _listwidth -(_Thumbnaillist[0].clientWidth*2)){
				//如果长度大于浏览长度
				_TpOffsetX = _listwidth -(_Thumbnaillist[0].clientWidth*2);
			}else if(_TpOffsetX < _Thumbnaillist[0].clientWidth*2){//如果是前两个
				(_theQ == "prev") ?( _TpOffsetX = 1 /*向上翻页时*/ ) : ( _TpOffsetX = 0 /*其他情况*/ ) ;
				//_TpOffsetX = 0;
			}else{
				//alert(1);
				//alert(_TpOffsetX+","+_Thumbnaillist[0].clientWidth+","+_nowphoto);
			}
		}
		if(_TpOffsetX){
			//alert(_TpOffsetX);
			//if(_TpOffsetX === true){_TpOffsetX = 0};
			//qlsltScroll._gdthdfun(_TpOffsetX);//激活滚动
			if( _Thumbnaillist.length == 5){
				qlsltScroll._gdthdfun(_TpOffsetX);//激活滚动
			}else{
				qlsltScroll._gdtpichdfun(_TpOffsetX);//激活滚动
			}
			
		}
		//qlsltScroll._gdtpichdfun(0);
		//setTimeout(qlsltScroll._gdtpichdfun(_TpOffsetX),50);
	},
	_autoPlay:function(){
		if(picAutoPlay == true){
			mdev = self.setInterval(function(){_hdpicHshu._next()},5000);
			if(document.getElementById(picAutoPlayId)){
				document.getElementById(picAutoPlayId).innerHTML = "停止播放";
			}
		}else{
			mdev = self.clearInterval(mdev);
			if(document.getElementById(picAutoPlayId)){
				document.getElementById(picAutoPlayId).innerHTML = "幻灯播放";
			}	
		}
	},
	_pdAutoPlay:function(){
		//alert(picAutoPlay);
		if(picAutoPlay == true ){
			picAutoPlay = false;

		}else{
			picAutoPlay = true;
		}
		//alert(picAutoPlay);
		this._autoPlay();
	}
}

var _hdpicHshu = new hdpicHshu();

function _endAD(){ //结束广告关闭
	if(!document.getElementById(endplayId)) return ; //如果找不到就退出函数
	this.endID = document.getElementById(endplayId);
}
_endAD.prototype = {
	off:function(){
		if(document.getElementById(endplayId)){
			document.getElementById(endplayId).style.display = "none";		
		}
		once = 1 ;
	},
	on:function(){
		if(document.getElementById(endplayId)){
			document.getElementById(endplayId).style.display = "block";		
		}
		once++ ;		
	}	
}
var _endad = new _endAD();

//监控键盘事件
$(document).bind("keydown",function(e){
	e = window.event || e;
	e.keyCode == 37 && _hdpicHshu._prev();
	e.keyCode == 39 && _hdpicHshu._next();
	//e.keyCode == 38 && hdPic.fn._clickleft(data);
	//e.keyCode == 40 && hdPic.fn._clickright(data);
});


//缩略图滚动条函数

var _ScrollId = "qlscroll"; 			//滚动区域 id
var _qlScroll_inId = "qlscroll_in"; 	// 滚动条 id 
var _nowdX = "";  						//当前滚动条位置
var _nowdLeft = ""; 					//当前滚动条 left 值 
var _gdtWidth = ""; 					//滚动条宽度
var _gdtAreaWidth = "";					// 滚动区域宽度

var _Slidingscale = 0;	//对应移动比例
$(document).ready(function(){
	if((_Thumbnaillist.length*_Thumbnaillist[0].clientWidth>document.getElementById(_ScrollId).offsetWidth)){//如果内容区超出区域则激活滚动条
		if(document.getElementById(_qlScroll_inId)){	
			_gdtWidth = document.getElementById(_qlScroll_inId).offsetWidth;				
			//绑定事件
			$("#"+_qlScroll_inId).bind({
				"mousedown":function(e){
					qlsltScroll._ScrollOn(e);											
				},
				"mouseup":function(e){
					qlsltScroll._ScrollOff(e);
				}
			});
		}
		if(document.getElementById(_ScrollId)){
			_gdtAreaWidth = document.getElementById(_ScrollId).offsetWidth;
		}
		_Slidingscale = (document.getElementById(_ScrollId).offsetWidth - document.getElementById(_qlScroll_inId).offsetWidth)/((_Thumbnaillist.length*_Thumbnaillist[0].clientWidth)-document.getElementById(_ScrollId).offsetWidth);
		// 滚动条可滚动区域 除 显示可滚动区域; 
		//取小数点后2位
		_Slidingscale = _Slidingscale.toFixed(2);
		//绑定事件滚动条事件
	}
});

var _sltScroll = function(){//滚动条逻辑

}
_sltScroll.prototype = {
	_ScrollMouseMove: function(e){
		//ScrollOn = true;
		e =  e || event;
		var nowX = e.screenX;
		if(ScrollOn == true){
			var _OffsetX = (nowX - _nowdX);
			//移动像素
			//myForm.screenxd.value = _OffsetX;
			_OffsetX += _nowdLeft;
			if( _OffsetX>=0 && _OffsetX <= (_gdtAreaWidth - _gdtWidth) ){
				//setTimeout(this._gdthdfun(_OffsetX),50)
				this._gdthdfun(_OffsetX)
			}else{
				//this._ScrollOff();
				//return ;
			}
		}
		//在screeny文本框中显示鼠标的Y轴坐标
		//myForm.screenkg.value = ScrollOn;
	},
	_gdthdfun : function(pyw){//滚动条滑动
		//if(_Slidingscale>1){//如果图片超过
			
			var sc_left = pyw - _gdtWidth;
			sc_left < 0 ? (sc_left = 0) : sc_left;
			document.getElementById(_qlScroll_inId).style.left = pyw+"px";
			
			var pic_left = ((-pyw)/_Slidingscale);
			pic_left > -(_Thumbnaillist[0].clientWidth) ? (pic_left = 0) : pic_left;
			document.getElementById(_ThumbnailListId).style.left = pic_left+"px";
		//}
	},
	_gdtpichdfun : function(pyw){//图片滑动
		//if(_Slidingscale>1){
			var sc_left = (pyw*_Slidingscale)-_gdtWidth;
			sc_left < 0 ? (sc_left = 0) : sc_left;
			document.getElementById(_qlScroll_inId).style.left = sc_left+"px";
			
			var pic_left = -(pyw);
			pic_left > -(_Thumbnaillist[0].clientWidth) ? (pic_left = 0) : pic_left;
			document.getElementById(_ThumbnailListId).style.left = pic_left+"px";
		//}
	},
	_ScrollOn : function(e){
		ScrollOn = true;
		e =  e || event;
		_nowdX = e.screenX; //点击时的位置
		_nowdLeft = document.getElementById(_qlScroll_inId).offsetLeft;
		//document.onmousemove = "_ScrollMouseMove()";
		$(document.body).bind({
			mousemove:function(e){
				qlsltScroll._ScrollMouseMove(e);
		 	},
			mouseup:function(e){
				qlsltScroll._ScrollOff(e);	
			}
		});
		/*
		document.onmousemove = function(){
			qlsltScroll._ScrollMouseMove(e);									
		};
		document.onmouseup = function(){
			qlsltScroll._ScrollOff();									
		 };	
		*/	
	},
	_ScrollOff : function (e){
		e =  e || event;
		ScrollOn = false;
		//在screeny文本框中显示鼠标的Y轴坐标
		document.body.onmouseup = function(e){return   false;};
		document.body.onmousemove = function(e){return   false;};
	}
}//end

var qlsltScroll = new _sltScroll();