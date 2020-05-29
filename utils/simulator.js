var config = require('../config.js')

var loginUrl = config.loginUrl
var infoUrl = config.infoUrl
var cookieStr = ''


var login = function (username, password) {
  console.log(loginUrl)
  wx.request({
    url: loginUrl,
    header: {
      'Cookie': cookieStr
    },
    // success: function (res) {
    //   var data = []
    //   try {
    //     data = paser.paseAchievement(res.data)
    //     successFunc(data)
    //   } catch (error) {
    //     failFunc('parse error')
    //   }
    // },
    fail: function (res) {
      failFunc('network error')
    }
  })
}

var getAchievement = function (successFunc, failFunc) {
  console.log(achievementUrl)
  wx.request({
    url: achievementUrl,
    header: {
      'Cookie': cookieStr
    },
    success: function (res) {
      var data = []
      try {
        data = paser.paseAchievement(res.data)
        successFunc(data)
      } catch (error) {
        failFunc('parse error')
      }
    },
    fail: function (res) {
      failFunc('network error')
    }
  })
}

module.exports = {
  'getAchievement': getAchievement,
  'login': login
}
