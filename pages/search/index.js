// pages/search/index.js
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
    if(!keyword){
      wx.showModal({
        title: '提示',
        content: '您给个关键字呗',
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
    var options = {
      url: "https://127.0.0.1",
      data: {
        keyword: keyword
      }
    };
    wx.request({
      url: options.url,
      data: options.data ? options.data : {},
      method: options.method ? options.method : 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: options.header ? options.header : { 'content-type': 'application/json' }, // 设置请求的 header        
      success: function (res) {
        var infos = [];
        for (var i = 0; i < res.data.result.length; i++) {
          infos.push(res.data.result[i].value);
        }
        that.setData({
          infoList: infos
        });
      },
      fail: function (err) {
        var k = options.data.keyword;
        console.log(k);
        console.log("no server");
        var infos = [
          {
            'name1':'六子',
            'name2':k,
            'code':'BJM202005300001'
          },
          {
            'name1': '走近科学栏目组',
            'name2': k,
            'code': 'BJX202005300001'
          },
          {
            'name1': '暴躁老哥2',
            'name2': k,
            'code': 'BJM202005300002'
          },
          {
            'name1': '凑数',
            'name2': k,
            'code': 'BJXZ202005300001'
          },     
          {
            'name1': '凑数',
            'name2': k,
            'code': 'BJXZ202005300002'
          },   
          {
            'name1': '凑数',
            'name2': k,
            'code': 'BJM202005300003'
          },   
          {
            'name1': '拿来测试长度自适应拿来测试长度自适应拿来测试长度自适应拿来测试长度自适应拿来测试长度自适应拿来测试长度自适应拿来测试长度自适应拿来测试长度自适应拿来测试长度自适应拿来测试长度自适应拿来测试长度自适应拿来测试长度自适应',
            'name2': k,
            'code': 'BJX202005300002'
          },                                                         
        ];
        that.setData({
          infoList: infos
        });
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