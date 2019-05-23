'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

require('./npm/wepy-async-function/index.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _default = function (_wepy$app) {
  _inherits(_default, _wepy$app);

  function _default() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, _default);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = _default.__proto__ || Object.getPrototypeOf(_default)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
      pages: ['pages/index', 'pages/article', 'pages/user', 'pages/select', 'pages/discern', 'pages/writeOne', 'pages/writeMore'],
      window: {
        backgroundTextStyle: 'light',
        navigationBarBackgroundColor: '#fff',
        navigationBarTitleText: '机器学习',
        navigationBarTextStyle: 'black'
      },
      tabBar: {
        selectedColor: '#1AAD16',
        list: [{
          pagePath: 'pages/index',
          text: '文章',
          iconPath: 'images/news.png',
          selectedIconPath: 'images/news_s.png'
        }, {
          pagePath: 'pages/select',
          text: '识别中心',
          iconPath: 'images/discern.png',
          selectedIconPath: 'images/discern_s.png'
        }, {
          pagePath: 'pages/user',
          text: '个人中心',
          iconPath: 'images/user.png',
          selectedIconPath: 'images/user_s.png'
        }]
      }
    }, _this.globalData = {
      userInfo: null,
      openId: ''
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(_default, [{
    key: 'onLaunch',
    value: function onLaunch() {
      var that = this;
      // 登录
      wx.login({
        success: function success(res) {
          if (res.code) {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: 'http://106.14.145.218:9100/wx_login',
              data: {
                code: res.code
              },
              header: {
                'Content-Type': 'application/json'
              },
              success: function success(res) {
                console.log(res.data.content);
                that.globalData.openId = res.data.content.openId;
              }
            });
          } else {
            console.log('登录失败！' + res.errMsg);
          }
        }
      });
    }
  }]);

  return _default;
}(_wepy2.default.app);


App(require('./npm/wepy/lib/wepy.js').default.$createApp(_default, {"noPromiseAPI":["createSelectorQuery"]}));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6WyJjb25maWciLCJwYWdlcyIsIndpbmRvdyIsImJhY2tncm91bmRUZXh0U3R5bGUiLCJuYXZpZ2F0aW9uQmFyQmFja2dyb3VuZENvbG9yIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIm5hdmlnYXRpb25CYXJUZXh0U3R5bGUiLCJ0YWJCYXIiLCJzZWxlY3RlZENvbG9yIiwibGlzdCIsInBhZ2VQYXRoIiwidGV4dCIsImljb25QYXRoIiwic2VsZWN0ZWRJY29uUGF0aCIsImdsb2JhbERhdGEiLCJ1c2VySW5mbyIsIm9wZW5JZCIsInRoYXQiLCJ3eCIsImxvZ2luIiwic3VjY2VzcyIsInJlcyIsImNvZGUiLCJyZXF1ZXN0IiwidXJsIiwiZGF0YSIsImhlYWRlciIsImNvbnNvbGUiLCJsb2ciLCJjb250ZW50IiwiZXJyTXNnIiwiYXBwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MExBR0VBLE0sR0FBUztBQUNQQyxhQUFPLENBQ0wsYUFESyxFQUVMLGVBRkssRUFHTCxZQUhLLEVBSUwsY0FKSyxFQUtMLGVBTEssRUFNTCxnQkFOSyxFQU9MLGlCQVBLLENBREE7QUFVUEMsY0FBUTtBQUNOQyw2QkFBcUIsT0FEZjtBQUVOQyxzQ0FBOEIsTUFGeEI7QUFHTkMsZ0NBQXdCLE1BSGxCO0FBSU5DLGdDQUF3QjtBQUpsQixPQVZEO0FBZ0JQQyxjQUFRO0FBQ05DLHVCQUFlLFNBRFQ7QUFFTkMsY0FBTSxDQUNKO0FBQ0VDLG9CQUFVLGFBRFo7QUFFRUMsZ0JBQU0sSUFGUjtBQUdFQyxvQkFBVSxpQkFIWjtBQUlFQyw0QkFBa0I7QUFKcEIsU0FESSxFQU9KO0FBQ0VILG9CQUFVLGNBRFo7QUFFRUMsZ0JBQU0sTUFGUjtBQUdFQyxvQkFBVSxvQkFIWjtBQUlFQyw0QkFBa0I7QUFKcEIsU0FQSSxFQWFKO0FBQ0VILG9CQUFVLFlBRFo7QUFFRUMsZ0JBQU0sTUFGUjtBQUdFQyxvQkFBVSxpQkFIWjtBQUlFQyw0QkFBa0I7QUFKcEIsU0FiSTtBQUZBO0FBaEJELEssUUFvRVRDLFUsR0FBYTtBQUNYQyxnQkFBVSxJQURDO0FBRVhDLGNBQVE7QUFGRyxLOzs7OzsrQkEzQkQ7QUFDVixVQUFJQyxPQUFPLElBQVg7QUFDQTtBQUNBQyxTQUFHQyxLQUFILENBQVM7QUFDUEMsaUJBQVMsc0JBQU87QUFDZCxjQUFJQyxJQUFJQyxJQUFSLEVBQWM7QUFDWjtBQUNBSixlQUFHSyxPQUFILENBQVc7QUFDVEMsbUJBQUsscUNBREk7QUFFVEMsb0JBQU07QUFDSkgsc0JBQU1ELElBQUlDO0FBRE4sZUFGRztBQUtUSSxzQkFBUTtBQUNOLGdDQUFnQjtBQURWLGVBTEM7QUFRVE4sdUJBQVMsaUJBQVVDLEdBQVYsRUFBZTtBQUN0Qk0sd0JBQVFDLEdBQVIsQ0FBWVAsSUFBSUksSUFBSixDQUFTSSxPQUFyQjtBQUNBWixxQkFBS0gsVUFBTCxDQUFnQkUsTUFBaEIsR0FBeUJLLElBQUlJLElBQUosQ0FBU0ksT0FBVCxDQUFpQmIsTUFBMUM7QUFDRDtBQVhRLGFBQVg7QUFhRCxXQWZELE1BZU87QUFDTFcsb0JBQVFDLEdBQVIsQ0FBWSxVQUFVUCxJQUFJUyxNQUExQjtBQUNEO0FBQ0Y7QUFwQk0sT0FBVDtBQXNCRDs7OztFQW5FMEIsZUFBS0MsRyIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB3ZXB5IGZyb20gJ3dlcHknXG5pbXBvcnQgJ3dlcHktYXN5bmMtZnVuY3Rpb24nXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgd2VweS5hcHAge1xuICBjb25maWcgPSB7XG4gICAgcGFnZXM6IFtcbiAgICAgICdwYWdlcy9pbmRleCcsXG4gICAgICAncGFnZXMvYXJ0aWNsZScsXG4gICAgICAncGFnZXMvdXNlcicsXG4gICAgICAncGFnZXMvc2VsZWN0JyxcbiAgICAgICdwYWdlcy9kaXNjZXJuJyxcbiAgICAgICdwYWdlcy93cml0ZU9uZScsXG4gICAgICAncGFnZXMvd3JpdGVNb3JlJ1xuICAgIF0sXG4gICAgd2luZG93OiB7XG4gICAgICBiYWNrZ3JvdW5kVGV4dFN0eWxlOiAnbGlnaHQnLFxuICAgICAgbmF2aWdhdGlvbkJhckJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxuICAgICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+acuuWZqOWtpuS5oCcsXG4gICAgICBuYXZpZ2F0aW9uQmFyVGV4dFN0eWxlOiAnYmxhY2snXG4gICAgfSxcbiAgICB0YWJCYXI6IHtcbiAgICAgIHNlbGVjdGVkQ29sb3I6ICcjMUFBRDE2JyxcbiAgICAgIGxpc3Q6IFtcbiAgICAgICAge1xuICAgICAgICAgIHBhZ2VQYXRoOiAncGFnZXMvaW5kZXgnLFxuICAgICAgICAgIHRleHQ6ICfmlofnq6AnLFxuICAgICAgICAgIGljb25QYXRoOiAnaW1hZ2VzL25ld3MucG5nJyxcbiAgICAgICAgICBzZWxlY3RlZEljb25QYXRoOiAnaW1hZ2VzL25ld3Nfcy5wbmcnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwYWdlUGF0aDogJ3BhZ2VzL3NlbGVjdCcsXG4gICAgICAgICAgdGV4dDogJ+ivhuWIq+S4reW/gycsXG4gICAgICAgICAgaWNvblBhdGg6ICdpbWFnZXMvZGlzY2Vybi5wbmcnLFxuICAgICAgICAgIHNlbGVjdGVkSWNvblBhdGg6ICdpbWFnZXMvZGlzY2Vybl9zLnBuZydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHBhZ2VQYXRoOiAncGFnZXMvdXNlcicsXG4gICAgICAgICAgdGV4dDogJ+S4quS6uuS4reW/gycsXG4gICAgICAgICAgaWNvblBhdGg6ICdpbWFnZXMvdXNlci5wbmcnLFxuICAgICAgICAgIHNlbGVjdGVkSWNvblBhdGg6ICdpbWFnZXMvdXNlcl9zLnBuZydcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgfVxuXG4gIG9uTGF1bmNoICgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICAvLyDnmbvlvZVcbiAgICB3eC5sb2dpbih7XG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICBpZiAocmVzLmNvZGUpIHtcbiAgICAgICAgICAvLyDlj5HpgIEgcmVzLmNvZGUg5Yiw5ZCO5Y+w5o2i5Y+WIG9wZW5JZCwgc2Vzc2lvbktleSwgdW5pb25JZFxuICAgICAgICAgIHd4LnJlcXVlc3Qoe1xuICAgICAgICAgICAgdXJsOiAnaHR0cDovLzEwNi4xNC4xNDUuMjE4OjkxMDAvd3hfbG9naW4nLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBjb2RlOiByZXMuY29kZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhlYWRlcjoge1xuICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YS5jb250ZW50KVxuICAgICAgICAgICAgICB0aGF0Lmdsb2JhbERhdGEub3BlbklkID0gcmVzLmRhdGEuY29udGVudC5vcGVuSWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCfnmbvlvZXlpLHotKXvvIEnICsgcmVzLmVyck1zZylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBnbG9iYWxEYXRhID0ge1xuICAgIHVzZXJJbmZvOiBudWxsLFxuICAgIG9wZW5JZDogJydcbiAgfVxufVxuIl19