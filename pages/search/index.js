// pages/search/index.js
var config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword : "",
    infoList : []
  },

  query: function (e) {
    var that = this;
    var keyword = that.data.keyword;
    var options = {
      url: config.serverUrl + "api-case/list.do",
      data: {
        keyword: encodeURIComponent(keyword)
      }
    };
    wx.request({
      url: options.url,
      data: options.data ? options.data : {},
      method: options.method ? options.method : 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: options.header ? options.header : { 'content-type': 'application/json', 'cookie': wx.getStorageSync("sessionId") }, // 设置请求的 header        
      success: function (res) {
        var infos = [];
        for (var i = 0; i < res.data.length; i++) {
          infos.push(res.data[i]);
        }
        that.setData({
          infoList: infos
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

  inputKeyword: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var options = {
      url: config.serverUrl + "api-case/list.do",
    };
    let that = this;
    wx.request({
      url: options.url,
      data: options.data ? options.data : {},
      method: options.method ? options.method : 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: options.header ? options.header : { 'content-type': 'application/json', 'cookie': wx.getStorageSync("sessionId") }, // 设置请求的 header     
      success: function (res) {
        var infos = [];
        for (var i = 0; i < res.data.length; i++) {
          infos.push(res.data[i]);
        }
        that.setData({
          infoList: infos
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
  caseDetail : function (e) {
    var code = e.currentTarget.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + code
    });
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