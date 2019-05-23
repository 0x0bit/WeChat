'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Article = function (_wepy$page) {
  _inherits(Article, _wepy$page);

  function Article() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Article);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Article.__proto__ || Object.getPrototypeOf(Article)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
      navigationBarTitleText: '机器学习文章'
    }, _this.data = {
      detail: {
        content: '<article_content ><para><href></href><img><url></url><desc></desc></img></para><para ><sent><![CDATA[ ]]></sent></para></article_content>',
        articleId: null,
        title: ''
      }
    }, _this.methods = {
      finish: function finish() {
        wx.navigateBack({
          delta: 1
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Article, [{
    key: 'onLoad',
    value: function onLoad() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      wx.showLoading({
        title: '加载中'
      });
      options.id = options.id;
      wx.request({
        url: 'http://106.14.145.218:9100/article/details?articleid=' + options.id,
        success: function success(res) {
          if (res.data.success) {
            _this2.detail = res.data.content.article;
          }
          _this2.$apply();
          wx.hideLoading();
        }
      });
    }
  }]);

  return Article;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Article , 'pages/article'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFydGljbGUuanMiXSwibmFtZXMiOlsiQXJ0aWNsZSIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJkYXRhIiwiZGV0YWlsIiwiY29udGVudCIsImFydGljbGVJZCIsInRpdGxlIiwibWV0aG9kcyIsImZpbmlzaCIsInd4IiwibmF2aWdhdGVCYWNrIiwiZGVsdGEiLCJvcHRpb25zIiwic2hvd0xvYWRpbmciLCJpZCIsInJlcXVlc3QiLCJ1cmwiLCJzdWNjZXNzIiwicmVzIiwiYXJ0aWNsZSIsIiRhcHBseSIsImhpZGVMb2FkaW5nIiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUNxQkEsTzs7Ozs7Ozs7Ozs7Ozs7d0xBQ25CQyxNLEdBQVM7QUFDUEMsOEJBQXdCO0FBRGpCLEssUUFHVEMsSSxHQUFPO0FBQ0xDLGNBQVE7QUFDTkMsaUJBQ0UsMklBRkk7QUFHTkMsbUJBQVcsSUFITDtBQUlOQyxlQUFPO0FBSkQ7QUFESCxLLFFBU1BDLE8sR0FBVTtBQUNSQyxZQURRLG9CQUNDO0FBQ1BDLFdBQUdDLFlBQUgsQ0FBZ0I7QUFDZEMsaUJBQU87QUFETyxTQUFoQjtBQUdEO0FBTE8sSzs7Ozs7NkJBUVc7QUFBQTs7QUFBQSxVQUFkQyxPQUFjLHVFQUFKLEVBQUk7O0FBQ25CSCxTQUFHSSxXQUFILENBQWU7QUFDYlAsZUFBTztBQURNLE9BQWY7QUFHQU0sY0FBUUUsRUFBUixHQUFhRixRQUFRRSxFQUFyQjtBQUNBTCxTQUFHTSxPQUFILENBQVc7QUFDVEMsdUVBQTZESixRQUFRRSxFQUQ1RDtBQUVURyxpQkFBUyxzQkFBTztBQUNkLGNBQUlDLElBQUloQixJQUFKLENBQVNlLE9BQWIsRUFBc0I7QUFDcEIsbUJBQUtkLE1BQUwsR0FBY2UsSUFBSWhCLElBQUosQ0FBU0UsT0FBVCxDQUFpQmUsT0FBL0I7QUFDRDtBQUNELGlCQUFLQyxNQUFMO0FBQ0FYLGFBQUdZLFdBQUg7QUFDRDtBQVJRLE9BQVg7QUFVRDs7OztFQXBDa0MsZUFBS0MsSTs7a0JBQXJCdkIsTyIsImZpbGUiOiJhcnRpY2xlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgd2VweSBmcm9tICd3ZXB5J1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXJ0aWNsZSBleHRlbmRzIHdlcHkucGFnZSB7XG4gIGNvbmZpZyA9IHtcbiAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5py65Zmo5a2m5Lmg5paH56ugJ1xuICB9O1xuICBkYXRhID0ge1xuICAgIGRldGFpbDoge1xuICAgICAgY29udGVudDpcbiAgICAgICAgJzxhcnRpY2xlX2NvbnRlbnQgPjxwYXJhPjxocmVmPjwvaHJlZj48aW1nPjx1cmw+PC91cmw+PGRlc2M+PC9kZXNjPjwvaW1nPjwvcGFyYT48cGFyYSA+PHNlbnQ+PCFbQ0RBVEFbIF1dPjwvc2VudD48L3BhcmE+PC9hcnRpY2xlX2NvbnRlbnQ+JyxcbiAgICAgIGFydGljbGVJZDogbnVsbCxcbiAgICAgIHRpdGxlOiAnJ1xuICAgIH1cbiAgfVxuXG4gIG1ldGhvZHMgPSB7XG4gICAgZmluaXNoKCkge1xuICAgICAgd3gubmF2aWdhdGVCYWNrKHtcbiAgICAgICAgZGVsdGE6IDFcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgb25Mb2FkKG9wdGlvbnMgPSB7fSkge1xuICAgIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgIHRpdGxlOiAn5Yqg6L295LitJ1xuICAgIH0pXG4gICAgb3B0aW9ucy5pZCA9IG9wdGlvbnMuaWRcbiAgICB3eC5yZXF1ZXN0KHtcbiAgICAgIHVybDogYGh0dHA6Ly8xMDYuMTQuMTQ1LjIxODo5MTAwL2FydGljbGUvZGV0YWlscz9hcnRpY2xlaWQ9JHtvcHRpb25zLmlkfWAsXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICBpZiAocmVzLmRhdGEuc3VjY2Vzcykge1xuICAgICAgICAgIHRoaXMuZGV0YWlsID0gcmVzLmRhdGEuY29udGVudC5hcnRpY2xlXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kYXBwbHkoKVxuICAgICAgICB3eC5oaWRlTG9hZGluZygpXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuIl19