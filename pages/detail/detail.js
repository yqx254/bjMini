// pages/input/index.js
var util = require('../../utils/util');
var config = require('../../config.js');

function accuserDetail(accuserName, typeid, id) {
  this.accuserName = accuserName;
  this.id = id || Date.now() + Math.random(); // 添加唯一ID
  if (typeid == null) {
    this.typeid = 1;
  }
  else {
    this.typeid = typeid;
  }

}
function accusedDetail(accusedName, typeid, id) {
  this.accusedName = accusedName;
  this.id = id || Date.now() + Math.random(); // 添加唯一ID
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
    // 统一身份选择索引（所有委托人/当事人共用）
    accuserRoleIndex: 0,
    accusedRoleIndex: 0,
    // 撤销修改用的原始数据快照
    originalCategoryIndex: 0,
    originalAccuserInfo: null,
    originalAccusedInfo: null,
    originalDealer: "",
    originalRemarks: "",
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
        header: options.header ? options.header : { 'content-type': 'application/x-www-form-urlencoded', 'cookie': wx.getStorageSync("sessionId") }, // 设置请求的 header
        success: function (res) {
          wx.hideToast();
          if (res.data.success == "1") {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1000,
              mask: true
            })
          }
          else {
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
        for (var i = 0; i < data.clientNameArr.length; i++)
          accuserInfo.accuser.push(new accuserDetail(data.clientNameArr[i], data.clientIdtArr[i], 'server_' + i));
        var accusedInfo = new AccusedInfo();
        for (var j = 0; j < data.opponentNameArr.length; j++) {
          accusedInfo.accused.push(new accusedDetail(data.opponentNameArr[j], data.opponentIdtArr[j], 'server_' + j));
        }
        // 计算统一身份索引（默认取第一条）
        var accuserRoleIndex = accuserInfo.accuser.length > 0 ? accuserInfo.accuser[0].typeid : 0;
        var accusedRoleIndex = accusedInfo.accused.length > 0 ? accusedInfo.accused[0].typeid : 0;
        // 确保数组中所有项的 typeid 与统一身份索引保持一致
        accuserInfo.accuser.forEach(function (item) {
          item.typeid = accuserRoleIndex;
        });
        accusedInfo.accused.forEach(function (item) {
          item.typeid = accusedRoleIndex;
        });

        // 生成原始快照，用于“撤销修改”
        var originalAccuserInfo = JSON.parse(JSON.stringify(accuserInfo));
        var originalAccusedInfo = JSON.parse(JSON.stringify(accusedInfo));

        that.setData({
          id: data.id,
          categoryIndex: data.category,
          code: data.caseCode,
          accuserInfo: accuserInfo,
          accusedInfo: accusedInfo,
          dealer: data.dealer,
          remarks: data.remarks,
          accuserRoleIndex: accuserRoleIndex,
          accusedRoleIndex: accusedRoleIndex,
          originalCategoryIndex: data.category,
          originalAccuserInfo: originalAccuserInfo,
          originalAccusedInfo: originalAccusedInfo,
          originalDealer: data.dealer,
          originalRemarks: data.remarks
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
    var type = parseInt(e.detail.value);
    var accuserInfo = this.data.accuserInfo;
    accuserInfo.accuser.forEach(function (item) {
      item.typeid = type;
    });
    this.setData({
      accuserInfo: accuserInfo,
      accuserRoleIndex: type
    });
  },

  // 删除单个委托人
  removeAccuserItem: function (e) {
    var targetId = e.currentTarget.dataset.id;
    var accuserInfo = this.data.accuserInfo;
    if (!accuserInfo || !accuserInfo.accuser) return;

    // 基于ID查找并删除
    var newArray = accuserInfo.accuser.filter(function (item) {
      return item.id !== targetId;
    });

    // 如果只剩一个且为空，替换为空对象
    if (newArray.length === 0) {
      newArray.push(new accuserDetail());
    }

    this.setData({
      accuserInfo: { accuser: newArray }
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
    var type = parseInt(e.detail.value);
    var accusedInfo = this.data.accusedInfo;
    accusedInfo.accused.forEach(function (item) {
      item.typeid = type;
    });
    this.setData({
      accusedInfo: accusedInfo,
      accusedRoleIndex: type
    });
  },

  // 删除单个对方当事人
  removeAccusedItem: function (e) {
    var targetId = e.currentTarget.dataset.id;
    var accusedInfo = this.data.accusedInfo;
    if (!accusedInfo || !accusedInfo.accused) return;

    // 基于ID查找并删除
    var newArray = accusedInfo.accused.filter(function (item) {
      return item.id !== targetId;
    });

    // 如果只剩一个且为空，替换为空对象
    if (newArray.length === 0) {
      newArray.push(new accusedDetail());
    }

    this.setData({
      accusedInfo: { accused: newArray }
    });
  },
  bindPickerChange: function (e) {
    this.setData({
      categoryIndex: e.detail.value
    })
  },

  // 点击标签切换案件类别（仅前端交互，不影响后端接口）
  tapCategory: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      categoryIndex: index
    });
  },


  // 撤销修改：还原为接口加载时的原始数据
  resetForm: function (e) {
    if (!this.data.originalAccuserInfo || !this.data.originalAccusedInfo) {
      return;
    }
    var accuserInfo = JSON.parse(JSON.stringify(this.data.originalAccuserInfo));
    var accusedInfo = JSON.parse(JSON.stringify(this.data.originalAccusedInfo));
    this.setData({
      categoryIndex: this.data.originalCategoryIndex,
      accuserInfo: accuserInfo,
      accusedInfo: accusedInfo,
      dealer: this.data.originalDealer,
      remarks: this.data.originalRemarks,
      accuserRoleIndex: accuserInfo.accuser.length > 0 ? accuserInfo.accuser[0].typeid : 0,
      accusedRoleIndex: accusedInfo.accused.length > 0 ? accusedInfo.accused[0].typeid : 0
    });
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
