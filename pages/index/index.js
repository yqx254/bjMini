var config = require('../../config.js')
// var mockData = require('../../mock/data.js')
var simulator = require('../../utils/simulator.js')

var inputs = {}

// 获取应用实例
var app = getApp()
Page({
  data: {
    loadingHidden: true,
    modalHidden: true,
    modalContent: '',
    inputs: {}
  },

  tapLoading: function () {
    this.setData({
      loadingHidden: true
    })
  },

  loading: function () {
    this.setData({
      loadingHidden: false
    })
  },

  unloading: function () {
    this.setData({
      loadingHidden: true
    })
  },
  inputChange: function (e) {
    inputs[e.currentTarget.id] = e.detail.value
  },

  formSubmit: function () {
    var page = this
    if (inputs['userName'] == null || inputs['userName'] == '') {
      page.showModal('请输入账号')
      return
    }
    if (inputs['password'] == null || inputs['password'] == '') {
      page.showModal('请输入密码')
      return
    }
    page.loading()

    // simulator.login(inputs['username'], inputs['password'])
    wx.setStorageSync('userName', inputs['userName'])
    console.log(inputs);
    wx.request({
      url: config.serverUrl + "user/login-mn.do",
      data: inputs ? inputs : {},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/x-www-form-urlencoded' }, // 设置请求的 header        
      success: function (res) {
        console.log(res);
        if(res.data.success){
          let cookieStr = res.header['Set-Cookie'] || res.header['set-cookie'];
          wx.removeStorageSync("sessionId");
          wx.setStorageSync("sessionId", cookieStr);          
          page.unloading()
          wx.hideNavigationBarLoading()
          wx.setStorageSync('token', res.data.token);
          wx.switchTab({
            url: '/pages/input/index'
          })
        }
        else{
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
          })
          return;          
        }
      },
      fail: function (err) {
        wx.showModal({
          title: '提示',
          content: '登录失败，请重试',
          showCancel: false,
        })
        console.log(err);
        return;
      }
    });    
    page.unloading()
    wx.hideNavigationBarLoading()    
  },


  modalCancel: function () {
    this.setData({
      modalHidden: true
    })
  },

  modalConfirm: function () {
    this.setData({
      modalHidden: true
    })
  },

  showModal: function (msg) {
    this.setData({
      modalHidden: false,
      modalContent: msg
    })
  },

  onLoad: function () {
    // 调用应用实例的方法获取全局数据
    var that = this
    that.loading();
    let token = wx.getStorageSync('token');
    if (token != null) {
      inputs['token'] = token;
      wx.request({
        url: config.serverUrl + "user/token-access.do",
        data: inputs ? inputs : {},
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: { 'content-type': 'application/x-www-form-urlencoded' }, // 设置请求的 header        
        success: function (res) {
          console.log(res);
          if (res.data.success) {
            let cookieStr = res.header['Set-Cookie'] || res.header['set-cookie'];
            wx.removeStorageSync("sessionId");
            wx.setStorageSync("sessionId", cookieStr);
            that.unloading()
            wx.hideNavigationBarLoading()
            wx.switchTab({
              url: '/pages/input/index'
            })
          }
          else{
            that.unloading()
          }
        }
      }); 
    }            
    inputs['userName'] = wx.getStorageSync('userName')
    this.setData({
      inputs: inputs
    })
  },

  switchChange: function (e) {
    inputs[e.currentTarget.id] = e.detail.value
  }
})
