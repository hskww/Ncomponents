/**
 * @fileOverview 各种基础函数
 */

define(['underscore'], function(_) {
	//使用严格模式
	"use strict"
	//定义Q对象，定义二级对象
	var Ncore = {
		version : '0.0.1',
		time_stamp : +new Date(),
		noop : function() {
		},
		system : {}, ///一些浏览器通用内容
		number : {}, //数字计算相关
		date : {}, //日期时间相关
		string : {}, //字符串相关
		cookie : {} //cookie相关
	};
	/**************************************************************************************************************
	 *@ignore Ncore.system
	 ***************************************************************************************************************/
	/**
	 * @property is_mobile
	 * @description 检测系统是否手机，简单，不严谨
	 */
	Ncore.system.is_mobile = ( function() {
			var UA = window.navigator.userAgent;
			var len = UA.length;
			var l = UA.replace(/iphone|ipad mini|ipad|ipod|android|Series60|BlackBerry|Windows Phone/gi, '').length;
			return l !== len;
		}());
	/**************************************************************************************************************
	 * @ignore Ncore.number
	 ***************************************************************************************************************/

	/**
	 * @description 格式化数字,小数位不足补0
	 * @param {Number} num 被格式化的数字
	 * @param {Number} [decimal=2]  小数位数
	 * @param {Number} [round=0] 如何舍入 可选值为以下几种：<br>1：只入不舍，<br>0：四舍五入，<br>-1：只舍不入 ,<br>465：四舍六入五留双
	 * @return {String} 字符串格式的数字 如：123.45
	 * @example Ncore.number.format(123.456,2,1) <br> => 123.45
	 * @method
	 */
	Ncore.number.format = function(num, decimal, round) {
		var pow;
		decimal = typeof (decimal * 1) !== 'number' || isNaN(decimal * 1) ? 2 : Math.abs(decimal);
		pow = Math.pow(10, decimal);
		num *= 1;
		//f_num处理浮点数问题，能保证保留10位小数以内计算得到正常结果
		var f_num = 0.000000000099999;
		switch (round) {
		case 1:
			num = Math.ceil(num * pow) / pow;
			break;
		case -1:
			num = Math.floor(num * pow + f_num) / pow;
			break;
		case 465:
			//四舍六入五成双,如保留两位小数，第三位小数如果是5，则看第二位是奇偶，如果是奇，则进位，否则舍去
			var is_jo = Math.floor(num * pow + f_num) % 10 % 2;
			//要进位上数字是否是5
			var is_five = Math.floor(num * pow * 10 + f_num) % 10 == 5;
			var step = is_five && !is_jo ? 1 / pow : 0;
			num = Ncore.number.format(num, decimal) - step;
			break;
		default:
			num = (num * pow + f_num) / pow;
		}
		return (num.toFixed(decimal) + '').replace(/^\./g, '0.').replace(/\.$/, '');
	};
	/**
	 * @description 把数字格式化成货币型
	 * @param {Number} num 被格式化的数字
	 * @param {Number} [decimal=2] 小数位  默认两位
	 * @param {Number} [round=0]  如何舍入 可选值为以下几种：<br>1：只入不舍，0：四舍五入，-1：只舍不入
	 * @return {String} 货币格式的字符串型的数字  如：1,234,567.46
	 * @example Ncore.number.currency(1234567.456,2,0)=>1,234,567.46
	 *  @method
	 */
	Ncore.number.currency = function(num, decimal, round) {
		var arr;
		if ( typeof decimal !== 'undefined') {
			num = Ncore.number.format(num, decimal, round);
		}
		arr = (num + '').split('.');
		arr[0] = arr[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
		return (arr[0] + (arr.length == 2 ? '.' + arr[1] : '')).replace(/^\./g, '0.');
	};
	/**
	 * @description 格式成百分比，根据参数来格式化一个数的百分比或是千分比等
	 * @param {Number} num 被格式化的数字【必选】
	 * @param {Number} [percent=100] 比率，如100则是百分比，1000则是千分比，默认百分比
	 * @param {Number} [decimal=2] 小数位，默认两位
	 * @param {Number} [round=0] 如何舍入可选值为:1 只入不舍，0 四舍五入，-1 只舍不入
	 * @return {String} 百分比,不带% 如：65
	 * @example Ncore.number.format(1/3,100,2,0) <br> => 33
	 * @method
	 */
	Ncore.number.percent = function(num, percent, decimal, round) {
		return Ncore.number.format(num * 1 * (percent || 100), decimal, round);
	};
	/**
	 * @description 求组合数，从m个项中选出n个项的无序排列数
	 * @param {Number} m 总项数【必选】
	 * @param {Number} n 选出的项数【必选】
	 * @return {Number} 组合数
	 * @example Ncore.number.combo(4,2) <br> => 6
	 * @method
	 */
	Ncore.number.combo = function(m, n) {
		var v1,
		    v2;
		//combo(11,9)<br> =>combo(11,2)
		if (m / 2 < n) {
			n = m - n;
		}
		//处理m,n为负数
		if (m < n || n < 0) {
			return 0;
		}
		//处理combo(3,0)==1
		if (m >= 0 && n === 0) {
			return 1;
		}
		v1 = 1;
		v2 = m;
		for (var i = 1; i <= n; i++) {
			v1 *= i;
			if (i < n) {
				v2 *= (m - i);
			}
		}
		return v2 / v1;
	};
	/**
	 * @description 遍历所有组合项，从数组arr中选出numa项，采用递归，数据量太大时有性能问题
	 * @param {Array} arr 所有项【必选】
	 * @param {Number} num 选出的项数【必选】
	 * @return {Array} 所有组合项的数组
	 * @example Ncore.number.each_combo([1,2,3],2) <br>  <br> => ['12','13','23']
	 * @method
	 */
	Ncore.number.each_combo = function(arr, num) {
		var r = [];
		(function f(t, a, n) {
			if (n === 0) {
				return r.push(t);
			}
			for (var i = 0,
			    l = a.length; i <= l - n; i++) {
				f(t.concat(a[i]), a.slice(i + 1), n - 1);
			}
		})([], arr, num);
		return r;
	};
	/**
	 * @description 给定个二维数组，遍历所有组合项
	 * @param {Array} arr 二维数组  如：[[1,2,3],[4,5,6]]【必选】
	 * @return {Array} 所有组合项的数组
	 * @example Ncore.number.each_array_combo([[1,2,3],[4,5,6]]) <br>  <br> =>[[1,4],[1,5,[1,6],[2,4],[2,5],[2,6],[3,4],[3,5],[3,6]]
	 * @method
	 */
	Ncore.number.each_array_combo = function(arr) {
		var idx = 0;
		var len = arr.length;
		var result = [];
		var tmp;
		var tmpArr = [];
		tmpArr.push(arr);
		(function each(arr) {
			var tmpArr = [];
			for (var i = 0,
			    l = arr.length; i < l; i++) {
				for (var j = 0,
				    jl = arr[i][idx].length; j < jl; j++) {
					tmp = [].concat(arr[i]);
					tmp.splice(idx, 1, arr[i][idx][j]);
					tmpArr.push(tmp);
				}
			}
			idx++;
			if (idx < len) {
				each(tmpArr);
			} else {
				result = tmpArr;
				return;
			}
		})(tmpArr);
		return result;
	};
	/**
	 * @description 求排列数 ，从m个项中选出n个项的有序排列数
	 * @param {Bumber} m 总项数【必选】
	 * @param {Number} n 选出的项数【必选】
	 * @return {Number} 排列数
	 * @example Ncore.number.permutation(4,2) <br> => 12
	 * @method
	 */
	Ncore.number.permutation = function(m, n) {
		var v = 1;
		if (m < n || n < 0) {
			return 0;
		}
		for (var i = 0; i < n; i++) {
			v *= (m - i);
		}
		return v;
	};
	/**
	 * @description 遍历所有排列项，从数组arr中选出numa项，采用递归，数据量太大时有性能问题
	 * @param {Array} arr 所有项【必选】
	 * @param {Number} num 选出的项数【必选】
	 * @return {Array} 所有排列项数组
	 * @example Ncore.number.each_permutation([1,2,3],2) <br> => ['12','13','21','23','31','32']
	 * @method
	 */
	Ncore.number.each_permutation = function(arr, num) {
		var r = [];
		(function f(t, a, n) {
			if (n === 0) {
				return r.push(t);
			}
			for (var i = 0,
			    l = a.length; i < l; i++) {
				f(t.concat(a[i]), a.slice(0, i).concat(a.slice(i + 1)), n - 1);
			}
		})([], arr, num);
		return r;
	};
	/**
	 * @description 从自然数n-m的范围随机选出k组z个数，主要用于彩票中的随机选号
	 * @param {Object} options 对象参数
	 * @param {Number} options.min 范围最小值
	 * @param {Number} options.max 范围最大值
	 * @param {Number} options.size 随机的个数
	 * @param {Array} [options.share] 胆码，如果指定，随机每一组里都包含该数组内的元素【可选】
	 * @param {Array} [options.shahao] 杀号，如果指定，随机每一组里都不会包含该数组内的元素【可选】
	 * @param {Number} [options.count=1] 随机的组数，一组是options.size个默认为一组【可选】
	 * @param {Boolean} [options.repeat=false] 是否可以重复 默认不重复【可选】
	 * @param {Boolean} [options.sort=false] 是否排序 默认不排序【可选】
	 * @param {Boolean} [options.repeat_team=true] 如果是一组时，组内是否可以重复，默认可以【可选】
	 * @return {Array} 如：[[1,3,4],[3,4,6]]
	 * @example  Ncore.number.random({min:0,max:9,size:3,count:2}) <br> => [[1,3,4],[3,4,6]]
	 * @method
	 */
	Ncore.number.random = function(options_p) {
		var options = {
			min : 0,
			max : 9,
			share : [],
			shahao : [],
			size : 1
		};
		$.extend(options, options_p);
		options.count = options.count || 1;
		var one_random = function(options) {
			var ar,
			    tmp,
			    k = 0,
			    ml,
			    l;
			var pre_str = '0000000000000000';
			ml = (options.max + '').length;
			ar = (options.share || []).toString();
			ar = ar === '' ? [] : ar.split(/[,\-_=+\|]/);
			l = ar.length;
			if (l > 0 && options.max > 9) {//有胆且为两位数以上，前面补零
				for (var i = 0; i < l; i++) {
					if (ar[i].length < ml) {
						ar[i] = pre_str.substr(0, ml - ar[i].length) + ar[i];
					}
				}
			}
			while (k < options.size) {
				tmp = (Math.floor(Math.random() * (options.max - options.min + 1)) + options.min) + '';
				tmp = pre_str.substr(0, ml - tmp.length) + tmp;
				if (options.repeat || (!options.repeat) && $.inArray(tmp, ar) == -1 && $.inArray(tmp, options.shahao || []) == -1) {
					ar.push(tmp);
					k++;
				}
			}
			if (!!options.sort) {
				ar.sort();
			}
			return typeof options.split_str !== 'undefined' ? ar.join(options.split_str) : ar;
		};
		var result = [];
		var count = Ncore.number.combo(options.max - options.min + 1 - options.share.length - options.shahao.length, options.size);
		if (count < options.count) {
			options.repeat_team = 1;
		}
		for (var i = 0; i < options.count; i++) {
			var re_tmp = one_random(options);
			if (!options.repeat_team) {
				var re_len = result.length;
				var flag = 0;
				for (var j = 0; j < re_len; j++) {
					if (result[j].toString() == re_tmp.toString()) {
						flag = 1;
						break;
					}
				}
				if (flag) {
					i--;
				} else {
					result.push(re_tmp);
				}
			} else {
				result.push(re_tmp);
			}
		}
		return result;
	};
	/**
	 * @description 检测用户按下是否是方向健
	 * @param {Array} e 事件对象
	 * @return  {Boolean} true/false
	 * @method
	 */

	Ncore.number.pass_key = function(e) {
		return $.inArray(e.keyCode, [8, 16, 17, 37, 38, 39, 40, 46, 67]) >= 0;
	};
	/**
	 * @description 检测号码是否为连号
	 * @param  {Array} arr 待检测的数组
	 * @param  {Number} [step=1] 步长
	 * @return {Boolean} true/false
	 * @example Ncore.number.is_seq([1,2,3]) <br> => true <br>
	 * Ncore.number.is_seq([1,3,5],2) <br> => true
	 * @method
	 */
	Ncore.number.is_seq = function(arr, step) {
		var arr_tmp = [].concat(arr);
		step = step || 1;
		//去重
		arr_tmp = _.unique(arr_tmp);
		var len = arr.length;
		var len_new = arr_tmp.length;
		var result = false;
		if (len == len_new) {
			arr_tmp.sort(function(a, b) {
				return a - b
			});
			result = (arr_tmp[len - 1] - arr_tmp[0]) / step + 1 == len;
		}
		return result;
	}
	/**************************************************************************************************************
	 *Ncore.date
	 ***************************************************************************************************************/
	/**
	 * @description 把日期对象格式化字符串格式
	 * @param {Date/Number} date 时期对象或由Date.getTime()得到的时间数【必选】
	 * @param {String} [format_style=YYYY-MM-DD hh:mm:ss] 格式化样式
	 * 可自定义。YYYY四位年份，YY两位年分，MM月份，DD天，hh小时，mm分种，ss秒
	 * @return {String} 格式化后的字符串
	 * @example Ncore.date.format(new Date()) <br> => 2015-03-16 12:33:30
	 * @method
	 */
	Ncore.date.format = function(date, format_style) {
		date = typeof date == 'object' ? date : new Date(date * 1);
		format_style = format_style || 'YYYY-MM-DD hh:mm:ss';
		var YYYY = date.getFullYear();
		var MM = date.getMonth() + 1;
		var DD = date.getDate();
		var hh = date.getHours();
		var mm = date.getMinutes();
		var ss = date.getSeconds();
		var YY = (YYYY + '').replace(/^\d\d/g, '');
		MM = MM < 10 ? '0' + MM : MM;
		DD = DD < 10 ? '0' + DD : DD;
		hh = hh < 10 ? '0' + hh : hh;
		mm = mm < 10 ? '0' + mm : mm;
		ss = ss < 10 ? '0' + ss : ss;
		return Ncore.string.mul_replace(format_style, [[/YYYY/, YYYY], [/YY/, YY], [/MM/, MM], [/DD/, DD], [/hh/, hh], [/mm/, mm], [/ss/, ss]]);
	};
	/**
	 * @description 把日期字符串转成日期对象
	 * @param {String} dateStr 时期字符串，如：20110612， 像2011-6-12 12:15:20会直接调用系统函数处理【必选】
	 * @return {Date} 转化后时间对象
	 * @example Ncore.date.to_date('20110909')
	 * @method
	 */
	Ncore.date.to_date = function(dateStr) {
		dateStr = $.trim(dateStr);
		var str = dateStr;
		var reg = /.*(\d{4})(\d\d)(\d\d).*/;
		//如果是纯数字组合，并且有连续的8位数字
		if ($.isNumeric(dateStr) && reg.test(dateStr)) {
			str = dateStr.replace(reg, '$1-$2-$3');
		}
		return new Date(str);
	};

	/**
	 * @description 获取日期在星期中的周几
	 * @param {String} dateStr 时期字符串，只支持8位纯数字日期或国内日期格式，如2011-06-12 2011/06/12【必选】
	 * @param {Number} [flag=0] 标记返回的数据类型 ，为0：返回文本周几，为1：返回周几的下标：为2：返回文本和下标['周二',2]
	 * @return {String} 返回日期所在的周几
	 * @example Ncore.date.get_week("20150316") <br> => 周一
	 * @method
	 */
	Ncore.date.get_week = function(dateStr, flag) {
		var date = Ncore.date.to_date(dateStr);
		flag = flag || 0;
		var wi = date.getDay();
		var weeks = '周' + ["日", "一", "二", "三", "四", "五", "六"][wi];
		var result = flag == 0 ? weeks : flag == 1 ? wi : [weeks, wi];
		return result;
	};
	/**************************************************************************************************************
	 *Ncore.string
	 ***************************************************************************************************************/
	/**
	 * @description 计算字符串长度，中文字符算两个
	 * @param {String} str 字符串【必选】
	 * @return {Number} 字符串的长度
	 * @example Ncore.string.len('adf2asd中国') <br> => 9
	 * @method
	 */
	Ncore.string.len = function(str) {
		return str.replace(/[^\x00-\xff]/g, "--").length;
	};
	/**
	 * @description 从字符串截取指定的长度，中文字符算两个,如果取到中文之符一半，则舍掉这个中文
	 * @param {String} str 被截取的字符串【必选】
	 * @param {Number} len 要截取的长度【必选】
	 * @param {String} [ext] 超过指定长度后的后缀，默认为空【可选】
	 * @return {String} 截取后的字符串
	 * @example Ncore.string.cut('adf2asd中国',5,'') <br> => adf2a
	 */
	Ncore.string.cut = function(str, len, ext) {
		ext = ext || '';
		if (Ncore.string.len(str) <= len - ext.length) {
			return str;
		}
		len -= ext.length;
		//双字节字符替换成两个//去掉临界双字节字符//还原
		return str.substr(0, len).replace(/([^\x00-\xff])/g, "$1 ").substr(0, len).replace(/[^\x00-\xff]$/, "").replace(/([^\x00-\xff]) /g, "$1") + ext;
	};
	/**
	 * @description 取得URL中指定参数的值，简易版，复杂情况下没做考虑,如，多个同名参数，参数又是一个URL等
	 * @param {String} name 参数名字符串,如果带#则取hash中的值【必选】
	 * @param {String} [url] URL【可选】 默认为当前页面的URL
	 * @return {String} 指定参数的值
	 * @example Ncore.string.get_url_param('par','http://mm.cn?par=test') <br> => test
	 * @method
	 */
	Ncore.string.get_url_param = function(name, url) {
		var m,
		    reg,
		    tmp;
		url = (url || window.location.href).toLowerCase().split('#');
		if (name.indexOf('#') != -1) {
			tmp = url.length < 2 ? '' : url[1];
		} else {
			tmp = url[0];
		}
		m = tmp.match(new RegExp('(|[?&#])' + name.replace('#', '') + '=([^#&?]*)(\\s||$)', 'gi'));
		if (m) {
			return decodeURIComponent(m[0].split('=')[1]);
		} else {
			return '';
		}
	};
	/**
	 * @description 批量替换
	 * @param {String} str 被替换的字符串 【必选】
	 * @param {Array} arr 替换规则 【必选】
	 * @return {String} 替换后的字符串
	 * @example Ncore.string.mul_replace('test',[['t','h'],['st','llo']]) <br> => hello;
	 * @method
	 */
	Ncore.string.mul_replace = function(str, arr) {
		for (var i = 0,
		    l = arr.length; i < l; i++) {
			str = str.replace(arr[i][0], arr[i][1]);
		}
		return str;
	};
	/**
	 * @description 把全角数字,空格，句号转换成半角
	 * @param {String} str 被转换的字符串 【必选】
	 * @return {Stirng} 替换后的字符串
	 * @example Ncore.string.dbc_to_sbc('３') <br> => 3
	 * @method
	 */
	Ncore.string.dbc_to_sbc = function(str) {
		return Ncore.string.mul_replace(str, [[/[\uff01-\uff5e]/g,
		function(a) {
			return String.fromCharCode(a.charCodeAt(0) - 65248);
		}], [/\u3000/g, ' '], [/\u3002/g, '.']]);
	};
	/**************************************************************************************************************
	 *Ncore.cookie
	 ***************************************************************************************************************/
	/**
	 * @description 得到指定的cookie值
	 * @param {String} name cookie名称【必选】
	 * @param {Boolean} [encode] 是否encodeURIComponent 默认false【可选】
	 * @return 指定cookie的值
	 * @example Ncore.cookie.get('name')
	 * @method
	 */
	Ncore.cookie.get = function(name, encode) {
		var m = document.cookie.match(new RegExp("(^| )" + name + "=([^;])*", "gi")),
		    v = !m ? '' : m[0].split(name + '=')[1];
		return (!!encode ? v : decodeURIComponent(v));
	};
	/**
	 * @description set设置cookie, del删除cookie,当expires小于0时即为删除cookie
	 * @param {Object} options 【必选】
	 * @param {String} options.name cookie的名称【必选】
	 * @param {String} options.value cookie的值【必选】
	 * @param {Number} [options.expires] cookie的过期时间，为整数，单位为天，为负时删除cookie【可选】
	 * @param {String} [options.domain]  指定cookie所属的域【可选】
	 * @param {String} [options.path]  指定cookie 的路径【可选】
	 * @param {Boolean} [options.secure]  是否安全传输 当协议为https时才可用【可选】
	 * @param {Boolean} [options.encode]  是否对值进行encodeURIComponent【可选】
	 * @example Ncore.cookie.set({name:'test',value:'ok'});
	 * @method
	 */
	Ncore.cookie.set = Ncore.cookie.del = function(options) {
		var ck = [];
		ck.push(options.name + '=');
		if (options.value) {
			ck.push(!!options.encode ? options.value : encodeURIComponent(options.value));
			//是否encodeURIComponent
		}
		if (options.expires) {
			var d = new Date();
			d.setHours(0);
			d.setMinutes(0);
			d.setSeconds(0);
			d.setTime(d.getTime() + options.expires * 86400000);
			//24 * 60 * 60 * 1000
			ck.push(';expires=' + d.toGMTString());
		}
		if (options.domain) {
			ck.push(';domain=' + options.domain);
		}
		ck.push(';path=' + (options.path || '/'));
		if (options.secure) {
			ck.push(';secure');
		}
		document.cookie = ck.join('');
	};
	//**************************************************************************************************************
	return Ncore;
});
