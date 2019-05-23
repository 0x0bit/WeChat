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
        data: { imgData: this.imgdata, type: 2 },
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


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Write , 'pages/writeMore'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndyaXRlTW9yZS5qcyJdLCJuYW1lcyI6WyJXcml0ZSIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJkYXRhIiwidXJsIiwiaW1hZ2VCb29sIiwicmVzdWx0Qm9vbCIsImltZ2RhdGEiLCJyZXN1bHQiLCJtZXRob2RzIiwiZmluaXNoIiwid3giLCJuYXZpZ2F0ZUJhY2siLCJkZWx0YSIsInVwbG9hZFBob3RvIiwiY2hvb3NlSW1hZ2UiLCJjb3VudCIsInNvdXJjZVR5cGUiLCJzdWNjZXNzIiwic2hvd0xvYWRpbmciLCJ0aXRsZSIsInJlcyIsInRlbXBGaWxlUGF0aHMiLCJnZXRGaWxlU3lzdGVtTWFuYWdlciIsInJlYWRGaWxlU3luYyIsIiRhcHBseSIsImZhaWwiLCJzaG93TW9kYWwiLCJjb250ZW50IiwiY29tcGxldGUiLCJoaWRlTG9hZGluZyIsInVwbG9hZEltYWdlIiwiZ2V0RGlzQ2VybkJ5SW1nIiwidGhhdCIsInJlcXVlc3QiLCJtZXRob2QiLCJpbWdEYXRhIiwidHlwZSIsImNvZGUiLCJwYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBQ3FCQSxLOzs7Ozs7Ozs7Ozs7OztvTEFDbkJDLE0sR0FBUztBQUNQQyw4QkFBd0I7QUFEakIsSyxRQUlUQyxJLEdBQU87QUFDTEMsV0FBSyxFQURBO0FBRUxDLGlCQUFXLEtBRk47QUFHTEMsa0JBQVksS0FIUDtBQUlMQyxlQUFTLEVBSko7QUFLTEMsY0FBUTtBQUxILEssUUFRUEMsTyxHQUFVO0FBQ1JDLFlBRFEsb0JBQ0M7QUFDUEMsV0FBR0MsWUFBSCxDQUFnQjtBQUNkQyxpQkFBTztBQURPLFNBQWhCO0FBR0QsT0FMTzs7O0FBT1I7OztBQUdBQyxpQkFWUSx5QkFVTTtBQUFBOztBQUNaSCxXQUFHSSxXQUFILENBQWU7QUFDYkMsaUJBQU8sQ0FETTtBQUViQyxzQkFBWSxDQUFDLE9BQUQsRUFBVSxRQUFWLENBRkM7QUFHYkMsbUJBQVMsc0JBQU87QUFDZFAsZUFBR1EsV0FBSCxDQUFlO0FBQ2JDLHFCQUFPO0FBRE0sYUFBZjtBQUdBLG1CQUFLaEIsR0FBTCxHQUFXaUIsSUFBSUMsYUFBSixDQUFrQixDQUFsQixDQUFYO0FBQ0EsbUJBQUtqQixTQUFMLEdBQWlCLElBQWpCO0FBQ0EsZ0JBQUlGLE9BQU9RLEdBQ1JZLG9CQURRLEdBRVJDLFlBRlEsQ0FFS0gsSUFBSUMsYUFBSixDQUFrQixDQUFsQixDQUZMLEVBRTJCLFFBRjNCLENBQVg7QUFHQSxtQkFBS2YsT0FBTCxHQUFlSixJQUFmO0FBQ0EsbUJBQUtzQixNQUFMO0FBQ0QsV0FkWTtBQWViQyxjQWZhLGtCQWVOO0FBQ0xmLGVBQUdnQixTQUFILENBQWE7QUFDWFAscUJBQU8sVUFESTtBQUVYUSx1QkFBUztBQUZFLGFBQWI7QUFJRCxXQXBCWTtBQXFCYkMsa0JBckJhLHNCQXFCRjtBQUNUbEIsZUFBR21CLFdBQUg7QUFDRDtBQXZCWSxTQUFmO0FBeUJELE9BcENPOztBQXFDUjs7O0FBR0FDLGlCQXhDUSx5QkF3Q007QUFDWixhQUFLQyxlQUFMO0FBQ0Q7QUExQ08sSzs7Ozs7OztBQTZDVjs7O3NDQUdrQjtBQUNoQixVQUFJLEtBQUs1QixHQUFMLEtBQWEsRUFBakIsRUFBcUI7QUFDbkJPLFdBQUdnQixTQUFILENBQWE7QUFDWFAsaUJBQU8sY0FESTtBQUVYUSxtQkFBUztBQUZFLFNBQWI7QUFJQTtBQUNEOztBQUVEakIsU0FBR1EsV0FBSCxDQUFlO0FBQ2JDLGVBQU87QUFETSxPQUFmO0FBR0EsVUFBSWEsT0FBTyxJQUFYO0FBQ0F0QixTQUFHdUIsT0FBSCxDQUFXO0FBQ1Q5QixhQUFLLGtDQURJO0FBRVQrQixnQkFBUSxNQUZDO0FBR1RoQyxjQUFNLEVBQUVpQyxTQUFTLEtBQUs3QixPQUFoQixFQUF5QjhCLE1BQU0sQ0FBL0IsRUFIRztBQUlUbkIsZUFKUyxtQkFJREcsR0FKQyxFQUlJO0FBQ1gsY0FBSUEsSUFBSWxCLElBQUosQ0FBU3lCLE9BQVQsQ0FBaUJVLElBQWpCLEtBQTBCLEdBQTlCLEVBQW1DO0FBQ2pDTCxpQkFBSzNCLFVBQUwsR0FBa0IsSUFBbEI7QUFDQTJCLGlCQUFLekIsTUFBTCxHQUFjYSxJQUFJbEIsSUFBSixDQUFTeUIsT0FBVCxDQUFpQnpCLElBQS9CO0FBQ0QsV0FIRCxNQUdPO0FBQ0xRLGVBQUdnQixTQUFILENBQWE7QUFDWFAscUJBQU8sUUFESTtBQUVYUSx1QkFBUztBQUZFLGFBQWI7QUFJRDtBQUNESyxlQUFLUixNQUFMO0FBQ0QsU0FmUTtBQWdCVEMsWUFoQlMsa0JBZ0JGO0FBQ0xmLGFBQUdnQixTQUFILENBQWE7QUFDWFAsbUJBQU8sUUFESTtBQUVYUSxxQkFBUztBQUZFLFdBQWI7QUFJRCxTQXJCUTtBQXNCVEMsZ0JBdEJTLHNCQXNCRTtBQUNUbEIsYUFBR21CLFdBQUg7QUFDRDtBQXhCUSxPQUFYO0FBMEJEOzs7O0VBcEdnQyxlQUFLUyxJOztrQkFBbkJ2QyxLIiwiZmlsZSI6IndyaXRlTW9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSdcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdyaXRlIGV4dGVuZHMgd2VweS5wYWdlIHtcbiAgY29uZmlnID0ge1xuICAgIG5hdmlnYXRpb25CYXJUaXRsZVRleHQ6ICfmiYvlhpnor4bliKsnXG4gIH1cblxuICBkYXRhID0ge1xuICAgIHVybDogJycsXG4gICAgaW1hZ2VCb29sOiBmYWxzZSxcbiAgICByZXN1bHRCb29sOiBmYWxzZSxcbiAgICBpbWdkYXRhOiAnJyxcbiAgICByZXN1bHQ6ICcnXG4gIH1cblxuICBtZXRob2RzID0ge1xuICAgIGZpbmlzaCgpIHtcbiAgICAgIHd4Lm5hdmlnYXRlQmFjayh7XG4gICAgICAgIGRlbHRhOiAxXG4gICAgICB9KVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDpgInmi6nlm77niYdcbiAgICAgKi9cbiAgICB1cGxvYWRQaG90bygpIHtcbiAgICAgIHd4LmNob29zZUltYWdlKHtcbiAgICAgICAgY291bnQ6IDEsXG4gICAgICAgIHNvdXJjZVR5cGU6IFsnYWxidW0nLCAnY2FtZXJhJ10sXG4gICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgICAgICAgdGl0bGU6ICfkuIrkvKDkuK3wn6SU8J+klPCfpJQnXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLnVybCA9IHJlcy50ZW1wRmlsZVBhdGhzWzBdXG4gICAgICAgICAgdGhpcy5pbWFnZUJvb2wgPSB0cnVlXG4gICAgICAgICAgbGV0IGRhdGEgPSB3eFxuICAgICAgICAgICAgLmdldEZpbGVTeXN0ZW1NYW5hZ2VyKClcbiAgICAgICAgICAgIC5yZWFkRmlsZVN5bmMocmVzLnRlbXBGaWxlUGF0aHNbMF0sICdiYXNlNjQnKVxuICAgICAgICAgIHRoaXMuaW1nZGF0YSA9IGRhdGFcbiAgICAgICAgICB0aGlzLiRhcHBseSgpXG4gICAgICAgIH0sXG4gICAgICAgIGZhaWwoKSB7XG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgIHRpdGxlOiAn5Zu+54mH5LiK5Lyg5aSx6LSl4pi577iPJyxcbiAgICAgICAgICAgIGNvbnRlbnQ6ICfmgqjlm77niYfkuIrkvKDlpLHotKXkuobimLnvuI8nXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgY29tcGxldGUoKSB7XG4gICAgICAgICAgd3guaGlkZUxvYWRpbmcoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sXG4gICAgLyoqXG4gICAgICog5Zu+54mH6K+G5YirXG4gICAgICovXG4gICAgdXBsb2FkSW1hZ2UoKSB7XG4gICAgICB0aGlzLmdldERpc0Nlcm5CeUltZygpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOWbvueJh+ivt+axglxuICAgKi9cbiAgZ2V0RGlzQ2VybkJ5SW1nKCkge1xuICAgIGlmICh0aGlzLnVybCA9PT0gJycpIHtcbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAn5aW95q255L2g5Lmf57uZ5oiR5Liq5Zu+54mH5ZWK8J+YqycsXG4gICAgICAgIGNvbnRlbnQ6ICfkvaDkuI3nu5nmiJHlm77niYfoh6Plpr7msqHlip7ms5Xor4bliKvllYrimLnvuI8nXG4gICAgICB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgdGl0bGU6ICfor4bliKvkuK3wn5iO8J+YjvCfmI4nXG4gICAgfSlcbiAgICBsZXQgdGhhdCA9IHRoaXNcbiAgICB3eC5yZXF1ZXN0KHtcbiAgICAgIHVybDogJ2h0dHA6Ly8xMDYuMTQuMTQ1LjIxODo5MTAwL3dyaXRlJyxcbiAgICAgIG1ldGhvZDogJ3Bvc3QnLFxuICAgICAgZGF0YTogeyBpbWdEYXRhOiB0aGlzLmltZ2RhdGEsIHR5cGU6IDIgfSxcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgIGlmIChyZXMuZGF0YS5jb250ZW50LmNvZGUgPT09IDIwMCkge1xuICAgICAgICAgIHRoYXQucmVzdWx0Qm9vbCA9IHRydWVcbiAgICAgICAgICB0aGF0LnJlc3VsdCA9IHJlcy5kYXRhLmNvbnRlbnQuZGF0YVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICB0aXRsZTogJ+ivhuWIq+Wksei0pfCfmK0nLFxuICAgICAgICAgICAgY29udGVudDogJ+WbvueJh+agvOW8j+S4jeato+ehridcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHRoYXQuJGFwcGx5KClcbiAgICAgIH0sXG4gICAgICBmYWlsKCkge1xuICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgIHRpdGxlOiAn6K+G5Yir5aSx6LSl4pi577iPJyxcbiAgICAgICAgICBjb250ZW50OiAn5oqx5q2J77yM5Y+v6IO95pyN5Yqh5Zmo5Ye65bCP5beu5LqG8J+klCdcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICBjb21wbGV0ZSgpIHtcbiAgICAgICAgd3guaGlkZUxvYWRpbmcoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cbiJdfQ==