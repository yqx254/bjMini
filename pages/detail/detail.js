// pages/input/index.js
var util = require('../../utils/util');

function accuserDetail(accuserName, typeid) {
  this.accuserName = accuserName;
  if (typeid == null) {
    this.typeid = 1;
  }
  else {
    this.typeid = typeid;
  }

}
function accusedDetail(accusedName, typeid) {
  this.accusedName = accusedName;
  if (typeid == null) {
    this.typeid = 0;
  }
  else {
    this.typeid = typeid;
  }
}
function AccuserInfo() {
  this.accuser = [];
}
function AccusedInfo() {
  this.accused = [];
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    accuserInfo: {},  //委托人
    accusedInfo: {},  //对方当事人
    dealer: "",  //承办人
    remarks: "", //备注
    categoryIndex: 0,
    categoryMap: [
      {
        id: 0,
        name: '民事'
      },
      {
        id: 1,
        name: '刑事'
      },
      {
        id: 2,
        name: '行政'
      },
      {
        id: 3,
        name: '顾问'
      },
      {
        id: 4,
        name: '其他'
      }
    ],
    typeIndex: 0,
    typeMap: [
      {
        id: 0,
        name: '原告'
      },
      {
        id: 1,
        name: '被告'
      },
      {
        id: 2,
        name: '第三人'
      },
      {
        id: 3,
        name: '顾问单位'
      },
    ]
  },
  addInfo: function (e) {
    let c = this.data.code;
    wx.showToast({ title: '加载中', icon: 'loading', duration: 10000 });    
    setTimeout(function () {
      wx.hideToast();
      wx.showModal({
        title: '提示',
        content: "保存成功",
        showCancel: false,
      })       
    }, 1000)
   
    return;
    var that = this;
    let accuserInfo = this.data.accuserInfo;
    let accusedInfo = this.data.accusedInfo;
    let categoryIndex = this.data.categoryIndex;
    if (accuserInfo.accuser[0].accuserName == null) {
      wx.showModal({
        title: '提示',
        content: '委托人信息不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('点击确定')
          } else {
            console.log('点击取消')
          }
        }
      })
      return;
    }
    else {
      // var msg = "委托人：";
      // for(var i = 0; i < accuserInfo.accuser.length; i++){
      //   console.log(accuserInfo.accuser[i].accuserName);
      //   msg += accuserInfo.accuser[i].accuserName + "-" + accuserInfo.accuser[i].typeid + "   "
      // }
      // msg += "被告：";
      // for(var j = 0; j < accusedInfo.accused.length; j++){
      //   console.log(accusedInfo.accused[j].accusedName);
      //   msg += accusedInfo.accused[j].accusedName + "-" + accusedInfo.accused[j].typeid + "   "
      // }      
      // msg += "类型：" + categoryIndex;
      // wx.showModal({
      //   title: '提示',
      //   content: msg,
      //   showCancel: false,
      // })
      var code = "BJ";
      switch (parseInt(categoryIndex)) {
        case 0:
          code += "M2020050001";
          break;
        case 1:
          code += "X2020050001";
          break;
        case 2:
          code += "XZ2020050001";
          break;
        case 3:
          code += "G2020050001";
          break;
        case 4:
          code += "Q2020050001";
          break;
      }
      this.setData({
        code: code
      });
      wx.showModal({
        title: '提示',
        content: "与XXX案件存在利冲，承办人XXX，请核实",
        showCancel: false,
      });
      return;
      var options = {
        url: "http://127.0.0.1",
        data: {
          accuser: accuserInfo,
          accused: accused,
          category: categoryIndex,
          dealer: e.detail.value.dealer,
          remarks: e.detail.value.remarks,
          startAt: e.detail.value.startAt,
          endAt: e.detail.value.endAt,
        }
      };
      wx.request({
        url: options.url,
        data: options.data ? options.data : {},
        method: options.method ? options.method : 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: options.header ? options.header : { 'content-type': 'application/json' }, // 设置请求的 header        
        success: function (res) {
          wx.showToast({
            title: '成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
        },
        fail: function (err) {
          wx.showModal({
            title: '提示',
            content: '输入： 姓名1：' + options.data.name1 + '   姓名2：' + options.data.name2 + '  事件：' + options.data.event + "; 但是目前没有服务器哦！",
            showCancel: false,
          })
          console.log(options.data);
          console.log(err);
          return;
        }
      });
    }
  },
  init: function (options) {
    let that = this;
    var accuserInfo = new AccuserInfo();
    accuserInfo.accuser.push(new accuserDetail('张三', 1));
    var accusedInfo = new AccusedInfo();
    accusedInfo.accused.push(new accusedDetail('李四', 0));
    let code = options.code;
    var dealer = '老律师';
    var remarks = '好案子，不得了';
    this.setData({
      code : code,
      accuserInfo: accuserInfo,
      accusedInfo: accusedInfo,
      dealer : dealer,
      remarks : remarks
    });
  },
  //加原告
  addAccuser: function (e) {
    let accuserInfo = this.data.accuserInfo;
    accuserInfo.accuser.push(new accuserDetail());
    this.setData({
      accuserInfo: accuserInfo
    });
  },
  //减原告
  deleteAccuser: function (e) {
    let accuserInfo = this.data.accuserInfo;
    if (accuserInfo.accuser.length > 1) {
      accuserInfo.accuser.pop(new accuserDetail());
      this.setData({
        accuserInfo: accuserInfo
      });
    }
  },
  //设置原告姓名
  setAccuser: function (e) {
    let index = parseInt(e.currentTarget.id.replace("accuser-", ""));
    let accuser = e.detail.value;
    let accuserInfo = this.data.accuserInfo;
    accuserInfo.accuser[index].accuserName = accuser;
    this.setData({
      accuserInfo: accuserInfo
    });
  },
  //改原告身份
  bindTypeChangeA: function (e) {
    let index = parseInt(e.currentTarget.id.replace("accuserType-", ""));
    let type = e.detail.value;
    let accuserInfo = this.data.accuserInfo;
    accuserInfo.accuser[index].typeid = type;
    this.setData({
      accuserInfo: accuserInfo
    });
  },
  //加原告
  addAccused: function (e) {
    let accusedInfo = this.data.accusedInfo;
    accusedInfo.accused.push(new accusedDetail());
    this.setData({
      accusedInfo: accusedInfo
    });
  },
  //减原告
  deleteAccused: function (e) {
    let accusedInfo = this.data.accusedInfo;
    if (accusedInfo.accused.length > 1) {
      accusedInfo.accused.pop(new accusedDetail());
      this.setData({
        accusedInfo: accusedInfo
      });
    }
  },
  //设置被告姓名
  setAccused: function (e) {
    let index = parseInt(e.currentTarget.id.replace("accused-", ""));
    let accused = e.detail.value;
    let accusedInfo = this.data.accusedInfo;
    accusedInfo.accused[index].accusedName = accused;
    this.setData({
      accusedInfo: accusedInfo
    });
  },
  //改被告身份
  bindTypeChangeD: function (e) {
    let index = parseInt(e.currentTarget.id.replace("accusedType-", ""));
    let type = e.detail.value;
    let accusedInfo = this.data.accusedInfo;
    accusedInfo.accused[index].typeid = type;
    this.setData({
      accusedInfo: accusedInfo
    });
  },
  bindPickerChange: function (e) {
    this.setData({
      categoryIndex: e.detail.value
    })
  },


  resetForm: function (e) {
    var accuserInfo = new AccuserInfo();
    accuserInfo.accuser.push(new accuserDetail());
    var accusedInfo = new AccusedInfo();
    accusedInfo.accused.push(new accusedDetail());
    this.setData({
      code: "",
      categoryIndex: 0,
      accuserInfo: accuserInfo,
      accusedInfo: accusedInfo,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init(options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})