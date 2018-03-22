/**
 * Created by Administrator on 2016/7/12.
 */

//全局hash路由控制

mydate = {// jshint ignore:line
  toInt: function (str) {
    return parseInt(str, 10) || 0
  },
  padNumber: function (num, digits, trim) {
    var neg = ""
    if (num < 0) {
      neg = '-'
      num = -num
    }
    num = "" + num
    while (num.length < digits)
      num = "0" + num
    if (trim)
      num = num.substr(num.length - digits)
    return neg + num
  },
  dateGetter: function (name, size, offset, trim) {
    return function (date) {
      var value = date["get" + name]()
      if (offset > 0 || value > -offset)
        value += offset
      if (value === 0 && offset === -12) {
        value = 12
      }
      return mydate.padNumber(value, size, trim)
    }
  },
  dateStrGetter: function (name, shortForm) {
    return function (date, formats) {
      var value = date["get" + name]()
      var get = (shortForm ? ("SHORT" + name) : name).toUpperCase()
      return formats[get][value]
    }
  },
  timeZoneGetter: function (date) {
    var zone = -1 * date.getTimezoneOffset()
    var paddedZone = (zone >= 0) ? "+" : ""
    paddedZone += mydate.padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) + mydate.padNumber(Math.abs(zone % 60), 2)
    return paddedZone
  },
  //取得上午下午
  ampmGetter: function (date, formats) {
    return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1]
  },
  rdateFormat: /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,
  raspnetjson: /^\/Date\((\d+)\)\/$/,
  locate: {
    AMPMS: {
      0: "上午",
      1: "下午"
    },
    DAY: {
      0: "星期日",
      1: "星期一",
      2: "星期二",
      3: "星期三",
      4: "星期四",
      5: "星期五",
      6: "星期六"
    },
    MONTH: {
      0: "1月",
      1: "2月",
      2: "3月",
      3: "4月",
      4: "5月",
      5: "6月",
      6: "7月",
      7: "8月",
      8: "9月",
      9: "10月",
      10: "11月",
      11: "12月"
    },
    SHORTDAY: {
      "0": "周日",
      "1": "周一",
      "2": "周二",
      "3": "周三",
      "4": "周四",
      "5": "周五",
      "6": "周六"
    },
    fullDate: "y年M月d日EEEE",
    longDate: "y年M月d日",
    medium: "yyyy-M-d H:mm:ss",
    mediumDate: "yyyy-M-d",
    mediumTime: "H:mm:ss",
    "short": "yy-M-d ah:mm",
    shortDate: "yy-M-d",
    shortTime: "ah:mm"
  }
}// jshint ignore:line

mydate.DATE_FORMATS = {
  yyyy: mydate.dateGetter("FullYear", 4),
  yy: mydate.dateGetter("FullYear", 2, 0, true),
  y: mydate.dateGetter("FullYear", 1),
  MMMM: mydate.dateStrGetter("Month"),
  MMM: mydate.dateStrGetter("Month", true),
  MM: mydate.dateGetter("Month", 2, 1),
  M: mydate.dateGetter("Month", 1, 1),
  dd: mydate.dateGetter("Date", 2),
  d: mydate.dateGetter("Date", 1),
  HH: mydate.dateGetter("Hours", 2),
  H: mydate.dateGetter("Hours", 1),
  hh: mydate.dateGetter("Hours", 2, -24),
  h: mydate.dateGetter("Hours", 1, -24),
  mm: mydate.dateGetter("Minutes", 2),
  m: mydate.dateGetter("Minutes", 1),
  ss: mydate.dateGetter("Seconds", 2),
  s: mydate.dateGetter("Seconds", 1),
  sss: mydate.dateGetter("Milliseconds", 3),
  EEEE: mydate.dateStrGetter("Day"),
  EEE: mydate.dateStrGetter("Day", true),
  a: mydate.ampmGetter,
  Z: mydate.timeZoneGetter
}

utool = {
  //数据据类型  obj:待判断变量，type:变量类型字符串   eg:type(1,"number") -> true
  type: function (obj, type) {
    obj = Object.prototype.toString.call(obj).match(/^\[.* (.*)\]$/)[1].toLowerCase();
    return type ? obj == type.toLowerCase() : obj;
  },
  myArray: {
    ensure: function (a, b, key) {
      var f = true;
      for (var i = 0; i < a.length; i++) {
        if (a[i][key] == b[key]) {
          f = false;
          break;
        }
      }
      f && (a.push(b));
    },
    remove: function (a, b, key) {
      for (var i = 0; i < a.length; i++) {
        if (a[i][key] == b) {
          a.splice(i, 1);
          break;
        }
      }
    },
    //多维数据值计算
    oneDimension: function (arr) {
      if (arr instanceof Array && arr.length > 1) {
        var _fn = arguments.callee;
        var arr1 = arr.concat();
        arr1[0] = _fn(arr1[0]);
        return arr1.reduce(function (a, b) {
          var _b = _fn(b);
          return a + _b;
        })
      }
      else {
        return +arr || 0;
      }
    },
    //数组去重
    unique: function (arr) {
      var res = [];
      var json = {};
      for (var i = 0; i < arr.length; i++) {
        if (!json[arr[i]]) {
          res.push(arr[i]);
          json[arr[i]] = 1;
        }
      }
      return res;
    }
  },
  myOnlyDate: {
    date: function (date, format) {
      var locate = mydate.locate,
        text = "",
        parts = [],
        fn, match
      format = format || "mediumDate"
      format = locate[format] || format

      if (!date) {
        return text;
      }

      if (date.constructor === String) {
        if (/^\d+$/.test(date)) {
          date = mydate.toInt(date)
        } else if (mydate.raspnetjson.test(date)) {
          date = +RegExp.$1
        } else {
          var trimDate = date.trim()
          var dateArray = [0, 0, 0, 0, 0, 0, 0]
          var oDate = new Date(0)
          //取得年月日
          trimDate = trimDate.replace(/^(\d+)\D(\d+)\D(\d+)/, function (_, a, b, c) {
            var array = c.length === 4 ? [c, a, b] : [a, b, c]
            dateArray[0] = mydate.toInt(array[0])     //年
            dateArray[1] = mydate.toInt(array[1]) - 1 //月
            dateArray[2] = mydate.toInt(array[2])     //日
            return ""
          })
          var dateSetter = oDate.setFullYear
          var timeSetter = oDate.setHours
          trimDate = trimDate.replace(/[T\s](\d+):(\d+):?(\d+)?\.?(\d)?/, function (_, a, b, c, d) {
            dateArray[3] = mydate.toInt(a) //小时
            dateArray[4] = mydate.toInt(b) //分钟
            dateArray[5] = mydate.toInt(c) //秒
            if (d) {                //毫秒
              dateArray[6] = Math.round(parseFloat("0." + d) * 1000)
            }
            return ""
          })
          var tzHour = 0
          var tzMin = 0
          trimDate = trimDate.replace(/Z|([+-])(\d\d):?(\d\d)/, function (z, symbol, c, d) {
            dateSetter = oDate.setUTCFullYear
            timeSetter = oDate.setUTCHours
            if (symbol) {
              tzHour = mydate.toInt(symbol + c)
              tzMin = mydate.toInt(symbol + d)
            }
            return ""
          })

          dateArray[3] -= tzHour
          dateArray[4] -= tzMin
          dateSetter.apply(oDate, dateArray.slice(0, 3))
          timeSetter.apply(oDate, dateArray.slice(3))
          date = oDate
        }
      }
      if (date.constructor === Number) {
        date = new Date(date)
      }
      if (date.constructor !== Date) {
        return
      }
      while (format) {
        match = mydate.rdateFormat.exec(format)
        if (match) {
          parts = parts.concat(match.slice(1))
          format = parts.pop()
        } else {
          parts.push(format)
          format = null
        }
      }
      parts.forEach(function (value) {
        fn = mydate.DATE_FORMATS[value]
        text += fn ? fn(date, locate) : value.replace(/(^'|'$)/g, "").replace(/''/g, "'")
      })
      return text
    },
    SecondToDate:function (msd) {
      var time =msd
      if (null != time && "" != time) {
        if (time > 60 && time < 60 * 60) {
          time = parseInt(time / 60.0) + "分钟" + parseInt((parseFloat(time / 60.0) -
            parseInt(time / 60.0)) * 60) + "秒";
        }
        else if (time >= 60 * 60 && time < 60 * 60 * 24) {
          time = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -
            parseInt(time / 3600.0)) * 60) + "分钟" +
            parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
              parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
        } else if (time >= 60 * 60 * 24) {
          time = parseInt(time / 3600.0/24) + "天" +parseInt((parseFloat(time / 3600.0/24)-
            parseInt(time / 3600.0/24))*24) + "小时" + parseInt((parseFloat(time / 3600.0) -
            parseInt(time / 3600.0)) * 60) + "分钟" +
            parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
              parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
        }
        else {
          time = parseInt(time) + "秒";
        }
      }
      return time;
    }
  },
  myUrl: {
    //
    parseUrl: function (url) {
      url = url || window.location.href;
      var idx = url.indexOf('?');
      if (idx == -1) {
        return {};
      }
      var obj = {};
      url = url.substring(idx + 1);
      var arr = url.split('&');
      arr.forEach(function (el) {
        var _obj = el.split('=');
        obj[_obj[0]] = decodeURI(_obj[1]) || '';
      })
      return obj;
    },
    parseObject: function (url, obj) {
      if (typeof url === 'object') {
        obj = url;
        url = '';
      }
      var arr = [], str = [];
      for (var key in obj) {
        str[0] = key;
        str[1] = obj[key];

        arr.push(str.join('='));
      }

      if (url.indexOf('?') === -1) {
        return url + '?' + arr.join('&');
      } else {
        return url + arr.join('&');
      }
    }
  },
  searchUrl: {
    getSearch: function (name) {
      var reg = new RegExp('(?:^|&)' + name + '=([^&]*)(?:&|$)', 'i');
      return ((top.location.href.split('?')[1] || '').match(reg) || [])[1] || ''
    }
  },
  search: {
    getSearch: function (name) {
      var reg = new RegExp('(?:^|&)' + name + '=([^&]*)(?:&|$)', 'i');
      return ((location.href.split('?')[1] || '').match(reg) || [])[1] || ''
    }
  },
  myNumber: {
    //字符串转换为钱值   e:需要转换的字符串，t:保留小数位数，n:小数点标识,r：千位符标识
    toMoney: function (e, t, n, r) {
      e = (e + "").replace(/[^0-9+\-Ee.]/g, "");
      var a = isFinite(+e) ? +e : 0,
        i = isFinite(+t) ? Math.abs(t) : 3,
        o = r || ",",
        l = n || ".",
        s = "",
        c = function (e, t) {
          var n = Math.pow(10, t);
          return "" + (Math.round(e * n) / n).toFixed(t)
        };
      return s = (i ? c(a, i) : "" + Math.round(a)).split("."), s[0].length > 3 && (s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, o)), (s[1] || "").length < i && (s[1] = s[1] || "", s[1] += new Array(i - s[1].length + 1).join("0")), s.join(l)
    }
  },
  ajax: {
    ajaxRequest: function (method, url, data, datatype) {

      var content = 'application/x-www-form-urlencoded ';

      var tokenUrl = utool.searchUrl.getSearch("token");

      var isTokenUrl = "";

      //判断token存不存在，存在的话就塞token，不存在就为空
      if (tokenUrl) {
        if (method == "GET") {
          if (url.indexOf("?") == -1) {
            isTokenUrl = "?token=" + tokenUrl;
          } else {
            isTokenUrl = "&token=" + tokenUrl;
          }
        } else if (method == 'POST') {
          isTokenUrl = "?token=" + tokenUrl;
        }
      }

      if (datatype == 'json') {
        content = 'application/json; charset=UTF-8';
        if (data !== '') {
          data = JSON.stringify(data);
        }
      }

      parent.$.dialog.load()

      var returnDataFn = $.ajax({
        type: method,
        url: url + isTokenUrl,
        contentType: content,
        data: data || '',
        datatype: datatype,
        async: true
      });

      returnDataFn.done(function (data) {
        parent.$.dialog.closeAll();
        if (data.success == 401) {
          layer.msg(data.result, {
            icon: 1,
            time: 2000
          }, function () {
            top.location.href = "/index.html";
          });
        }
      })
      return returnDataFn
    }
  },
  image: {
    getImgSize: function (content, img) {
      var conW = +content.width,
        conH = +content.height,
        imgW = +img.width,
        imgH = +img.height;
      if (conW / cowH > imgW / imgH) {
        return {width: '100%'}
      } else {
        return {height: '100%'}
      }
    }
  },
  days: {
    getBrforeDay: function (n) {
      var d = new Date();
      var year = d.getFullYear();
      var mon = d.getMonth() + 1;
      var day = d.getDate();
      if (day <= n) {
        if (mon > 1) {
          mon = mon - 1;
        }
        else {
          year = year - 1;
          mon = 12;
        }
      }
      d.setDate(d.getDate() - n);
      year = d.getFullYear();
      mon = d.getMonth() + 1;
      day = d.getDate();
      s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
      return s;
    }
  },
  isEmpty: {
    isEmptyObject: function (e) {
      var t;
      for (t in e)
        return !1;
      return !0
    }
  },
  fileExtension: function (str) {
    if (str) {
      str = str.toLowerCase();
      return /.[^.]+$/.exec(str);
    }
    return "";
  },
  directionIsData: function (json) {
    for (var key in json) {
      if (Object.prototype.toString.call(json[key]) === '[object Array]') {
        return true
      }
    }
  },
  isHistory: {
    _updateHash: function (location, fragment, replace) {
      var me = window,
        hash = '#' + fragment;
      if (replace) {
        //由于chrome下location.replace替换当前页后 进行返回操作会刷新页面
        //ff无辜受到牵连  同罚之
        //所以我们这里采用replaceState的方式更新hash
        if ((typeof me.history.replaceState === 'function') && !me.iframe) {
          me.history.replaceState(me.history.state, '', hash);
        } else {
          //先移除location中的锚点信息
          var href = location.href.replace(/(javascript:|#).*$/, '');
          //替换当前页 这么做不会产生浏览历史
          location.replace(href + hash);
        }
      } else {
        location.hash = hash;
      }
    }
  },
  isInData: {
    inData: function (json, str) {
      if (json) {
        if (json["remindKey"] != str) {
          json["remindKey"] = str;
        }
      }
    }
  },
  setCookie:function (key,val,time){
    var date=new Date(); //获取当前时间
    var expiresDays=time;  //将date设置为n天以后的时间
    date.setTime(date.getTime()+expiresDays*24*3600*1000); //格式化为cookie识别的时间
    document.cookie=key + "=" + val +";expires="+date.toGMTString();  //设置cookie
  },
  getCookie:function (key){
    var getCookie = document.cookie.replace(/[ ]/g,"");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
    var arrCookie = getCookie.split(";")  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
    var tips;  //声明变量tips
    for(var i=0;i<arrCookie.length;i++){   //使用for循环查找cookie中的tips变量
       var arr=arrCookie[i].split("=");   //将单条cookie用"等号"为标识，将单条cookie保存为arr数组
         if(key==arr[0]){  //匹配变量名称，其中arr[0]是指的cookie名称，如果该条变量为tips则执行判断语句中的赋值操作
             tips=arr[1];   //将cookie的值赋给变量tips
            break;   //终止for循环遍历
         }
     }
    return tips;
  }

};

