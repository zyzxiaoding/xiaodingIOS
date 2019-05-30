 //环信注册接口
 function fnEaseRegister(_name, _pawssword) {
     var easeChat = api.require('easeChat'); //引用模块插件
     easeChat.easeRegister({
         username: _name,
         password: _pawssword
     }, function(ret, err) {
         console.log(JSON.stringify(ret))
         console.log(JSON.stringify(err))
             //隐藏加载框
         hideLoading();
         if (ret && ret.status) {
             toast('APICloud环信DEMO：注册成功', 3000);
             //关闭注册页面
             setTimeout(function() {
                 api.closeWin()
             }, 200);
         } else {
             toast("APICloud环信DEMO：" + err.msg, 3000);
         }
     });
 }

 //环信登录接口
 function fnEaseChatLogin(_name, _pawssword, _token) {
     var easeChat = api.require('easeChat');
     easeChat.login({
         username: _name,
         password: _pawssword,
         autoLogin: true
     }, function(ret, err) {
       console.log(JSON.stringify(ret))
       console.log(JSON.stringify(err))
         //隐藏加载框
         hideLoading();
         if (ret && ret.status) {
             toast("APICloud环信DEMO：登录成功", 3000);
             //储存数据
             $api.setStorage('token', _token);
             $api.setStorage('user', _name);
             api.setPrefs({
                 key: 'user',
                 value: _token
             });
             //跳转到会话界面
             setTimeout(function() {
                 api.openWin({
                     name: 'main',
                     url: 'widget://html/main.html',
                     slidBackEnabled: false,
                     reload: true
                 });
             }, 400);
             //关闭登录页面
             setTimeout(function() {
                 api.closeWin()
             }, 500);
         } else {
             toast("APICloud环信DEMO：" + err.msg, 3000);
         }
     });
 }

 // 登录之后监听账号异常
 function fnAccountListener() {
     var easeChat = api.require('easeChat');
     easeChat.addAccountListener(function(ret) {
         if (ret.eventType === 'otherLogin') {
             toast("APICloud环信DEMO：当前账号在其它设备登录,请从新登录");
             setTimeout(function() {
                 api.execScript({
                     name: 'main',
                     frameName: 'setup_frm',
                     script: 'fnSignOuts();'
                 });
             }, 300);
             return;
         }
         if (ret.eventType === 'remove') {
             toast("APICloud环信DEMO：当前登录账号已被服务器删除,请联系管理员");
             setTimeout(function() {
                 api.execScript({
                     name: 'main',
                     frameName: 'setup_frm',
                     script: 'fnSignOuts();'
                 });
             }, 300);
             return;
         }
         if (ret.eventType === 'forbid') {
             toast("APICloud环信DEMO：服务被禁用,请联系管理员");
             setTimeout(function() {
                 api.execScript({
                     name: 'main',
                     frameName: 'setup_frm',
                     script: 'fnSignOuts();'
                 });
             }, 300);
             return;
         }
     });
 }

 //退出登录
 function fnLogout() {
     var easeChat = api.require('easeChat');
     easeChat.logout(function(ret, err) {
         hideLoading();
         if (ret.status) {
             //  删除登录储存的本地用户数据
             $api.rmStorage('user');
             $api.rmStorage('token');
             api.removePrefs({
                 key: 'user'
             });
             toast("APICloud环信DEMO：退出成功");
             setTimeout(function() {
                 api.openWin({
                     name: 'login',
                     url: 'widget://html/login/login.html',
                     slidBackEnabled: false,
                     reload: true,
                     animation: {
                         type: 'movein',
                         subType: 'from_bottom'
                     },
                 });
             }, 300);
             setTimeout(function() {
                 setTimeout(function() {
                     api.closeWin({
                         name: 'main'
                     });
                     api.closeFrameGroup({
                         name: 'main_group'
                     });
                 }, 300)
                 api.closeWin()
             }, 400)
         } else {
             toast("APICloud环信DEMO：" + err.msg);
         }
     });
 }

 //监听消息事件
 function fnAddMessageListener() {
     var easeChat = api.require('easeChat');
     easeChat.addMessageListener({
         name: 'receive'
     }, function(ret) {
         if (ret) {
             //获取到消息刷新一下会话列表
             fnGetAllConversations();
             console.log(JSON.stringify(ret));
             // 向聊天消息追加一条消息
             api.execScript({
                 name: 'chat',
                 frameName: 'chat_frm',
                 script: 'fnAddanew(' + JSON.stringify(ret.messages) + ',' + true + ');'
             });
             //  将指定消息设置为已读
             console.log(ret.conversationId)
             fnMarkMessageAsRead(ret.conversationId, ret.chatType, ret.messageId)
         } else {
             toast("APICloud环信DEMO：" + ret.msg);
         }
     });
 }

 // 获取环信会话列表
 function fnGetAllConversations() {
     var easeChat = api.require('easeChat');
     easeChat.getAllConversations(function(ret) {
         var _total = 0;
         for (var i in ret.conversations) {
             _total += ret.conversations[i].unreadMessagesCount;
         }
         //存储未读消息总数
         $api.setStorage('unread_total', _total);
         //刷新底部导航消息数
         api.execScript({
             name: 'main',
             script: 'fnNewsBadge(' + _total + ');'
         });
         //刷新会话列表消息
         api.execScript({
             name: 'main',
             frameName: 'message',
             script: 'fnRequestList(' + JSON.stringify(ret) + ');'
         });
     });
 }

 //新建或获取一个会话 安卓同样支持
 function fnGetConversation(conversationId_, type_) {
     var easeChat = api.require('easeChat');
     easeChat.getConversation({
         conversationId: conversationId_,
         type: type_,
         ifCreate: true
     }, function(ret, err) {
         if (ret.status) {
             console.log(JSON.stringify(ret))
         } else {
             toast("APICloud环信DEMO：" + err.msg);
         }
     });
 }

 //获取聊天消息
 function fnMessageFromDB(_conversationid) {
      fnLoadMessageFromDB();
     /*var easeChat = api.require('easeChat');
     easeChat.loadMessageFromDB({
         conversationId: _conversationid,
         type: _type,
         startMsgId: _lastid,
         pagesize: 6 //没加载6条信息
     }, function(ret, err) {
         if (ret) {
             // 加载chat_frm页面fnLoadMessageFromDB聊天消息
             fnLoadMessageFromDB(ret, _loadMore);
         } else {
             toast("APICloud环信DEMO：" + err.msg);
         }
     });*/
 }

 //点击消息已读
 function fnMarkAllMessagesAsRead(conversationId_, type_) {
     var easeChat = api.require('easeChat');
     easeChat.markAllMessagesAsRead({
         conversationId: conversationId_,
         type: type_
     }, function(ret, err) {
         if (ret.status) {
             //  console.log(JSON.stringify(ret));
         } else {
             toast("APICloud环信DEMO：" + err.msg);
         }
     });
 }

 //将指定消息设置为已读
 function fnMarkMessageAsRead(conversationId_, type_, messageId_) {
     var easeChat = api.require('easeChat');
     easeChat.markMessageAsRead({
         conversationId: conversationId_,
         type: type_,
         messageId: messageId_
     }, function(ret, err) {
         if (ret) {
             // api.alert({ msg:JSON.stringify(ret)});
         } else {
             toast("APICloud环信DEMO：" + err.msg);
         }
     });
 }

 //发送语音消息
 function fnEaseChatSendVoice(conversationId_, chatType_, path_, from_, to_, time_) {
     var date = new Date();
     var y = date.getFullYear();
     var m = date.getMonth();
     var d = date.getDate();
     var h = date.getHours();
     var mm = date.getMinutes();
     var s = date.getSeconds();
     // 根据发送人名和发送时间，合成的语音文件名
     var displayName = from_ + "" + y + "" + m + "" + d + "" + h + "" + mm + "" + s;
     var easeChat = api.require('easeChat');
     easeChat.sendVoice({
         conversationId: conversationId_,
         chatType: chatType_,
         length: time_,
         path: path_,
         displayName: displayName,
         from: from_,
         to: to_,
         ext: {
             isShow: false
         }
     }, function(ret, err) {
         if (ret) {
             if (ret.status == true) {
                 // 刷新一下首页列表消息
                 fnGetAllConversations();
                 // 向聊天消息追加一条消息
                 api.execScript({
                     name: 'chat',
                     frameName: 'chat_frm',
                     script: 'fnAddanew(' + JSON.stringify([ret.message]) + ',' + true + ');'
                 });
                 //将指定消息设置为已读
                 fnMarkMessageAsRead(ret.message.conversationId, ret.message.chatType, ret.message.messageId);
             } else {
                 toast("APICloud环信DEMO：消息发送失败请稍后再试");
             }
         } else {
             toast("APICloud环信DEMO：" + err.msg);
         }
     });
 }

 //发送文本消息
 function fnEaseChatSendText(conversationId_, chatType_, text_, from_, to_) {
     var easeChat = api.require('easeChat');
     easeChat.sendText({
         conversationId: conversationId_, //此字段为会话id一开始可以对话可以为空
         chatType: chatType_, //会话类型chat：单聊会话 groupChat：群聊会话 chatRoom：聊天室会话
         text: text_, //发送的消息内容
         from: from_, //发送方当前登录账号
         to: to_, //接受方
         ext: {} // //JSON 对象；消息扩展，Key值类型必须是NSString, Value值类型必须是NSString或者 NSNumber类型的 BOOL, int, unsigned in, long long, double
     }, function(ret, err) {
         if (ret) {
             if (ret.status == true) {
                 //  刷新一下首页列表消息
                 fnGetAllConversations();
                 // 向聊天消息追加一条消息
                 api.execScript({
                     name: 'chat',
                     frameName: 'chat_frm',
                     script: 'fnAddanew(' + JSON.stringify([ret.message]) + ',' + true + ');'
                 });
                 //将指定消息设置为已读
                 fnMarkMessageAsRead(ret.message.conversationId, ret.message.chatType, ret.message.messageId);
             } else {
                 toast("APICloud环信DEMO：消息发送失败请稍后再试");
             }
         } else {
             toast("APICloud环信DEMO：" + err.msg);
         }
     });
 }

 //删除会话
 function fnEaseChatDeleteConversation(conversationId_, isDelete_) {
     var easeChat = api.require('easeChat');
     easeChat.deleteConversation({
         conversationId: conversationId_,
         isDeleteMessages: isDelete_ //是否删除会话中的消息
     }, function(ret, err) {
         // console.log(JSON.stringify(ret))
         if (ret) {
             if (ret.status === true) {
                 api.execScript({
                     name: 'chat',
                     frameName: 'chat_frm',
                     script: 'fnCloseNew();'
                 });
                 toast('APICloud环信DEMO：聊天记录清空成功');
                 //  刷新一下列表
                 fnGetAllConversations();
             } else {
                 toast('APICloud环信DEMO：' + ret.msg);
             }
         } else {
             toast('APICloud环信DEMO：' + err.msg);
         }
     });
 }


 //************** 好友接口**********************
 //**************
 //*********//获取环信好友列表
 function fngetContacts() {
   showLoading()
     var easeChat = api.require('easeChat');
     easeChat.getContacts({
         original: 'server'
     }, function(ret) {
       hideLoading();
         if (ret) {
             console.log(JSON.stringify(ret))
             fnContactseList(ret);
         } else {
             toast('APICloud环信DEMO：' + ret.msg);
         }
     });
 }
