//双击关闭app
function keyListen() {
    api.addEventListener({
        name: 'keyback'
    }, function(ret, err) {
        //双击退出
        api.toast({
            msg: '再按一次退出应用',
            duration: 2000,
            location: 'bottom'
        });
        api.addEventListener({
            name: 'keyback'
        }, function(ret, err) {
            if (ret) {
                exitApp();
            }
        });
        setTimeout(function() {
            keyListen();
        }, 3000);
    });
}
//关闭app
function exitApp() {
    api.closeWidget({
        id: api.appId,
        retData: {
            name: 'closeWidget'
        },
        animation: {
            type: 'flip',
            subType: 'from_bottom',
            duration: 500
        },
        silent: true
    })
}

//打开UILoading模块加载框
var uiloading, eLoadId;

function showLoading() {
    uiloading = api.require('UILoading');
    uiloading.flower({
        center: {
            marginTop: api.winWidth / 2,
            marginLeft: api.winHeight / 2
        },
        size: 30,
        mask: 'rgba(20,0,0,.2)',
        fixed: true
    }, function(ret) {
        eLoadId = ret.id;
    });
}
// 关闭加载模态框
function hideLoading() {
    if (!uiloading) {
        return
    }
    uiloading.closeFlower({
        id: eLoadId
    });
}

// 弹出框ms弹出提示文字  time弹出时间 不传时默认3000
function toast(msg, time) {
    if (time) {
        api.toast({
            msg: msg,
            duration: time,
            location: 'bottom'
        });
        return;
    }
    api.toast({
        msg: msg,
        duration: 3000,
        location: 'bottom'
    });
}

// 打开frame
function fnReady(Name) {
    headerHeight = document.getElementById('header').offsetHeight;
    api.openFrame({
        name: Name + '_frm',
        url: './' + Name + '_frm.html',
        rect: {
            marginLeft: 0,
            marginTop: headerHeight,
            marginBottom: 0,
            marginRight: 0
        },
        pageParam: api.pageParam,
        reload: true,
        bounces: false,
        bgColor: '#f5f5f5',
        vScrollBarEnabled: false,
        hScrollBarEnabled: false
    })
}

// 通过字面量方式实现的函数each
var each = function(object, callback) {
    var type = (function() {
        switch (object.constructor) {
            case Object:
                return 'Object';
                break;
            case Array:
                return 'Array';
                break;
            case NodeList:
                return 'NodeList';
                break;
            default:
                return 'null';
                break;
        }
    })();
    // 为数组或类数组时, 返回: index, value
    if (type === 'Array' || type === 'NodeList') {
        // 由于存在类数组NodeList, 所以不能直接调用every方法
        [].every.call(object, function(v, i) {
            return callback.call(v, i, v) === false ? false : true;
        });
    }
    // 为对象格式时,返回:key, value
    else if (type === 'Object') {
        for (var i in object) {
            if (callback.call(object[i], i, object[i]) === false) {
                break;
            }
        }
    }
}

// 时间封装
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

Date.prototype.popular = function () {
    var thisTime = this.getTime();
    var nowT = new Date();
    var nowTime = nowT.getTime();
    var deltaT = nowTime - thisTime + 1000*60*60*8+1000;
    if(0 < deltaT && deltaT < 1000*60*60*24 && this.getDate() == nowT.getDate()){
        if(deltaT<1000*60*60){
          return parseInt(deltaT/1000/60)+1 + "分钟前";
        }
        else{
          return parseInt(deltaT/1000/60/60) + "小时前";
        }
    }else if(0 < deltaT && deltaT < 1000*60*60*24*365){
      return this.format("M月dd日")
    }else{
      return this.format("yyyy年M月dd日")
    }
};
