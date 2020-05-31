// pages/input/index.js
var util = require('../../utils/util');

function accuserDetail(accuserName){
  this.accuserName = accuserName;
}
function accusedDetail(accusedName){
  this.accusedName = accusedName;
}
function AccuserInfo(){
  this.accuser = [];
}
function AccusedInfo(){  
  this.accused = [];
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
      code:"",
      accuserInfo: {},
      accusedInfo: {},
      categoryArr : ['民事-M','刑事-X','行政-XZ'],
      categoryIndex : 0,
      categoryMap: [
        {
          id: 0,
          name: '民事-M'
        },
        {
          id: 1,
          name: '刑事-X'
        },
        {
          id: 2,
          name: '行政-XZ'
        }
      ],
  },
  addInfo: function (e) {
    var that = this;
    let accuserInfo = this.data.accuserInfo;
    let accusedInfo = this.data.accusedInfo;
    let categoryIndex = this.data.categoryIndex;
    if(accuserInfo.accuser[0].accuserName == null || accusedInfo.accused[0].accusedName == null){
      wx.showModal({
        title: '提示',
        content: '信息不全啦',
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
    else{
      var msg = "原告：";
      for(var i = 0; i < accuserInfo.accuser.length; i++){
        console.log(accuserInfo.accuser[i].accuserName);
        msg += accuserInfo.accuser[i].accuserName + "  "
      }
      msg += "被告：";
      for(var j = 0; j < accusedInfo.accused.length; j++){
        console.log(accusedInfo.accused[j].accusedName);
        msg += accusedInfo.accused[j].accusedName + "  "
      }      
      msg += "类型：" + categoryIndex;
      wx.showModal({
        title: '提示',
        content: msg,
        showCancel: false,
      })      
      this.setData({
        code : "BJM20200531003"
      });
      return;
      var options = {
        url: "http://127.0.0.1",
        data: {
          name1: name1,
          name2: name2,
          event: event
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
            content: '输入： 姓名1：' + options.data.name1 +'   姓名2：' + options.data.name2 + '  事件：' + options.data.event + "; 但是目前没有服务器哦！",
            showCancel: false,
          })
          console.log(options.data);
          console.log(err);
          return;
        }
      });
    }

  },
  init: function () {
    let that = this;
    var accuserInfo = new AccuserInfo();
    accuserInfo.accuser.push(new accuserDetail());
    var accusedInfo = new AccusedInfo();
    accusedInfo.accused.push(new accusedDetail());
    this.setData({
      accuserInfo: accuserInfo,
      accusedInfo: accusedInfo,
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
    if(accuserInfo.accuser.length > 1){
      accuserInfo.accuser.pop(new accuserDetail());
      this.setData({
        accuserInfo: accuserInfo
      });      
    }
  },
  //设置原告姓名
  setAccuser : function(e){
    let index = parseInt(e.currentTarget.id.replace("accuser-", ""));
    let accuser = e.detail.value;
    let accuserInfo = this.data.accuserInfo;
    accuserInfo.accuser[index].accuserName = accuser;
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
    if(accusedInfo.accused.length > 1){
      accusedInfo.accused.pop(new accusedDetail());
      this.setData({
        accusedInfo: accusedInfo
      });      
    }
  },  
  //设置被告姓名
  setAccused : function(e){
    let index = parseInt(e.currentTarget.id.replace("accused-", ""));
    let accused = e.detail.value;
    let accusedInfo = this.data.accusedInfo;
    accusedInfo.accused[index].accusedName = accused;
    this.setData({
      accusedInfo: accusedInfo
    });    
  },

  bindPickerChange : function(e){
    this.setData({
      categoryIndex: e.detail.value
    })    
  },
  resetForm : function(e){
    var accuserInfo = new AccuserInfo();
    accuserInfo.accuser.push(new accuserDetail());
    var accusedInfo = new AccusedInfo();
    accusedInfo.accused.push(new accusedDetail());    
    this.setData({
      code:"",
      accuserInfo: accuserInfo,
      accusedInfo: accusedInfo,
    })  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
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