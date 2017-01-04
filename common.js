//首页菜单栏初始化
(function(){
	//首页左侧下拉菜单
	function treeviewmenuToggle(menu) {
		var animationSpeed = 200;
		$(document).on('click', menu + ' li a', function (e) {
			//Get the clicked link and the next element
			var $this = $(this);
			var checkElement = $this.next();

			//Check if the next element is a menu and is visible
			if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible'))) {
				//Close the menu
				checkElement.slideUp(animationSpeed, function () {
					checkElement.removeClass('menu-open');
					//Fix the layout in case the sidebar stretches over the height of the window
					//_this.layout.fix();
				});
				checkElement.parent("li").removeClass("active");
			}
			//If the menu is not visible
			else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
				//Get the parent menu
				var parent = $this.parents('ul').first();
				//Close all open menus within the parent
				var ul = parent.find('ul:visible').slideUp(animationSpeed);
				//Remove the menu-open class from the parent
				ul.removeClass('menu-open');
				//Get the parent li
				var parent_li = $this.parent("li");

				//Open the target menu and add the menu-open class
				checkElement.slideDown(animationSpeed, function () {
					//Add the class active to the parent li
					checkElement.addClass('menu-open');
					parent.find('li.active').removeClass('active');
					parent_li.addClass('active');
				});
			}
			//if this isn't a link, prevent the page from being redirected
			if (checkElement.is('.treeview-menu')) {
				e.preventDefault();
			}
		});
	}
	treeviewmenuToggle('.sidebar');
	//显示/隐藏菜单
	$(".sidebar-toggle").on('click', function (e) {
		e.preventDefault();
		$("body").toggleClass("sidebar-collapse");
	});

	$('.btn-group[data-toggle="btn-toggle"]').each(function () {
		var group = $(this);
		$(this).find(".btn").on('click', function (e) {
			group.find(".btn.active").removeClass("active");
			$(this).addClass("active");
			e.preventDefault();
		});
	});
})();
//定义$弹框扩展，依赖于layer的PC端弹框组件定制
(function($){
	$.extend({
		//信息框
		alert:function(content,title,yesfunc){
			var index = layer.alert(content, {
				offset:'120px',//可设置'auto'居中
				title: title == "" ? false : [
					title ? title : "提示",
					"background-color:#3c8dbc; color:white;" //标题样式
				],
				btn: ["确定"]
			}, yesfunc);
			return index;
		},
		//询问框
		confirm:function(content,yesfunc,cancelfunc){
			var index = layer.confirm(
				content, {
					offset:'120px',//可设置'auto'居中
					shadeClose:false,
					title: [
						"确认",
						"background-color:#3c8dbc; color:white;" //标题样式
					],
					content:content,
					btn: ["确定","取消"]
				}, yesfunc, cancelfunc);
			return index;
		},
		//提示框,必须参数:content:内容；可选参数:state:(0|1|2|3|4|5|6)，依次是(!|√|×|？|密码锁(权限不够)|哭脸(失败)|笑脸(成功))
		msg:function(content,state,time,endfunc){
			var index = layer.msg(content,
				{
					offset:'120px',//可设置'auto'居中
					icon: state?state:0, //设置默认"!"
					time: time?time:2000 //2秒后关闭（layer默认是3秒）
				}, endfunc );
			return index;
		},
		//tips框,必须参数:content:内容，selector:选择器；可选参数:color:背景颜色，direction:(1|2|3|4),依次(上|右|下|左),方向会智能选择，一般不用设置
		tips:function(content,selector,color,time,direction){
			var index = layer.tips(content,selector,{
				tips:[direction?direction:2,color?color:"#3c8dbc"],
				time: time?time:1000 //2秒后关闭（layer默认是3秒）
			});
			return index;
		},
		//显示PC端loading
		showLoading:function(){
			var index = layer.load(1, { //0-2三种类型
				shade: [0.1,'#fff'] //带透明度的背景
			});
			return index;
		},
		//隐藏loading
		hideLoading:function(index){
			layer.close(index);
		}
	});
})(jQuery);

//扩展JS自带的Date,增加格式化
Date.prototype.format=function(fmt) {
    var o = {           
    "M+" : this.getMonth()+1, //月份           
    "d+" : this.getDate(), //日           
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时           
    "H+" : this.getHours(), //小时           
    "m+" : this.getMinutes(), //分           
    "s+" : this.getSeconds(), //秒           
    "q+" : Math.floor((this.getMonth()+3)/3), //季度           
    "S" : this.getMilliseconds() //毫秒           
    };           
    var week = {           
    "0" : "\u65e5",           
    "1" : "\u4e00",           
    "2" : "\u4e8c",           
    "3" : "\u4e09",           
    "4" : "\u56db",           
    "5" : "\u4e94",           
    "6" : "\u516d"          
    };           
    if(/(y+)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));           
    }           
    if(/(E+)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);           
    }           
    for(var k in o){           
        if(new RegExp("("+ k +")").test(fmt)){           
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));           
        }           
    }           
    return fmt;           
};

//定义common全局通用方法
var common = (function() {
	function isFunction(obj) {
		return typeof obj === 'function'
	}
	function isPlainObject(obj) {
		var key;
		var hasOwn = ({}).hasOwnProperty;
		if (typeof obj !== "object" || obj.nodeType || (obj != null && obj === obj.window)) {
			return false;
		}
		if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype || {}, "isPrototypeOf")) {
			return false;
		}
		for (key in obj) {
		}

		return key === undefined || hasOwn.call(obj, key);
	}
	function isArray(obj) {
		return Array.isArray(obj)
	}
	function extend() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;
		if (typeof target === "boolean") {
			deep = target;
			target = arguments[i] || {};
			i++;
		}
		if (typeof target !== "object" && !isFunction(target)) {
			target = {};
		}
		if (i === length) {
			target = this;
			i--;
		}
		for (; i < length; i++) {
			if (( options = arguments[i] ) != null) {
				for (name in options) {
					src = target[name];
					copy = options[name];
					if (target === copy) {
						continue;
					}
					if (deep && copy && ( isPlainObject(copy) ||
						( copyIsArray = isArray(copy) ) )) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}
						target[name] = extend(deep, clone, copy);
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}
		return target;
	}
	return {
		extend: extend,//extend(deep, clone, copy)(即$.extend,使之不依赖jQuery)第一个参数设为true(默认false)，开启深拷贝
		//api说明：http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation
		getBootstrapTableOption:function(){ //获取初始bootstrapTable配置，option=common.extend(common.getBootstrapTableOption(),option);
			return {
				//method: 'get', //服务器数据的请求方式 'get' or 'post'
				//url: '/qStock/AjaxPage',
				//columns: [], //列
				//data:[],
				//ajaxOptions:{},//提交ajax请求时的附加参数
				//queryParams: function(params){return params}, //传参函数
				//responseHandler:function(res){return res;},//加载服务器数据之前的处理程序，可以用来格式化数据。参数：res为从服务器请求到的数据。
				dataType: "json", //服务器返回数据类型
				contentType:"application/json",//发送到服务器的数据编码类型
				cache:true,//设置为 true 禁用 AJAX 数据缓存
				sidePagination: "server",//设置在哪里进行分页，可选值为 'client' 或者 'server'
				queryParamsType: "limit", //参数格式,发送标准的RESTFul类型的参数请求
				toolbar: "#toolbar", //设置工具栏的Id或者class
				classes:"table table-hover",
				undefinedText:"-",//当数据为 undefined 时显示的字符
				striped: false,  //设置为 true 会有隔行变色效果
				sortable:true,//设置为false 将禁止所有列的排序
				silentSort:true,//设置为 false 将在点击分页按钮时，自动记住排序项。仅在 sidePagination设置为 server时生效.
				sortStable:true,//默认false,设置为 true 将获得稳定的排序
				sortOrder:"asc",//定义排序方式 'asc' 或者 'desc'
				//sortName:"",//定义排序列,通过url方式获取数据填写字段名，否则填写下标
				//iconsPrefix:'glyphicon',//定义字体库 ('lyphicon' or 'fa'
				//icons:"",//自定义图标
				//sortClass:"fff",//td元素被选择时的类名
				//height:"500px",//表格高度,一般自适应不定义
				pagination: true, //在表格底部显示分页工具栏
				paginationLoop:true,//设置为 true 启用分页条无限循环的功能,即最后一页的下一页到第一页
				onlyInfoPagination:false,
				pageSize: 5, //页面数据条数
				pageNumber: 1,//首页页码
				pageList: [5, 10, 20],
				//rowStyle:function(row,index) {return "row";},//自定义行样式 参数为：row: 行数据index: 行下标,返回值可以为class或者css
				//rowAttributes:function(row,index) {return "data-id:123";},//自定义行样式 参数为：row: 行数据index: 行下标,返回值可以为class或者css 支持所有自定义属性
				//detailFormatter:function(index, row) {return '';},//格式化详细页面模式的视图。
				smartDisplay:true,//响应式布局分页组件
				search: false,//是否启用搜索框,这里为本地数据搜索，意义不大,请在传参函数中实现搜索
				searchOnEnterKey:false,//设置为 true时，按回车触发搜索方法，否则自动触发搜索方法
				strictSearch:false,//设置为 true启用 全匹配搜索，否则为模糊搜索
				searchText:"",//初始化搜索文字
				searchTimeOut:500,//设置搜索超时时间
				trimOnSearch:false,//设置为true 将允许空字符搜索
				showHeader:true,//显示列头
				showFooter:false,//显示列脚
				showColumns:true,//是否显示内容列下拉框
				showToggle: true,   //是否显示 切换试图（table/card）按钮
				showRefresh: true,  //显示刷新按钮
				silent: true,  //刷新事件必须设置
				showPaginationSwitch:false,//是否显示 数据条数选择框
				minimumCountColumns:3,//当列数小于此值时，将隐藏内容列下拉框
				idField: "id",  //标识哪个字段为id主键
				cardView: false,//设置为 true将显示card视图，适用于移动设备
				detailView:false,//设置为 true 可以显示详细页面模式
				escape:false,//转义HTML字符串，替换 &, <, >, ", `, 和 ' 字符
				searchAlign:"right",//指定 搜索框 水平方向的位置。'left' or 'right'
				buttonsAlign:"right",//指定 按钮 水平方向的位置。'left' or 'right'
				toolbarAlign:"left",//指定 toolbar 水平方向的位置。'left' or 'right'
				paginationVAlign:"bottom",//指定 分页条 在垂直方向的位置。'top' or 'bottom' or 'bonth'
				paginationHAlign:"right",//指定 分页条 在水平方向的位置。'top' or 'bottom' or 'bonth'
				paginationDetailHAlign:"left",//指定 分页详细信息 在水平方向的位置。'left' or 'right'
				paginationPreText:"上一页", //分页上一页文字或图标
				paginationNextText:"下一页", //分页下一页文字或图标
				//uniqueId:"",//给每行一个标识
				//showExport: true,//显示导出按钮
				//exportDataType: "all",//导出类型,support: 'basic', 'all', 'selected'.
				//exportTypes:['excel','doc','txt','json', 'xml', 'csv',  'sql' ],
				selectItemName:'btSelectItem',//radio or checkbox 的字段名
				clickToSelect:true,//设置true 将在点击行时，自动选择rediobox 和 checkbox
				singleSelect:true, //设置单选
				checkboxHeader:true,//设置false 将在列头隐藏check-all checkbox
				maintainSelected:false//设置为 true 在点击分页按钮或搜索按钮时，将记住checkbox的选择项
			}
		},
		//下载图片,下载完成后进行回调
		loadImage: function (url, callback, data) {
			var img = new Image(); //创建一个Image对象，实现图片的预下载
			img.src = url;
			img.data = data;
			if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
				callback.call(img);
				return; // 直接返回，不用再处理onload事件
			}
			img.onload = function () { //图片下载完毕时异步调用callback函数。
				callback.call(img);//将回调函数的this替换为Image对象
			};
		},
		//多图片压缩，files：图片input上传对象数组，回调函数返回base64编码数组，scale_base:宽、高最小尺寸,k:压缩系数
		//src = src.replace(/^data:image\/(png|jpg|jpeg);base64,/, "")//去掉base64标记后可以用ajax提交到后台，提交后可以直接存byte[] Image
		imgCompress:function(files,callback,scale_base,k){
			scale_base=scale_base?scale_base:1000;//宽、高最小尺寸,默认1000,等比缩放
			k=k?k:0.9;//压缩系数,默认0.9
			var srcs=[];//返回的base64编码数组
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');//获取2d编辑容器
			var img_cache=document.createElement("img");
			//var img_cache = new Image();//创建一个图片

			var tmpFile,i=0;
			var compress=function(){
				if(i>=files.length){
					callback(srcs);
					return;
				}
				var reader = new FileReader();
				tmpFile=files[i];
				reader.readAsDataURL(tmpFile);
				reader.onload = function (e) {
					img_cache.src=e.target.result;
					img_cache.onload = function () {
						var m;
						if (img_cache.width>img_cache.height){
							m = img_cache.width / img_cache.height;
							canvas.height =scale_base;
							canvas.width= scale_base*m ;
						}else{
							m = img_cache.height/img_cache.width ;
							canvas.height =scale_base*m;
							canvas.width= scale_base;
						}
						ctx.drawImage(img_cache, 0, 0,canvas.width,canvas.height);

						srcs.push(canvas.toDataURL("image/jpeg", k));
						i++;
						compress();
					}
				}
			};
			compress();
		},
		//单图片压缩，file：图片input上传对象，回调函数返回base64编码,scale_base:宽、高最小尺寸,k:压缩系数
		imgCompressSingle:function(file,callback,scale_base,k){
			scale_base=scale_base?scale_base:1000;//宽、高最小尺寸,默认1000,等比缩放
			k=k?k:0.9;//压缩系数,默认0.9
			var src='';//返回的base64编码
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');//获取2d编辑容器
			var img_cache=document.createElement("img");
			//var img_cache = new Image();//创建一个图片
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function (e) {
				img_cache.src=e.target.result;
				img_cache.onload = function () {
					var m;
					if (img_cache.width>img_cache.height){
						m = img_cache.width / img_cache.height;
						canvas.height =scale_base;
						canvas.width= scale_base*m ;
					}else{
						m = img_cache.height/img_cache.width ;
						canvas.height =scale_base*m;
						canvas.width= scale_base;
					}
					ctx.drawImage(img_cache, 0, 0,canvas.width,canvas.height);
					src=canvas.toDataURL("image/jpeg", k);
					callback(src);
				}
			};
		},
		//获取当前滚动位置,用于跳转到其他页面后在返回时恢复跳转前的状态
		getPageScroll: function () {
			var x = 0, y = 0;
			if (window.pageYOffset) {    // all except IE
				y = window.pageYOffset;
				x = window.pageXOffset;
			} else if (document.documentElement && document.documentElement.scrollTop) {    // IE 6 Strict
				y = document.documentElement.scrollTop;
				x = document.documentElement.scrollLeft;
			} else if (document.body) {    // all other IE
				y = document.body.scrollTop;
				x = document.body.scrollLeft;
			}
			return {x: x, y: y};
		},
		//通过参数名获取url中的参数值
		getUrlParam: function (name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return "";
		},
		//获取参数名获取cookie中的参数值
		getCookie: function (name) {
			var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
			var r = document.cookie.match(reg);
			if (r != null) return unescape(r[2]);
			return "";
		},
		addJsonObject: function (json, key, value, maxNum) {
			if (!maxNum) maxNum = 999999999;
			json = common.delJsonObject(json, key);
			while (Object.getOwnPropertyNames(json).length >= maxNum) {
				for (var i in json) {
					delete json[i];
					break;
				}
			}
			json[key] = value;
			return json;
		},
		delJsonObject: function (json, key) {
			if (json[key]) {
				delete json[key];
			}
			return json;
		},
		addJsonArray: function (json, obj, maxNum) {
			if (!maxNum) maxNum = 999999999;
			json = common.delJsonArray(json, obj);
			while (json.length >= maxNum) {
				json.shift();
			}
			json.push(obj);
			return json;
		},
		delJsonArray: function (json, obj) {
			for (var i in json) {
				if (JSON.stringify(json[i]) == JSON.stringify(obj)) {
					json.splice(i, 1);
					break;
				}
			}
			return json;
		},
		addLocalStorage: function (key, obj, maxNum) {
			var json = common.getLocalStorage(key);
			json = common.addJsonArray(json, obj, maxNum);
			common.setLocalStorage(key, json);
		},
		addLocalStorageObj: function (key, name, value, maxNum) {
			var json = common.getLocalStorageObj(key);
			json = common.addJsonObject(json, name, value, maxNum);
			common.setLocalStorage(key, json);
		},
		setLocalStorage: function (key, json) {
			if (typeof json != "string") {
				json = JSON.stringify(json);
			}
			localStorage.setItem(key, json);
		},
		getLocalStorage: function (key) {
			var json;
			var value = localStorage.getItem(key);
			if (value) {
				try {
					json = JSON.parse(value);
					if (!(json instanceof Array)) {
						json = new Array();
					}
				} catch (e) {
					json = new Array();
				}
			} else {
				json = new Array();
			}
			return json;
		},
		getLocalStorageObj: function (key) {
			var json;
			var value = localStorage.getItem(key);
			if (value) {
				try {
					json = JSON.parse(value);
					if (json instanceof Array) {
						json = json[0] ? json[0] : new Object();
					}
				} catch (e) {
					json = new Object();
				}
			} else {
				json = new Object();
			}
			return json;
		},
		delLocalStorage: function (key, obj) {
			if (obj) {
				var json = common.getLocalStorage(key);
				json = common.delJsonArray(json, obj);
				common.setLocalStorage(key, json);
			} else {
				localStorage.removeItem(key);
			}
		},
		addSessionStorage: function (key, name, value, maxNum) {
			var json = common.getSessionStorage(key);
			json = common.addJsonObject(json, name, value, maxNum);
			common.setSessionStorage(key, json);
		},
		setSessionStorage: function (key, json) {
			if (typeof json != "string") {
				json = JSON.stringify(json);
			}
			sessionStorage.setItem(key, json);
		},
		getSessionStorage: function (key) {
			var json;
			var value = sessionStorage.getItem(key);
			if (value) {
				try {
					json = JSON.parse(value);
					if (json instanceof Array) {
						json = json[0] ? json[0] : new Object();
					}
				} catch (e) {
					json = new Object();
				}
			} else {
				json = new Object();
			}
			return json;
		},
		delSessionStorage: function (key, name) {
			if (name) {
				var json = common.getSessionStorage(key);
				json = common.delJsonObject(json, name);
				common.setSessionStorage(key, json);
			} else {
				sessionStorage.removeItem(key);
			}
		},
		//转意符换成普通字符
		escape2Html: function (str) {
			var arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'};
			return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
				return arrEntities[t];
			});
		},
		// &nbsp;转成空格
		nbsp2Space: function (str) {
			var arrEntities = {'nbsp': ' '};
			return str.replace(/&(nbsp);/ig, function (all, t) {
				return arrEntities[t];
			});
		}
	}
})();

