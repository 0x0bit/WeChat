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
        url: 'http://106.14.145.218:9100/write',
        method: 'post',
        data: { imgData: this.imgdata, type: 1 },
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


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Write , 'pages/writeOne'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndyaXRlT25lLmpzIl0sIm5hbWVzIjpbIldyaXRlIiwiY29uZmlnIiwibmF2aWdhdGlvbkJhclRpdGxlVGV4dCIsImRhdGEiLCJ1cmwiLCJpbWFnZUJvb2wiLCJyZXN1bHRCb29sIiwiaW1nZGF0YSIsInJlc3VsdCIsIm1ldGhvZHMiLCJmaW5pc2giLCJ3eCIsIm5hdmlnYXRlQmFjayIsImRlbHRhIiwidXBsb2FkUGhvdG8iLCJjaG9vc2VJbWFnZSIsImNvdW50Iiwic291cmNlVHlwZSIsInN1Y2Nlc3MiLCJzaG93TG9hZGluZyIsInRpdGxlIiwicmVzIiwidGVtcEZpbGVQYXRocyIsImdldEZpbGVTeXN0ZW1NYW5hZ2VyIiwicmVhZEZpbGVTeW5jIiwiJGFwcGx5IiwiZmFpbCIsInNob3dNb2RhbCIsImNvbnRlbnQiLCJjb21wbGV0ZSIsImhpZGVMb2FkaW5nIiwidXBsb2FkSW1hZ2UiLCJnZXREaXNDZXJuQnlJbWciLCJ0aGF0IiwicmVxdWVzdCIsIm1ldGhvZCIsImltZ0RhdGEiLCJ0eXBlIiwiY29kZSIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFDcUJBLEs7Ozs7Ozs7Ozs7Ozs7O29MQUNuQkMsTSxHQUFTO0FBQ1BDLDhCQUF3QjtBQURqQixLLFFBSVRDLEksR0FBTztBQUNMQyxXQUFLLEVBREE7QUFFTEMsaUJBQVcsS0FGTjtBQUdMQyxrQkFBWSxLQUhQO0FBSUxDLGVBQVMsRUFKSjtBQUtMQyxjQUFRO0FBTEgsSyxRQVFQQyxPLEdBQVU7QUFDUkMsWUFEUSxvQkFDQztBQUNQQyxXQUFHQyxZQUFILENBQWdCO0FBQ2RDLGlCQUFPO0FBRE8sU0FBaEI7QUFHRCxPQUxPOzs7QUFPUjs7O0FBR0FDLGlCQVZRLHlCQVVNO0FBQUE7O0FBQ1pILFdBQUdJLFdBQUgsQ0FBZTtBQUNiQyxpQkFBTyxDQURNO0FBRWJDLHNCQUFZLENBQUMsT0FBRCxFQUFVLFFBQVYsQ0FGQztBQUdiQyxtQkFBUyxzQkFBTztBQUNkUCxlQUFHUSxXQUFILENBQWU7QUFDYkMscUJBQU87QUFETSxhQUFmO0FBR0EsbUJBQUtoQixHQUFMLEdBQVdpQixJQUFJQyxhQUFKLENBQWtCLENBQWxCLENBQVg7QUFDQSxtQkFBS2pCLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxnQkFBSUYsT0FBT1EsR0FBR1ksb0JBQUgsR0FBMEJDLFlBQTFCLENBQXVDSCxJQUFJQyxhQUFKLENBQWtCLENBQWxCLENBQXZDLEVBQTZELFFBQTdELENBQVg7QUFDQSxtQkFBS2YsT0FBTCxHQUFlSixJQUFmO0FBQ0EsbUJBQUtzQixNQUFMO0FBQ0QsV0FaWTtBQWFiQyxjQWJhLGtCQWFOO0FBQ0xmLGVBQUdnQixTQUFILENBQWE7QUFDWFAscUJBQU8sVUFESTtBQUVYUSx1QkFBUztBQUZFLGFBQWI7QUFJRCxXQWxCWTtBQW1CYkMsa0JBbkJhLHNCQW1CRjtBQUNUbEIsZUFBR21CLFdBQUg7QUFDRDtBQXJCWSxTQUFmO0FBdUJELE9BbENPOztBQW1DUjs7O0FBR0FDLGlCQXRDUSx5QkFzQ007QUFDWixhQUFLQyxlQUFMO0FBQ0Q7QUF4Q08sSzs7Ozs7OztBQTJDUjs7O3NDQUdnQjtBQUNoQixVQUFJLEtBQUs1QixHQUFMLEtBQWEsRUFBakIsRUFBcUI7QUFDbkJPLFdBQUdnQixTQUFILENBQWE7QUFDWFAsaUJBQU8sY0FESTtBQUVYUSxtQkFBUztBQUZFLFNBQWI7QUFJQTtBQUNEOztBQUVEakIsU0FBR1EsV0FBSCxDQUFlO0FBQ2JDLGVBQU87QUFETSxPQUFmO0FBR0EsVUFBSWEsT0FBTyxJQUFYO0FBQ0F0QixTQUFHdUIsT0FBSCxDQUFXO0FBQ1Q5QixhQUFLLGtDQURJO0FBRVQrQixnQkFBUSxNQUZDO0FBR1RoQyxjQUFNLEVBQUNpQyxTQUFTLEtBQUs3QixPQUFmLEVBQXdCOEIsTUFBTSxDQUE5QixFQUhHO0FBSVRuQixlQUpTLG1CQUlERyxHQUpDLEVBSUk7QUFDWCxjQUFJQSxJQUFJbEIsSUFBSixDQUFTeUIsT0FBVCxDQUFpQlUsSUFBakIsS0FBMEIsR0FBOUIsRUFBbUM7QUFDakNMLGlCQUFLM0IsVUFBTCxHQUFrQixJQUFsQjtBQUNBMkIsaUJBQUt6QixNQUFMLEdBQWNhLElBQUlsQixJQUFKLENBQVN5QixPQUFULENBQWlCekIsSUFBL0I7QUFDRCxXQUhELE1BR087QUFDTFEsZUFBR2dCLFNBQUgsQ0FBYTtBQUNYUCxxQkFBTyxRQURJO0FBRVhRLHVCQUFTO0FBRkUsYUFBYjtBQUlEO0FBQ0RLLGVBQUtSLE1BQUw7QUFDRCxTQWZRO0FBZ0JUQyxZQWhCUyxrQkFnQkY7QUFDTGYsYUFBR2dCLFNBQUgsQ0FBYTtBQUNYUCxtQkFBTyxRQURJO0FBRVhRLHFCQUFTO0FBRkUsV0FBYjtBQUlELFNBckJRO0FBc0JUQyxnQkF0QlMsc0JBc0JFO0FBQ1RsQixhQUFHbUIsV0FBSDtBQUNEO0FBeEJRLE9BQVg7QUEwQkQ7Ozs7RUFsR2dDLGVBQUtTLEk7O2tCQUFuQnZDLEsiLCJmaWxlIjoid3JpdGVPbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB3ZXB5IGZyb20gJ3dlcHknXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXcml0ZSBleHRlbmRzIHdlcHkucGFnZSB7XG4gIGNvbmZpZyA9IHtcbiAgICBuYXZpZ2F0aW9uQmFyVGl0bGVUZXh0OiAn5omL5YaZ6K+G5YirJ1xuICB9XG5cbiAgZGF0YSA9IHtcbiAgICB1cmw6ICcnLFxuICAgIGltYWdlQm9vbDogZmFsc2UsXG4gICAgcmVzdWx0Qm9vbDogZmFsc2UsXG4gICAgaW1nZGF0YTogJycsXG4gICAgcmVzdWx0OiAnJ1xuICB9XG5cbiAgbWV0aG9kcyA9IHtcbiAgICBmaW5pc2goKSB7XG4gICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xuICAgICAgICBkZWx0YTogMVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog6YCJ5oup5Zu+54mHXG4gICAgICovXG4gICAgdXBsb2FkUGhvdG8oKSB7XG4gICAgICB3eC5jaG9vc2VJbWFnZSh7XG4gICAgICAgIGNvdW50OiAxLFxuICAgICAgICBzb3VyY2VUeXBlOiBbJ2FsYnVtJywgJ2NhbWVyYSddLFxuICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICAgIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgICAgICAgIHRpdGxlOiAn5LiK5Lyg5Lit8J+klPCfpJTwn6SUJ1xuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy51cmwgPSByZXMudGVtcEZpbGVQYXRoc1swXVxuICAgICAgICAgIHRoaXMuaW1hZ2VCb29sID0gdHJ1ZVxuICAgICAgICAgIGxldCBkYXRhID0gd3guZ2V0RmlsZVN5c3RlbU1hbmFnZXIoKS5yZWFkRmlsZVN5bmMocmVzLnRlbXBGaWxlUGF0aHNbMF0sICdiYXNlNjQnKVxuICAgICAgICAgIHRoaXMuaW1nZGF0YSA9IGRhdGFcbiAgICAgICAgICB0aGlzLiRhcHBseSgpXG4gICAgICAgIH0sXG4gICAgICAgIGZhaWwoKSB7XG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgIHRpdGxlOiAn5Zu+54mH5LiK5Lyg5aSx6LSl4pi577iPJyxcbiAgICAgICAgICAgIGNvbnRlbnQ6ICfmgqjlm77niYfkuIrkvKDlpLHotKXkuobimLnvuI8nXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgY29tcGxldGUoKSB7XG4gICAgICAgICAgd3guaGlkZUxvYWRpbmcoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sXG4gICAgLyoqXG4gICAgICog5Zu+54mH6K+G5YirXG4gICAgICovXG4gICAgdXBsb2FkSW1hZ2UoKSB7XG4gICAgICB0aGlzLmdldERpc0Nlcm5CeUltZygpXG4gICAgfVxuICB9XG5cbiAgICAvKipcbiAgICog5Zu+54mH6K+35rGCXG4gICAqL1xuICBnZXREaXNDZXJuQnlJbWcoKSB7XG4gICAgaWYgKHRoaXMudXJsID09PSAnJykge1xuICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgdGl0bGU6ICflpb3mrbnkvaDkuZ/nu5nmiJHkuKrlm77niYfllYrwn5irJyxcbiAgICAgICAgY29udGVudDogJ+S9oOS4jee7meaIkeWbvueJh+iHo+WmvuayoeWKnuazleivhuWIq+WViuKYue+4jydcbiAgICAgIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB3eC5zaG93TG9hZGluZyh7XG4gICAgICB0aXRsZTogJ+ivhuWIq+S4rfCfmI7wn5iO8J+YjidcbiAgICB9KVxuICAgIGxldCB0aGF0ID0gdGhpc1xuICAgIHd4LnJlcXVlc3Qoe1xuICAgICAgdXJsOiAnaHR0cDovLzEwNi4xNC4xNDUuMjE4OjkxMDAvd3JpdGUnLFxuICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICBkYXRhOiB7aW1nRGF0YTogdGhpcy5pbWdkYXRhLCB0eXBlOiAxfSxcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgIGlmIChyZXMuZGF0YS5jb250ZW50LmNvZGUgPT09IDIwMCkge1xuICAgICAgICAgIHRoYXQucmVzdWx0Qm9vbCA9IHRydWVcbiAgICAgICAgICB0aGF0LnJlc3VsdCA9IHJlcy5kYXRhLmNvbnRlbnQuZGF0YVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICB0aXRsZTogJ+ivhuWIq+Wksei0pfCfmK0nLFxuICAgICAgICAgICAgY29udGVudDogJ+WbvueJh+agvOW8j+S4jeato+ehridcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHRoYXQuJGFwcGx5KClcbiAgICAgIH0sXG4gICAgICBmYWlsKCkge1xuICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgIHRpdGxlOiAn6K+G5Yir5aSx6LSl4pi577iPJyxcbiAgICAgICAgICBjb250ZW50OiAn5oqx5q2J77yM5Y+v6IO95pyN5Yqh5Zmo5Ye65bCP5beu5LqG8J+klCdcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICBjb21wbGV0ZSgpIHtcbiAgICAgICAgd3guaGlkZUxvYWRpbmcoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cbiJdfQ==