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

var Discern = function (_wepy$page) {
  _inherits(Discern, _wepy$page);

  function Discern() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Discern);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Discern.__proto__ || Object.getPrototypeOf(Discern)).call.apply(_ref, [this].concat(args))), _this), _this.config = {
      navigationBarTitleText: '识别中心',
      window: {
        enablePullDownRefresh: false
      }
    }, _this.data = {
      id: 1,
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
       * 图片链接识别
       */
      uploadimgUrl: function uploadimgUrl() {
        this.getDisCernByUrl();
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
            // data = data.replace(/\r\n/g,'');
            // data = data.replace(/\+/g, '%2B');
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

  _createClass(Discern, [{
    key: 'onLoad',
    value: function onLoad() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.id = options.id;
      this.$apply();
    }
  }, {
    key: 'bindKeyInput',


    /**
     * 获取输入框输入
    */
    value: function bindKeyInput(e) {
      this.url = e.detail.value;
    }

    // -------------------------------------------------------
    /**
     * 通过图片url识别
     */

  }, {
    key: 'getDisCernByUrl',
    value: function getDisCernByUrl() {
      var regex = /(.*)\\.(jpg|jpeg|png)$/;
      if (this.url === '') {
        wx.showModal({
          title: '好歹你也给我个地址啊😫',
          content: '你不给我地址臣妾没办法识别啊☹️'
        });
        return;
      }

      if (regex.test(this.url)) {
        wx.showModal({
          title: '给个正确的图片地址啊😫',
          content: '你给我正确的图片地址臣妾没办法识别啊☹️'
        });
        return;
      }

      wx.showLoading({
        title: '识别中🤔🤔🤔'
      });

      var that = this;
      wx.request({
        url: 'http://106.14.145.218:9100/baidu/api/discern',
        method: 'post',
        data: { imgOrUrl: this.url },
        success: function success(res) {
          if (res.data.content.code === 200) {
            that.resultBool = true;
            that.result = res.data.content.word.join(' ');
            that.$apply();
          } else {
            wx.showModal({
              title: '识别失败☹️',
              content: '没有找到你给我链接的图片☹️'
            });
          }
        },
        fail: function fail() {
          wx.showModal({
            title: '识别失败☹️',
            content: '抱歉，可能服务器出小差了☹️'
          });
        },
        complete: function complete() {
          wx.hideLoading();
        }
      });
    }

    /**
     * 图片请求
     */

  }, {
    key: 'getDisCernByImg',
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
        url: 'http://106.14.145.218:9100/baidu/api/discern',
        method: 'post',
        data: { imgOrUrl: this.imgdata },
        success: function success(res) {
          if (res.data.content.code === 200) {
            that.resultBool = true;
            that.result = res.data.content.word.join(' ');
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

  return Discern;
}(_wepy2.default.page);


Page(require('./../npm/wepy/lib/wepy.js').default.$createPage(Discern , 'pages/discern'));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRpc2Nlcm4uanMiXSwibmFtZXMiOlsiRGlzY2VybiIsImNvbmZpZyIsIm5hdmlnYXRpb25CYXJUaXRsZVRleHQiLCJ3aW5kb3ciLCJlbmFibGVQdWxsRG93blJlZnJlc2giLCJkYXRhIiwiaWQiLCJ1cmwiLCJpbWFnZUJvb2wiLCJyZXN1bHRCb29sIiwiaW1nZGF0YSIsInJlc3VsdCIsIm1ldGhvZHMiLCJmaW5pc2giLCJ3eCIsIm5hdmlnYXRlQmFjayIsImRlbHRhIiwidXBsb2FkaW1nVXJsIiwiZ2V0RGlzQ2VybkJ5VXJsIiwidXBsb2FkUGhvdG8iLCJjaG9vc2VJbWFnZSIsImNvdW50Iiwic291cmNlVHlwZSIsInN1Y2Nlc3MiLCJyZXMiLCJzaG93TG9hZGluZyIsInRpdGxlIiwidGVtcEZpbGVQYXRocyIsImdldEZpbGVTeXN0ZW1NYW5hZ2VyIiwicmVhZEZpbGVTeW5jIiwiJGFwcGx5IiwiZmFpbCIsInNob3dNb2RhbCIsImNvbnRlbnQiLCJjb21wbGV0ZSIsImhpZGVMb2FkaW5nIiwidXBsb2FkSW1hZ2UiLCJnZXREaXNDZXJuQnlJbWciLCJvcHRpb25zIiwiZSIsImRldGFpbCIsInZhbHVlIiwicmVnZXgiLCJ0ZXN0IiwidGhhdCIsInJlcXVlc3QiLCJtZXRob2QiLCJpbWdPclVybCIsImNvZGUiLCJ3b3JkIiwiam9pbiIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFDcUJBLE87Ozs7Ozs7Ozs7Ozs7O3dMQUNuQkMsTSxHQUFTO0FBQ1BDLDhCQUF3QixNQURqQjtBQUVQQyxjQUFRO0FBQ05DLCtCQUF1QjtBQURqQjtBQUZELEssUUFPVEMsSSxHQUFPO0FBQ0xDLFVBQUksQ0FEQztBQUVMQyxXQUFLLEVBRkE7QUFHTEMsaUJBQVcsS0FITjtBQUlMQyxrQkFBWSxLQUpQO0FBS0xDLGVBQVMsRUFMSjtBQU1MQyxjQUFRO0FBTkgsSyxRQWNQQyxPLEdBQVU7QUFDUkMsWUFEUSxvQkFDQztBQUNQQyxXQUFHQyxZ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InNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSdcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpc2Nlcm4gZXh0ZW5kcyB3ZXB5LnBhZ2Uge1xuICBjb25maWcgPSB7XG4gICAgbmF2aWdhdGlvbkJhclRpdGxlVGV4dDogJ+ivhuWIq+S4reW/gycsXG4gICAgd2luZG93OiB7XG4gICAgICBlbmFibGVQdWxsRG93blJlZnJlc2g6IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgZGF0YSA9IHtcbiAgICBpZDogMSxcbiAgICB1cmw6ICcnLFxuICAgIGltYWdlQm9vbDogZmFsc2UsXG4gICAgcmVzdWx0Qm9vbDogZmFsc2UsXG4gICAgaW1nZGF0YTogJycsXG4gICAgcmVzdWx0OiAnJ1xuICB9XG5cbiAgb25Mb2FkKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuaWQgPSBvcHRpb25zLmlkXG4gICAgdGhpcy4kYXBwbHkoKVxuICB9XG5cbiAgbWV0aG9kcyA9IHtcbiAgICBmaW5pc2goKSB7XG4gICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xuICAgICAgICBkZWx0YTogMVxuICAgICAgfSlcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5Zu+54mH6ZO+5o6l6K+G5YirXG4gICAgICovXG4gICAgdXBsb2FkaW1nVXJsICgpIHtcbiAgICAgIHRoaXMuZ2V0RGlzQ2VybkJ5VXJsKClcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog6YCJ5oup5Zu+54mHXG4gICAgICovXG4gICAgdXBsb2FkUGhvdG8oKSB7XG4gICAgICB3eC5jaG9vc2VJbWFnZSh7XG4gICAgICAgIGNvdW50OiAxLFxuICAgICAgICBzb3VyY2VUeXBlOiBbJ2FsYnVtJywgJ2NhbWVyYSddLFxuICAgICAgICBzdWNjZXNzOiAocmVzKSA9PiB7XG4gICAgICAgICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgICAgICAgdGl0bGU6ICfkuIrkvKDkuK3wn6SU8J+klPCfpJQnXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLnVybCA9IHJlcy50ZW1wRmlsZVBhdGhzWzBdXG4gICAgICAgICAgdGhpcy5pbWFnZUJvb2wgPSB0cnVlXG4gICAgICAgICAgbGV0IGRhdGEgPSB3eC5nZXRGaWxlU3lzdGVtTWFuYWdlcigpLnJlYWRGaWxlU3luYyhyZXMudGVtcEZpbGVQYXRoc1swXSwgJ2Jhc2U2NCcpXG4gICAgICAgICAgLy8gZGF0YSA9IGRhdGEucmVwbGFjZSgvXFxyXFxuL2csJycpO1xuICAgICAgICAgIC8vIGRhdGEgPSBkYXRhLnJlcGxhY2UoL1xcKy9nLCAnJTJCJyk7XG4gICAgICAgICAgdGhpcy5pbWdkYXRhID0gZGF0YVxuICAgICAgICAgIHRoaXMuJGFwcGx5KClcbiAgICAgICAgfSxcbiAgICAgICAgZmFpbCgpIHtcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgdGl0bGU6ICflm77niYfkuIrkvKDlpLHotKXimLnvuI8nLFxuICAgICAgICAgICAgY29udGVudDogJ+aCqOWbvueJh+S4iuS8oOWksei0peS6huKYue+4jydcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBjb21wbGV0ZSgpIHtcbiAgICAgICAgICB3eC5oaWRlTG9hZGluZygpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcbiAgICAvKipcbiAgICAgKiDlm77niYfor4bliKtcbiAgICAgKi9cbiAgICB1cGxvYWRJbWFnZSAoKSB7XG4gICAgICB0aGlzLmdldERpc0Nlcm5CeUltZygpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOiOt+WPlui+k+WFpeahhui+k+WFpVxuICAqL1xuICBiaW5kS2V5SW5wdXQoZSkge1xuICAgIHRoaXMudXJsID0gZS5kZXRhaWwudmFsdWVcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLyoqXG4gICAqIOmAmui/h+WbvueJh3VybOivhuWIq1xuICAgKi9cbiAgZ2V0RGlzQ2VybkJ5VXJsICgpIHtcbiAgICBjb25zdCByZWdleCA9IC8oLiopXFxcXC4oanBnfGpwZWd8cG5nKSQvXG4gICAgaWYgKHRoaXMudXJsID09PSAnJykge1xuICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgdGl0bGU6ICflpb3mrbnkvaDkuZ/nu5nmiJHkuKrlnLDlnYDllYrwn5irJyxcbiAgICAgICAgY29udGVudDogJ+S9oOS4jee7meaIkeWcsOWdgOiHo+WmvuayoeWKnuazleivhuWIq+WViuKYue+4jydcbiAgICAgIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAocmVnZXgudGVzdCh0aGlzLnVybCkpIHtcbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAn57uZ5Liq5q2j56Gu55qE5Zu+54mH5Zyw5Z2A5ZWK8J+YqycsXG4gICAgICAgIGNvbnRlbnQ6ICfkvaDnu5nmiJHmraPnoa7nmoTlm77niYflnLDlnYDoh6Plpr7msqHlip7ms5Xor4bliKvllYrimLnvuI8nXG4gICAgICB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgdGl0bGU6ICfor4bliKvkuK3wn6SU8J+klPCfpJQnXG4gICAgfSlcblxuICAgIGxldCB0aGF0ID0gdGhpc1xuICAgIHd4LnJlcXVlc3Qoe1xuICAgICAgdXJsOiAnaHR0cDovLzEwNi4xNC4xNDUuMjE4OjkxMDAvYmFpZHUvYXBpL2Rpc2Nlcm4nLFxuICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICBkYXRhOiB7aW1nT3JVcmw6IHRoaXMudXJsfSxcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgIGlmIChyZXMuZGF0YS5jb250ZW50LmNvZGUgPT09IDIwMCkge1xuICAgICAgICAgIHRoYXQucmVzdWx0Qm9vbCA9IHRydWVcbiAgICAgICAgICB0aGF0LnJlc3VsdCA9IHJlcy5kYXRhLmNvbnRlbnQud29yZC5qb2luKCcgJylcbiAgICAgICAgICB0aGF0LiRhcHBseSgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgIHRpdGxlOiAn6K+G5Yir5aSx6LSl4pi577iPJyxcbiAgICAgICAgICAgIGNvbnRlbnQ6ICfmsqHmnInmib7liLDkvaDnu5nmiJHpk77mjqXnmoTlm77niYfimLnvuI8nXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGZhaWwoKSB7XG4gICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgdGl0bGU6ICfor4bliKvlpLHotKXimLnvuI8nLFxuICAgICAgICAgIGNvbnRlbnQ6ICfmirHmrYnvvIzlj6/og73mnI3liqHlmajlh7rlsI/lt67kuobimLnvuI8nXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgICAgY29tcGxldGUoKSB7XG4gICAgICAgIHd4LmhpZGVMb2FkaW5nKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIOWbvueJh+ivt+axglxuICAgKi9cbiAgZ2V0RGlzQ2VybkJ5SW1nKCkge1xuICAgIGlmICh0aGlzLnVybCA9PT0gJycpIHtcbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAn5aW95q255L2g5Lmf57uZ5oiR5Liq5Zu+54mH5ZWK8J+YqycsXG4gICAgICAgIGNvbnRlbnQ6ICfkvaDkuI3nu5nmiJHlm77niYfoh6Plpr7msqHlip7ms5Xor4bliKvllYrimLnvuI8nXG4gICAgICB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgd3guc2hvd0xvYWRpbmcoe1xuICAgICAgdGl0bGU6ICfor4bliKvkuK3wn5iO8J+YjvCfmI4nXG4gICAgfSlcbiAgICBsZXQgdGhhdCA9IHRoaXNcblxuICAgIHd4LnJlcXVlc3Qoe1xuICAgICAgdXJsOiAnaHR0cDovLzEwNi4xNC4xNDUuMjE4OjkxMDAvYmFpZHUvYXBpL2Rpc2Nlcm4nLFxuICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICBkYXRhOiB7aW1nT3JVcmw6IHRoaXMuaW1nZGF0YX0sXG4gICAgICBzdWNjZXNzKHJlcykge1xuICAgICAgICBpZiAocmVzLmRhdGEuY29udGVudC5jb2RlID09PSAyMDApIHtcbiAgICAgICAgICB0aGF0LnJlc3VsdEJvb2wgPSB0cnVlXG4gICAgICAgICAgdGhhdC5yZXN1bHQgPSByZXMuZGF0YS5jb250ZW50LndvcmQuam9pbignICcpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgIHRpdGxlOiAn6K+G5Yir5aSx6LSl8J+YrScsXG4gICAgICAgICAgICBjb250ZW50OiAn5Zu+54mH5qC85byP5LiN5q2j56GuJ1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgdGhhdC4kYXBwbHkoKVxuICAgICAgfSxcbiAgICAgIGZhaWwoKSB7XG4gICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgdGl0bGU6ICfor4bliKvlpLHotKXimLnvuI8nLFxuICAgICAgICAgIGNvbnRlbnQ6ICfmirHmrYnvvIzlj6/og73mnI3liqHlmajlh7rlsI/lt67kuobwn6SUJ1xuICAgICAgICB9KVxuICAgICAgfSxcbiAgICAgIGNvbXBsZXRlKCkge1xuICAgICAgICB3eC5oaWRlTG9hZGluZygpXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuIl19