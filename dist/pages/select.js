'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Select = function (_wepy$page) {
  _inherits(Select, _wepy$page);

  function Select() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Select);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Select.__proto__ || Object.getPrototypeOf(Select)).call.apply(_ref, [this].concat(args))), _this), _this.methods = {
      tap: function tap(id) {
        wx.navigateTo({
          // 打开一个新的同路由页面，但指定不同的数据初始值
          url: '/pages/discern?id=' + id
        });
      },
      writeOne: function writeOne() {
        wx.navigateTo({
          url: '/pages/writeOne'
        });
      },
      writeMore: function writeMore() {
        wx.navigateTo({
          url: '/pages/writeMore'
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  return Select;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Select , 'pages/select'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlbGVjdC5qcyJdLCJuYW1lcyI6WyJTZWxlY3QiLCJtZXRob2RzIiwidGFwIiwiaWQiLCJ3eCIsIm5hdmlnYXRlVG8iLCJ1cmwiLCJ3cml0ZU9uZSIsIndyaXRlTW9yZSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDRTs7Ozs7Ozs7Ozs7O0lBQ3FCQSxNOzs7Ozs7Ozs7Ozs7OztzTEFDbkJDLE8sR0FBUTtBQUNOQyxTQURNLGVBQ0ZDLEVBREUsRUFDRTtBQUNOQyxXQUFHQyxVQUFILENBQWM7QUFDWDtBQUNEQyxlQUFLLHVCQUF1Qkg7QUFGaEIsU0FBZDtBQUlELE9BTks7QUFPTkksY0FQTSxzQkFPSztBQUNUSCxXQUFHQyxVQUFILENBQWM7QUFDWkMsZUFBSztBQURPLFNBQWQ7QUFHRCxPQVhLO0FBYU5FLGVBYk0sdUJBYU07QUFDVkosV0FBR0MsVUFBSCxDQUFjO0FBQ1pDLGVBQUs7QUFETyxTQUFkO0FBR0Q7QUFqQkssSzs7OztFQUQwQixlQUFLRyxJOztrQkFBcEJULE0iLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4gIGltcG9ydCB3ZXB5IGZyb20gJ3dlcHknXG4gIGV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdCBleHRlbmRzIHdlcHkucGFnZSB7XG4gICAgbWV0aG9kcz17XG4gICAgICB0YXAoaWQpIHtcbiAgICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgICAgIC8vIOaJk+W8gOS4gOS4quaWsOeahOWQjOi3r+eUsemhtemdou+8jOS9huaMh+WumuS4jeWQjOeahOaVsOaNruWIneWni+WAvFxuICAgICAgICAgIHVybDogJy9wYWdlcy9kaXNjZXJuP2lkPScgKyBpZFxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICAgIHdyaXRlT25lKCkge1xuICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgICB1cmw6ICcvcGFnZXMvd3JpdGVPbmUnXG4gICAgICAgIH0pXG4gICAgICB9LFxuXG4gICAgICB3cml0ZU1vcmUoKSB7XG4gICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICAgIHVybDogJy9wYWdlcy93cml0ZU1vcmUnXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9XG4iXX0=