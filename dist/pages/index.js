'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

var _card = require('./../components/card.js');

var _card2 = _interopRequireDefault(_card);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Index = function (_wepy$page) {
  _inherits(Index, _wepy$page);

  function Index() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Index);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Index.__proto__ || Object.getPrototypeOf(Index)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
      navigationBarTitleText: '最新文章列表',
      window: {
        enablePullDownRefresh: true
      }
    }, _this.$repeat = { "detail": { "com": "card", "props": "" } }, _this.$props = { "card": { "xmlns:v-bind": { "value": "", "for": "detail.objects", "item": "item", "index": "index", "key": "key" }, "v-bind:title.once": { "value": "item.title", "for": "detail.objects", "item": "item", "index": "index", "key": "key" }, "v-bind:content.once": { "value": "item.summary", "for": "detail.objects", "item": "item", "index": "index", "key": "key" }, "v-bind:thumbnail.once": { "value": "item.thumbnail_urls", "for": "detail.objects", "item": "item", "index": "index", "key": "key" } } }, _this.$events = {}, _this.components = {
      card: _card2.default
    }, _this.data = {
      detail: {
        objects: []
      },
      isLoadingMore: false,
      currentPage: 1,
      info: ''
    }, _this.computed = {
      swiperObjects: function swiperObjects() {
        return this.data.detail.objects.slice(0, 5); // 轮播图只取5个，要不然太多了
      }
    }, _this.methods = {
      tap: function tap(id) {
        wx.navigateTo({
          url: '/pages/article?id=' + id // 打开一个新的同路由页面，但指定不同的数据初始值
        });
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Index, [{
    key: 'onLoad',
    value: function onLoad() {
      wx.showLoading({
        title: '加载中'
      });
      this.loadList();
    }
  }, {
    key: 'onPullDownRefresh',
    value: function onPullDownRefresh() {
      wx.stopPullDownRefresh();
    }
  }, {
    key: 'onReachBottom',
    value: function onReachBottom() {
      this.currentPage++;
      if (this.currentPage >= 10) {
        // 最多只能加载10页
        this.isLoadingMore = false;
        this.info = 'No more news';
        this.$apply();
        return;
      }
      this.isLoadingMore = true;
      this.loadList();
    }
  }, {
    key: 'onShareAppMessage',
    value: function onShareAppMessage() {
      return {
        title: '文章列表',
        path: '/pages/index'
      };
    }
  }, {
    key: 'loadList',
    value: function loadList() {
      var _this2 = this;

      wx.request({
        url: 'http://106.14.145.218:9100/article/list?pageSize=10&page=' + this.currentPage,
        success: function success(res) {
          if (res.data.success) {
            console.log(res.data.content.list);
            _this2.detail.objects = _this2.detail.objects.concat(res.data.content.list);
          }
          _this2.$apply();
          wx.hideLoading();
        }
      });
    }
  }]);

  return Index;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Index , 'pages/index'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIkluZGV4IiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsIndpbmRvdyIsImVuYWJsZVB1bGxEb3duUmVmcmVzaCIsIiRyZXBlYXQiLCIkcHJvcHMiLCIkZXZlbnRzIiwiY29tcG9uZW50cyIsImNhcmQiLCJkYXRhIiwiZGV0YWlsIiwib2JqZWN0cyIsImlzTG9hZGluZ01vcmUiLCJjdXJyZW50UGFnZSIsImluZm8iLCJjb21wdXRlZCIsInN3aXBlck9iamVjdHMiLCJzbGljZSIsIm1ldGhvZHMiLCJ0YXAiLCJpZCIsInd4IiwibmF2aWdhdGVUbyIsInVybCIsInNob3dMb2FkaW5nIiwidGl0bGUiLCJsb2FkTGlzdCIsInN0b3BQdWxsRG93blJlZnJlc2giLCIkYXBwbHkiLCJwYXRoIiwicmVxdWVzdCIsInN1Y2Nlc3MiLCJyZXMiLCJjb25zb2xlIiwibG9nIiwiY29udGVudCIsImxpc3QiLCJjb25jYXQiLCJoaWRlTG9hZGluZyIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVxQkEsSzs7Ozs7Ozs7Ozs7Ozs7b0xBQ25CQyxNLEdBQVM7QUFDUEMsOEJBQXdCLFFBRGpCO0FBRVBDLGNBQVE7QUFDTkMsK0JBQXVCO0FBRGpCO0FBRkQsSyxRQU1WQyxPLEdBQVUsRUFBQyxVQUFTLEVBQUMsT0FBTSxNQUFQLEVBQWMsU0FBUSxFQUF0QixFQUFWLEUsUUFDWEMsTSxHQUFTLEVBQUMsUUFBTyxFQUFDLGdCQUFlLEVBQUMsU0FBUSxFQUFULEVBQVksT0FBTSxnQkFBbEIsRUFBbUMsUUFBTyxNQUExQyxFQUFpRCxTQUFRLE9BQXpELEVBQWlFLE9BQU0sS0FBdkUsRUFBaEIsRUFBOEYscUJBQW9CLEVBQUMsU0FBUSxZQUFULEVBQXNCLE9BQU0sZ0JBQTVCLEVBQTZDLFFBQU8sTUFBcEQsRUFBMkQsU0FBUSxPQUFuRSxFQUEyRSxPQUFNLEtBQWpGLEVBQWxILEVBQTBNLHVCQUFzQixFQUFDLFNBQVEsY0FBVCxFQUF3QixPQUFNLGdCQUE5QixFQUErQyxRQUFPLE1BQXRELEVBQTZELFNBQVEsT0FBckUsRUFBNkUsT0FBTSxLQUFuRixFQUFoTyxFQUEwVCx5QkFBd0IsRUFBQyxTQUFRLHFCQUFULEVBQStCLE9BQU0sZ0JBQXJDLEVBQXNELFFBQU8sTUFBN0QsRUFBb0UsU0FBUSxPQUE1RSxFQUFvRixPQUFNLEtBQTFGLEVBQWxWLEVBQVIsRSxRQUNUQyxPLEdBQVUsRSxRQUNUQyxVLEdBQWE7QUFDVkM7QUFEVSxLLFFBR1pDLEksR0FBTztBQUNMQyxjQUFRO0FBQ05DLGlCQUFTO0FBREgsT0FESDtBQUlMQyxxQkFBZSxLQUpWO0FBS0xDLG1CQUFhLENBTFI7QUFNTEMsWUFBTTtBQU5ELEssUUFRUEMsUSxHQUFTO0FBQ1BDLG1CQURPLDJCQUNTO0FBQ2QsZUFBTyxLQUFLUCxJQUFMLENBQVVDLE1BQVYsQ0FBaUJDLE9BQWpCLENBQXlCTSxLQUF6QixDQUErQixDQUEvQixFQUFrQyxDQUFsQyxDQUFQLENBRGMsQ0FDOEI7QUFDN0M7QUFITSxLLFFBS1RDLE8sR0FBUTtBQUNOQyxTQURNLGVBQ0ZDLEVBREUsRUFDRTtBQUNOQyxXQUFHQyxVQUFILENBQWM7QUFDWkMsc0NBQTBCSCxFQURkLENBQ29CO0FBRHBCLFNBQWQ7QUFHRDtBQUxLLEs7Ozs7OzZCQU9DO0FBQ1BDLFNBQUdHLFdBQUgsQ0FBZTtBQUNiQyxlQUFPO0FBRE0sT0FBZjtBQUdBLFdBQUtDLFFBQUw7QUFDRDs7O3dDQUNtQjtBQUNsQkwsU0FBR00sbUJBQUg7QUFDRDs7O29DQUNlO0FBQ2QsV0FBS2QsV0FBTDtBQUNBLFVBQUksS0FBS0EsV0FBTCxJQUFvQixFQUF4QixFQUE0QjtBQUFFO0FBQzVCLGFBQUtELGFBQUwsR0FBcUIsS0FBckI7QUFDQSxhQUFLRSxJQUFMLEdBQVksY0FBWjtBQUNBLGFBQUtjLE1BQUw7QUFDQTtBQUNEO0FBQ0QsV0FBS2hCLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxXQUFLYyxRQUFMO0FBQ0Q7Ozt3Q0FDbUI7QUFDbEIsYUFBTztBQUNMRCxlQUFPLE1BREY7QUFFTEksY0FBTTtBQUZELE9BQVA7QUFJRDs7OytCQUNVO0FBQUE7O0FBQ1RSLFNBQUdTLE9BQUgsQ0FBVztBQUNUUCwyRUFBaUUsS0FBS1YsV0FEN0Q7QUFFVGtCLGlCQUFTLGlCQUFDQyxHQUFELEVBQVM7QUFDaEIsY0FBSUEsSUFBSXZCLElBQUosQ0FBU3NCLE9BQWIsRUFBc0I7QUFDcEJFLG9CQUFRQyxHQUFSLENBQVlGLElBQUl2QixJQUFKLENBQVMwQixPQUFULENBQWlCQyxJQUE3QjtBQUNBLG1CQUFLMUIsTUFBTCxDQUFZQyxPQUFaLEdBQXNCLE9BQUtELE1BQUwsQ0FBWUMsT0FBWixDQUFvQjBCLE1BQXBCLENBQTJCTCxJQUFJdkIsSUFBSixDQUFTMEIsT0FBVCxDQUFpQkMsSUFBNUMsQ0FBdEI7QUFDRDtBQUNELGlCQUFLUixNQUFMO0FBQ0FQLGFBQUdpQixXQUFIO0FBQ0Q7QUFUUSxPQUFYO0FBV0Q7Ozs7RUF2RWdDLGVBQUtDLEk7O2tCQUFuQnhDLEsiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB3ZXB5IGZyb20gJ3dlcHknXG5pbXBvcnQgQ2FyZCBmcm9tICcuLi9jb21wb25lbnRzL2NhcmQnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZGV4IGV4dGVuZHMgd2VweS5wYWdlIHtcbiAgY29uZmlnID0ge1xuICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfmnIDmlrDmlofnq6DliJfooagnLFxuICAgIHdpbmRvdzoge1xuICAgICAgZW5hYmxlUHVsbERvd25SZWZyZXNoOiB0cnVlXG4gICAgfVxuICB9XG4gJHJlcGVhdCA9IHtcImRldGFpbFwiOntcImNvbVwiOlwiY2FyZFwiLFwicHJvcHNcIjpcIlwifX07XHJcbiRwcm9wcyA9IHtcImNhcmRcIjp7XCJ4bWxuczp2LWJpbmRcIjp7XCJ2YWx1ZVwiOlwiXCIsXCJmb3JcIjpcImRldGFpbC5vYmplY3RzXCIsXCJpdGVtXCI6XCJpdGVtXCIsXCJpbmRleFwiOlwiaW5kZXhcIixcImtleVwiOlwia2V5XCJ9LFwidi1iaW5kOnRpdGxlLm9uY2VcIjp7XCJ2YWx1ZVwiOlwiaXRlbS50aXRsZVwiLFwiZm9yXCI6XCJkZXRhaWwub2JqZWN0c1wiLFwiaXRlbVwiOlwiaXRlbVwiLFwiaW5kZXhcIjpcImluZGV4XCIsXCJrZXlcIjpcImtleVwifSxcInYtYmluZDpjb250ZW50Lm9uY2VcIjp7XCJ2YWx1ZVwiOlwiaXRlbS5zdW1tYXJ5XCIsXCJmb3JcIjpcImRldGFpbC5vYmplY3RzXCIsXCJpdGVtXCI6XCJpdGVtXCIsXCJpbmRleFwiOlwiaW5kZXhcIixcImtleVwiOlwia2V5XCJ9LFwidi1iaW5kOnRodW1ibmFpbC5vbmNlXCI6e1widmFsdWVcIjpcIml0ZW0udGh1bWJuYWlsX3VybHNcIixcImZvclwiOlwiZGV0YWlsLm9iamVjdHNcIixcIml0ZW1cIjpcIml0ZW1cIixcImluZGV4XCI6XCJpbmRleFwiLFwia2V5XCI6XCJrZXlcIn19fTtcclxuJGV2ZW50cyA9IHt9O1xyXG4gY29tcG9uZW50cyA9IHtcbiAgICBjYXJkOiBDYXJkXG4gIH1cbiAgZGF0YSA9IHtcbiAgICBkZXRhaWw6IHtcbiAgICAgIG9iamVjdHM6IFtdXG4gICAgfSxcbiAgICBpc0xvYWRpbmdNb3JlOiBmYWxzZSxcbiAgICBjdXJyZW50UGFnZTogMSxcbiAgICBpbmZvOiAnJ1xuICB9XG4gIGNvbXB1dGVkPXtcbiAgICBzd2lwZXJPYmplY3RzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YS5kZXRhaWwub2JqZWN0cy5zbGljZSgwLCA1KSAvLyDova7mkq3lm77lj6rlj5Y15Liq77yM6KaB5LiN54S25aSq5aSa5LqGXG4gICAgfVxuICB9XG4gIG1ldGhvZHM9e1xuICAgIHRhcChpZCkge1xuICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgIHVybDogYC9wYWdlcy9hcnRpY2xlP2lkPSR7aWR9YCAgLy8g5omT5byA5LiA5Liq5paw55qE5ZCM6Lev55Sx6aG16Z2i77yM5L2G5oyH5a6a5LiN5ZCM55qE5pWw5o2u5Yid5aeL5YC8XG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBvbkxvYWQoKSB7XG4gICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgdGl0bGU6ICfliqDovb3kuK0nXG4gICAgfSlcbiAgICB0aGlzLmxvYWRMaXN0KClcbiAgfVxuICBvblB1bGxEb3duUmVmcmVzaCgpIHtcbiAgICB3eC5zdG9wUHVsbERvd25SZWZyZXNoKClcbiAgfVxuICBvblJlYWNoQm90dG9tKCkge1xuICAgIHRoaXMuY3VycmVudFBhZ2UrK1xuICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID49IDEwKSB7IC8vIOacgOWkmuWPquiDveWKoOi9vTEw6aG1XG4gICAgICB0aGlzLmlzTG9hZGluZ01vcmUgPSBmYWxzZVxuICAgICAgdGhpcy5pbmZvID0gJ05vIG1vcmUgbmV3cydcbiAgICAgIHRoaXMuJGFwcGx5KClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLmlzTG9hZGluZ01vcmUgPSB0cnVlXG4gICAgdGhpcy5sb2FkTGlzdCgpXG4gIH1cbiAgb25TaGFyZUFwcE1lc3NhZ2UoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRpdGxlOiAn5paH56ug5YiX6KGoJyxcbiAgICAgIHBhdGg6ICcvcGFnZXMvaW5kZXgnXG4gICAgfVxuICB9XG4gIGxvYWRMaXN0KCkge1xuICAgIHd4LnJlcXVlc3Qoe1xuICAgICAgdXJsOiBgaHR0cDovLzEwNi4xNC4xNDUuMjE4OjkxMDAvYXJ0aWNsZS9saXN0P3BhZ2VTaXplPTEwJnBhZ2U9JHt0aGlzLmN1cnJlbnRQYWdlfWAsXG4gICAgICBzdWNjZXNzOiAocmVzKSA9PiB7XG4gICAgICAgIGlmIChyZXMuZGF0YS5zdWNjZXNzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEuY29udGVudC5saXN0KVxuICAgICAgICAgIHRoaXMuZGV0YWlsLm9iamVjdHMgPSB0aGlzLmRldGFpbC5vYmplY3RzLmNvbmNhdChyZXMuZGF0YS5jb250ZW50Lmxpc3QpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kYXBwbHkoKVxuICAgICAgICB3eC5oaWRlTG9hZGluZygpXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuIl19