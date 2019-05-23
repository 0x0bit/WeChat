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

var Write = function (_wepy$page) {
  _inherits(Write, _wepy$page);

  function Write() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Write);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Write.__proto__ || Object.getPrototypeOf(Write)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
      navigationBarTitleText: '手写识别'
    }, _this.data = {
      url: '',
      imageBool: false,
      resultBool: false,
      imgdata: '',
      result: ''
    }, _this.methods = {
      finish: function finish() {
        wx.navigateBack({
          delta: 1
        });
      },


      /**
       * 选择图片
       */
      uploadPhoto: function uploadPhoto() {
        var _this2 = this;

        wx.chooseImage({
          count: 1,
          sourceType: ['album', 'camera'],
          success: function success(res) {
            wx.showLoading({
              title: '上传中🤔🤔🤔'
            });
            _this2.url = res.tempFilePaths[0];
            _this2.imageBool = true;
            var data = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64');
            _this2.imgdata = data;
            _this2.$apply();
          },
          fail: function fail() {
            wx.showModal({
              title: '图片上传失败☹️',
              content: '您图片上传失败了☹️'
            });
          },
          complete: function complete() {
            wx.hideLoading();
          }
        });
      },

      /**
       * 图片识别
       */
      uploadImage: function uploadImage() {
        this.getDisCernByImg();
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Write, [{
    key: 'getDisCernByImg',


    /**
    * 图片请求
    */
    value: function getDisCernByImg() {
      if (this.url === '') {
        wx.showModal({
          title: '好歹你也给我个图片啊😫',
          content: '你不给我图片臣妾没办法识别啊☹️'
        });
        return;
      }

      wx.showLoading({
        title: '识别中😎😎😎'
      });
      var that = this;
      wx.request({
        url: 'http://123.207.228.200:9100/write',
        method: 'post',
        data: { imgData: this.imgdata },
        success: function success(res) {
          if (res.data.content.code === 200) {
            that.resultBool = true;
            that.result = res.data.content.data;
          } else {
            wx.showModal({
              title: '识别失败😭',
              content: '图片格式不正确'
            });
          }
          that.$apply();
        },
        fail: function fail() {
          wx.showModal({
            title: '识别失败☹️',
            content: '抱歉，可能服务器出小差了🤔'
          });
        },
        complete: function complete() {
          wx.hideLoading();
        }
      });
    }
  }]);

  return Write;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Write , 'pages/write'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndyaXRlLmpzIl0sIm5hbWVzIjpbIldyaXRlIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsImRhdGEiLCJ1cmwiLCJpbWFnZUJvb2wiLCJyZXN1bHRCb29sIiwiaW1nZGF0YSIsInJlc3VsdCIsIm1ldGhvZHMiLCJmaW5pc2giLCJ3eCIsIm5hdmlnYXRlQmFjayIsImRlbHRhIiwidXBsb2FkUGhvdG8iLCJjaG9vc2VJbWFnZSIsImNvdW50Iiwic291cmNlVHlwZSIsInN1Y2Nlc3MiLCJzaG93TG9hZGluZyIsInRpdGxlIiwicmVzIiwidGVtcEZpbGVQYXRocyIsImdldEZpbGVTeXN0ZW1NYW5hZ2VyIiwicmVhZEZpbGVTeW5jIiwiJGFwcGx5IiwiZmFpbCIsInNob3dNb2RhbCIsImNvbnRlbnQiLCJjb21wbGV0ZSIsImhpZGVMb2FkaW5nIiwidXBsb2FkSW1hZ2UiLCJnZXREaXNDZXJuQnlJbWciLCJ0aGF0IiwicmVxdWVzdCIsIm1ldGhvZCIsImltZ0RhdGEiLCJjb2RlIiwicGFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUNxQkEsSzs7Ozs7Ozs7Ozs7Ozs7b0xBQ25CQyxNLEdBQVM7QUFDUEMsOEJBQXdCO0FBRGpCLEssUUFJVEMsSSxHQUFPO0FBQ0xDLFdBQUssRUFEQTtBQUVMQyxpQkFBVyxLQUZOO0FBR0xDLGtCQUFZLEtBSFA7QUFJTEMsZUFBUyxFQUpKO0FBS0xDLGNBQVE7QUFMSCxLLFFBUVBDLE8sR0FBVTtBQUNSQyxZQURRLG9CQUNDO0FBQ1BDLFdBQUdDLFlBQUgsQ0FBZ0I7QUFDZEMsaUJBQU87QUFETyxTQUFoQjtBQUdELE9BTE87OztBQU9SOzs7QUFHQUMsaUJBVlEseUJBVU07QUFBQTs7QUFDWkgsV0FBR0ksV0FBSCxDQUFlO0FBQ2JDLGlCQUFPLENBRE07QUFFYkMsc0JBQVksQ0FBQyxPQUFELEVBQVUsUUFBVixDQUZDO0FBR2JDLG1CQUFTLHNCQUFPO0FBQ2RQLGVBQUdRLFdBQUgsQ0FBZTtBQUNiQyxxQkFBTztBQURNLGFBQWY7QUFHQSxtQkFBS2hCLEdBQUwsR0FBV2lCLElBQUlDLGFBQUosQ0FBa0IsQ0FBbEIsQ0FBWDtBQUNBLG1CQUFLakIsU0FBTCxHQUFpQixJQUFqQjtBQUNBLGdCQUFJRixPQUFPUSxHQUFHWSxvQkFBSCxHQUEwQkMsWUFBMUIsQ0FBdUNILElBQUlDLGFBQUosQ0FBa0IsQ0FBbEIsQ0FBdkMsRUFBNkQsUUFBN0QsQ0FBWDtBQUNBLG1CQUFLZixPQUFMLEdBQWVKLElBQWY7QUFDQSxtQkFBS3NCLE1BQUw7QUFDRCxXQVpZO0FBYWJDLGNBYmEsa0JBYU47QUFDTGYsZUFBR2dCLFNBQUgsQ0FBYTtBQUNYUCxxQkFBTyxVQURJO0FBRVhRLHVCQUFTO0FBRkUsYUFBYjtBQUlELFdBbEJZO0FBbUJiQyxrQkFuQmEsc0JBbUJGO0FBQ1RsQixlQUFHbUIsV0FBSDtBQUNEO0FBckJZLFNBQWY7QUF1QkQsT0FsQ087O0FBbUNSOzs7QUFHQUMsaUJBdENRLHlCQXNDTTtBQUNaLGFBQUtDLGVBQUw7QUFDRDtBQXhDTyxLOzs7Ozs7O0FBMkNSOzs7c0NBR2dCO0FBQ2hCLFVBQUksS0FBSzVCLEdBQUwsS0FBYSxFQUFqQixFQUFxQjtBQUNuQk8sV0FBR2dCLFNBQUgsQ0FBYTtBQUNYUCxpQkFBTyxjQURJO0FBRVhRLG1CQUFTO0FBRkUsU0FBYjtBQUlBO0FBQ0Q7O0FBRURqQixTQUFHUSxXQUFILENBQWU7QUFDYkMsZUFBTztBQURNLE9BQWY7QUFHQSxVQUFJYSxPQUFPLElBQVg7QUFDQXRCLFNBQUd1QixPQUFILENBQVc7QUFDVDlCLGFBQUssbUNBREk7QUFFVCtCLGdCQUFRLE1BRkM7QUFHVGhDLGNBQU0sRUFBQ2lDLFNBQVMsS0FBSzdCLE9BQWYsRUFIRztBQUlUVyxlQUpTLG1CQUlERyxHQUpDLEVBSUk7QUFDWCxjQUFJQSxJQUFJbEIsSUFBSixDQUFTeUIsT0FBVCxDQUFpQlMsSUFBakIsS0FBMEIsR0FBOUIsRUFBbUM7QUFDakNKLGlCQUFLM0IsVUFBTCxHQUFrQixJQUFsQjtBQUNBMkIsaUJBQUt6QixNQUFMLEdBQWNhLElBQUlsQixJQUFKLENBQVN5QixPQUFULENBQWlCekIsSUFBL0I7QUFDRCxXQUhELE1BR087QUFDTFEsZUFBR2dCLFNBQUgsQ0FBYTtBQUNYUCxxQkFBTyxRQURJO0FBRVhRLHVCQUFTO0FBRkUsYUFBYjtBQUlEO0FBQ0RLLGVBQUtSLE1BQUw7QUFDRCxTQWZRO0FBZ0JUQyxZQWhCUyxrQkFnQkY7QUFDTGYsYUFBR2dCLFNBQUgsQ0FBYTtBQUNYUCxtQkFBTyxRQURJO0FBRVhRLHFCQUFTO0FBRkUsV0FBYjtBQUlELFNBckJRO0FBc0JUQyxnQkF0QlMsc0JBc0JFO0FBQ1RsQixhQUFHbUIsV0FBSDtBQUNEO0FBeEJRLE9BQVg7QUEwQkQ7Ozs7RUFsR2dDLGVBQUtRLEk7O2tCQUFuQnRDLEsiLCJmaWxlIjoid3JpdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB3ZXB5IGZyb20gJ3dlcHknXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXcml0ZSBleHRlbmRzIHdlcHkucGFnZSB7XG4gIGNvbmZpZyA9IHtcbiAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5omL5YaZ6K+G5YirJ1xuICB9XG5cbiAgZGF0YSA9IHtcbiAgICB1cmw6ICcnLFxuICAgIGltYWdlQm9vbDogZmFsc2UsXG4gICAgcmVzdWx0Qm9vbDogZmFsc2UsXG4gICAgaW1nZGF0YTogJycsXG4gICAgcmVzdWx0OiAnJ1xuICB9XG5cbiAgbWV0aG9kcyA9IHtcbiAgICBmaW5pc2goKSB7XG4gICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xuICAgICAgICBkZWx0YTogMVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog6YCJ5oup5Zu+54mHXG4gICAgICovXG4gICAgdXBsb2FkUGhvdG8oKSB7XG4gICAgICB3eC5jaG9vc2VJbWFnZSh7XG4gICAgICAgIGNvdW50OiAxLFxuICAgICAgICBzb3VyY2VUeXBlOiBbJ2FsYnVtJywgJ2NhbWVyYSddLFxuICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgICAgICAgIHRpdGxlOiAn5LiK5Lyg5Lit8J+klPCfpJTwn6SUJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy51cmwgPSByZXMudGVtcEZpbGVQYXRoc1swXVxuICAgICAgICAgIHRoaXMuaW1hZ2VCb29sID0gdHJ1ZVxuICAgICAgICAgIGxldCBkYXRhID0gd3guZ2V0RmlsZVN5c3RlbU1hbmFnZXIoKS5yZWFkRmlsZVN5bmMocmVzLnRlbXBGaWxlUGF0aHNbMF0sICdiYXNlNjQnKVxuICAgICAgICAgIHRoaXMuaW1nZGF0YSA9IGRhdGFcbiAgICAgICAgICB0aGlzLiRhcHBseSgpXG4gICAgICAgIH0sXG4gICAgICAgIGZhaWwoKSB7XG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgIHRpdGxlOiAn5Zu+54mH5LiK5Lyg5aSx6LSl4pi577iPJyxcbiAgICAgICAgICAgIGNvbnRlbnQ6ICfmgqjlm77niYfkuIrkvKDlpLHotKXkuobimLnvuI8nXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgY29tcGxldGUoKSB7XG4gICAgICAgICAgd3guaGlkZUxvYWRpbmcoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sXG4gICAgLyoqXG4gICAgICog5Zu+54mH6K+G5YirXG4gICAgICovXG4gICAgdXBsb2FkSW1hZ2UoKSB7XG4gICAgICB0aGlzLmdldERpc0Nlcm5CeUltZygpXG4gICAgfVxuICB9XG5cbiAgICAvKipcbiAgICog5Zu+54mH6K+35rGCXG4gICAqL1xuICBnZXREaXNDZXJuQnlJbWcoKSB7XG4gICAgaWYgKHRoaXMudXJsID09PSAnJykge1xuICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgdGl0bGU6ICflpb3mrbnkvaDkuZ/nu5nmiJHkuKrlm77niYfllYrwn5irJyxcbiAgICAgICAgY29udGVudDogJ+S9oOS4jee7meaIkeWbvueJh+iHo+WmvuayoeWKnuazleivhuWIq+WViuKYue+4jydcbiAgICAgIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB3eC5zaG93TG9hZGluZyh7XG4gICAgICB0aXRsZTogJ+ivhuWIq+S4rfCfmI7wn5iO8J+YjidcbiAgICB9KVxuICAgIGxldCB0aGF0ID0gdGhpc1xuICAgIHd4LnJlcXVlc3Qoe1xuICAgICAgdXJsOiAnaHR0cDovLzEyMy4yMDcuMjI4LjIwMDo5MTAwL3dyaXRlJyxcbiAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgZGF0YToge2ltZ0RhdGE6IHRoaXMuaW1nZGF0YX0sXG4gICAgICBzdWNjZXNzKHJlcykge1xuICAgICAgICBpZiAocmVzLmRhdGEuY29udGVudC5jb2RlID09PSAyMDApIHtcbiAgICAgICAgICB0aGF0LnJlc3VsdEJvb2wgPSB0cnVlXG4gICAgICAgICAgdGhhdC5yZXN1bHQgPSByZXMuZGF0YS5jb250ZW50LmRhdGFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgdGl0bGU6ICfor4bliKvlpLHotKXwn5itJyxcbiAgICAgICAgICAgIGNvbnRlbnQ6ICflm77niYfmoLzlvI/kuI3mraPnoa4nXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICB0aGF0LiRhcHBseSgpXG4gICAgICB9LFxuICAgICAgZmFpbCgpIHtcbiAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICB0aXRsZTogJ+ivhuWIq+Wksei0peKYue+4jycsXG4gICAgICAgICAgY29udGVudDogJ+aKseatie+8jOWPr+iDveacjeWKoeWZqOWHuuWwj+W3ruS6hvCfpJQnXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgICAgY29tcGxldGUoKSB7XG4gICAgICAgIHd4LmhpZGVMb2FkaW5nKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG4iXX0=