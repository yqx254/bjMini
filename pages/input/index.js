// pages/input/index.js
var util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      name1:"",
      name2:"",
      event:""
  },

  addInfo: function (e) {
    var that = this;
    let {name1, name2, event} = e.detail.value;
    if(!name1 || !name2 || !event){
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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