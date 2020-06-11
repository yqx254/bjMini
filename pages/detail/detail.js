// pages/input/index.js
var util = require('../../utils/util');
var config = require('../../config.js');

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
        name: '原告人'
      },
      {
        id: 3,
        name: '被告人'
      },
      {
        id: 4,
        name: '第三人'
      },
      {
        id: 5,
        name: '顾问单位'
      },
    ]
  },
  addInfo: function (e) {
    let id = this.data.id;
    wx.showToast({ title: '加载中', icon: 'loading', duration: 10000 });    
    var that = this;
    let accuserInfo = this.data.accuserInfo;
    let accusedInfo = this.data.accusedInfo;
    let categoryIndex = this.data.categoryIndex;
    let code = this.data.code;
    if (accuserInfo.accuser[0].accuserName == null) {
      wx.showModal({
        title: '提示',
        content: '委托人信息不能为空',
        showCancel: false
      })
      return;
    }
    else {
      var options = {
        url: config.serverUrl + "api-case/edit.do",
        data: {
          id: id,
          accuser: JSON.stringify(accuserInfo['accuser']),
          accused: JSON.stringify(accusedInfo['accused']),
          dealer: e.detail.value.dealer,
          remarks: e.detail.value.remarks
        }
      };
      wx.request({
        url: options.url,
        data: options.data ? options.data : {},
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: options.header ? options.header : { 'content-type': 'application/x-www-form-urlencoded', 'cookie': wx.getStorageSync("sessionId")  }, // 设置请求的 header
        success: function (res) {
          wx.hideToast();
          if(res.data.success == "1"){
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1000,
              mask: true
            })
          }
          else{
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
            })
          }
        },
        fail: function (err) {
          wx.showModal({
            title: '提示',
            content: '服务器开小差，请稍候再试',
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
    let id = options.id;
    let that = this;
    wx.request({
      url: config.serverUrl + "api-case/detail.do?id=" + id,
      method: options.method ? options.method : 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: options.header ? options.header : { 'content-type': 'application/json', 'cookie': wx.getStorageSync("sessionId") }, // 设置请求的 header        
      success: function (res) {
        let data = res.data;
        var accuserInfo = new AccuserInfo();
        for(var i = 0; i < data.clientNameArr.length; i ++)
          accuserInfo.accuser.push(new accuserDetail(data.clientNameArr[i], data.clientIdtArr[i]));
        var accusedInfo = new AccusedInfo();
        for (var j = 0; j < data.opponentNameArr.length; j++){
          accusedInfo.accused.push(new accusedDetail(data.opponentNameArr[j], data.opponentIdtArr[j]));
        }        
        that.setData({
          id : data.id,
          categoryIndex : data.category,
          code: data.caseCode,
          accuserInfo: accuserInfo,
          accusedInfo: accusedInfo,
          dealer: data.dealer,
          remarks: data.remarks
        });
      },
      fail: function (err) {
        var k = options.data.keyword;
        console.log(k);
        wx.showModal({
          title: '提示',
          content: '服务器开小差，请稍候再试',
          showCancel: false
        })
      }
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
    let type = parseInt(e.detail.value);
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
    let type = parseInt(e.detail.value);
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