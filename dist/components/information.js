'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wepy = require('./../npm/wepy/lib/wepy.js');

var _wepy2 = _interopRequireDefault(_wepy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TipBox = function (_wepy$component) {
  _inherits(TipBox, _wepy$component);

  function TipBox() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TipBox);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TipBox.__proto__ || Object.getPrototypeOf(TipBox)).call.apply(_ref, [this].concat(args))), _this), _this.data = {
      visible: false,
      position: '',
      margin: '',
      word: '',
      audio: '',
      pron: '',
      definition: '',
      isSlidingDown: false,
      isDetail: false,
      examples: [{ translation: '暂无例句' }],
      wordId: 0
    }, _this.computed = {
      cssText: function cssText() {
        var styles = {};
        if (this.position === 'top') {
          styles.position = this.position;
          styles.top = this.margin || '';
        } else if (this.position === 'bottom') {
          styles.position = this.position;
          styles.top = 'initial';
          styles.bottom = this.margin || '';
        }
        var css = Object.keys(styles).map(function (key) {
          return key + ':' + styles[key];
        }).join(';');
        return css;
      }
    }, _this.methods = {
      stopPropagation: function stopPropagation(e) {},
      play: function play() {
        this.audioCtx.play();
      },
      touchmove: function touchmove(e) {
        if (this.isTouching) return;
        var currentY = e.touches[0].pageY;
        if (currentY === this.lastY) return;
        var isSlideDown = currentY > this.lastY;
        this.isTouching = true; // 避免误触
        this.handleSlide(isSlideDown);
      },
      touchstart: function touchstart(e) {
        this.lastY = e.touches[0].pageY;
      },
      touchend: function touchend(e) {
        this.isTouching = false;
      },
      viewMore: function viewMore() {
        this.getDetails();
      },
      close: function close() {
        this.hide();
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TipBox, [{
    key: 'show',
    value: function show(_ref2) {
      var _this2 = this;

      var word = _ref2.word,
          options = _ref2.options;

      if (!word) {
        return;
      }
      this.visible = true;
      this.word = word;
      // 清空当前结果，避免在网络慢的情况下点击了下一个词 翻译框内容还停留在上一个词
      this.pron = '';
      this.definition = '';
      this.audio = '';
      this.$apply();
      wx.request({
        url: 'https://api.shanbay.com/bdc/search/?word=' + word,
        success: function success(res) {
          if (res.data.msg === 'SUCCESS') {
            var _res$data$data = res.data.data,
                audio = _res$data$data.audio,
                pron = _res$data$data.pron,
                definition = _res$data$data.definition,
                id = _res$data$data.id,
                content = _res$data$data.content;

            _this2.word = content; // 用返回的词展示，例如查询的单词是“Daily”,返回的是“daily”，以返回的结果为准
            _this2.audio = audio;
            _this2.pron = pron ? '/' + pron + '/' : '';
            _this2.definition = definition.split(/\r\n|\n|\r/);
            _this2.audioCtx.setSrc(audio);
            _this2.wordId = id;
          } else {
            _this2.pron = '';
            _this2.audioCtx.setSrc('');
            _this2.definition = [].concat(res.data.msg);
          }
          _this2.$apply();
        }
      });
    }
  }, {
    key: 'hide',
    value: function hide() {
      var _this3 = this;

      this.isSlidingDown = true;
      this.$apply();
      setTimeout(function () {
        _this3.visible = false;
        _this3.word = '';
        _this3.audio = '';
        _this3.pron = '';
        _this3.definition = '';
        _this3.position = '';
        _this3.margin = '';
        _this3.isSlidingDown = false;
        _this3.isDetail = false;
        _this3.examples = [{ translation: '暂无例句' }];
        _this3.wordId = 0;
        _this3.$apply();
      }, 300);
    }
  }, {
    key: 'getDetails',
    value: function getDetails() {
      var _this4 = this;

      this.isDetail = true;
      wx.request({
        url: 'https://api.shanbay.com/bdc/example/?vocabulary_id=' + this.wordId + '&type=sys',
        success: function success(res) {
          if (res.data.msg === 'SUCCESS' && res.data.data.length) {
            _this4.examples = res.data.data.map(function (item) {
              return {
                first: item.first,
                last: item.last,
                word: item.word,
                translation: item.translation
              };
            });
            _this4.$apply();
          }
        }
      });
    }
  }, {
    key: 'handleSlide',
    value: function handleSlide(isSlideDown) {
      if (isSlideDown) {
        if (this.isSlidingDown === false) {
          this.hide();
        }
      } else {
        this.getDetails();
      }
    }
  }, {
    key: 'onLoad',
    value: function onLoad() {
      this.audioCtx = wx.createAudioContext('audio');
      // wx.request({
      //   url: 'https://www.shanbay.com/api/v2/news/notes/?para_id=A152718P134718&ipp=3&page=1',
      //   success: (res) => {
      //     // debugger
      //   }
      // })
    }
  }]);

  return TipBox;
}(_wepy2.default.component);

exports.default = TipBox;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZm9ybWF0aW9uLmpzIl0sIm5hbWVzIjpbIlRpcEJveCIsImRhdGEiLCJ2aXNpYmxlIiwicG9zaXRpb24iLCJtYXJnaW4iLCJ3b3JkIiwiYXVkaW8iLCJwcm9uIiwiZGVmaW5pdGlvbiIsImlzU2xpZGluZ0Rvd24iLCJpc0RldGFpbCIsImV4YW1wbGVzIiwidHJhbnNsYXRpb24iLCJ3b3JkSWQiLCJjb21wdXRlZCIsImNzc1RleHQiLCJzdHlsZXMiLCJ0b3AiLCJib3R0b20iLCJjc3MiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwia2V5Iiwiam9pbiIsIm1ldGhvZHMiLCJzdG9wUHJvcGFnYXRpb24iLCJlIiwicGxheSIsImF1ZGlvQ3R4IiwidG91Y2htb3ZlIiwiaXNUb3VjaGluZyIsImN1cnJlbnRZIiwidG91Y2hlcyIsInBhZ2VZIiwibGFzdFkiLCJpc1NsaWRlRG93biIsImhhbmRsZVNsaWRlIiwidG91Y2hzdGFydCIsInRvdWNoZW5kIiwidmlld01vcmUiLCJnZXREZXRhaWxzIiwiY2xvc2UiLCJoaWRlIiwib3B0aW9ucyIsIiRhcHBseSIsInd4IiwicmVxdWVzdCIsInVybCIsInN1Y2Nlc3MiLCJyZXMiLCJtc2ciLCJpZCIsImNvbnRlbnQiLCJzcGxpdCIsInNldFNyYyIsImNvbmNhdCIsInNldFRpbWVvdXQiLCJsZW5ndGgiLCJmaXJzdCIsIml0ZW0iLCJsYXN0IiwiY3JlYXRlQXVkaW9Db250ZXh0IiwiY29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRXFCQSxNOzs7Ozs7Ozs7Ozs7OztzTEFDbkJDLEksR0FBTztBQUNMQyxlQUFTLEtBREo7QUFFTEMsZ0JBQVUsRUFGTDtBQUdMQyxjQUFRLEVBSEg7QUFJTEMsWUFBTSxFQUpEO0FBS0xDLGFBQU8sRUFMRjtBQU1MQyxZQUFNLEVBTkQ7QUFPTEMsa0JBQVksRUFQUDtBQVFMQyxxQkFBZSxLQVJWO0FBU0xDLGdCQUFVLEtBVEw7QUFVTEMsZ0JBQVUsQ0FB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QUFHQyxPQUFILENBQVc7QUFDVEMscUVBQTJELEtBQUtuQyxNQUFoRSxjQURTO0FBRVRvQyxpQkFBUyxpQkFBQ0MsR0FBRCxFQUFTO0FBQ2hCLGNBQUlBLElBQUlqRCxJQUFKLENBQVNrRCxHQUFULEtBQWlCLFNBQWpCLElBQThCRCxJQUFJakQsSUFBSixDQUFTQSxJQUFULENBQWN5RCxNQUFoRCxFQUF3RDtBQUN0RCxtQkFBSy9DLFFBQUwsR0FBZ0J1QyxJQUFJakQsSUFBSixDQUFTQSxJQUFULENBQWNxQixHQUFkLENBQWtCO0FBQUEscUJBQVM7QUFDekNxQyx1QkFBT0MsS0FBS0QsS0FENkI7QUFFekNFLHNCQUFNRCxLQUFLQyxJQUY4QjtBQUd6Q3hELHNCQUFNdUQsS0FBS3ZELElBSDhCO0FBSXpDTyw2QkFBYWdELEtBQUtoRDtBQUp1QixlQUFUO0FBQUEsYUFBbEIsQ0FBaEI7QUFNQSxtQkFBS2lDLE1BQUw7QUFDRDtBQUNGO0FBWlEsT0FBWDtBQWNEOzs7Z0NBQ1dULFcsRUFBYTtBQUN2QixVQUFJQSxXQUFKLEVBQWlCO0FBQ2YsWUFBSSxLQUFLM0IsYUFBTCxLQUF1QixLQUEzQixFQUFrQztBQUNoQyxlQUFLa0MsSUFBTDtBQUNEO0FBQ0YsT0FKRCxNQUlPO0FBQ0wsYUFBS0YsVUFBTDtBQUNEO0FBQ0Y7Ozs2QkFDUTtBQUNQLFdBQUtaLFFBQUwsR0FBZ0JpQixHQUFHZ0Isa0JBQUgsQ0FBc0IsT0FBdEIsQ0FBaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRDs7OztFQTlJaUMsZUFBS0MsUzs7a0JBQXBCL0QsTSIsImZpbGUiOiJpbmZvcm1hdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHdlcHkgZnJvbSAnd2VweSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlwQm94IGV4dGVuZHMgd2VweS5jb21wb25lbnQge1xuICBkYXRhID0ge1xuICAgIHZpc2libGU6IGZhbHNlLFxuICAgIHBvc2l0aW9uOiAnJyxcbiAgICBtYXJnaW46ICcnLFxuICAgIHdvcmQ6ICcnLFxuICAgIGF1ZGlvOiAnJyxcbiAgICBwcm9uOiAnJyxcbiAgICBkZWZpbml0aW9uOiAnJyxcbiAgICBpc1NsaWRpbmdEb3duOiBmYWxzZSxcbiAgICBpc0RldGFpbDogZmFsc2UsXG4gICAgZXhhbXBsZXM6IFt7dHJhbnNsYXRpb246ICfmmoLml6Dkvovlj6UnfV0sXG4gICAgd29yZElkOiAwXG4gIH07XG5cbiAgY29tcHV0ZWQgPSB7XG4gICAgY3NzVGV4dCgpIHtcbiAgICAgIGxldCBzdHlsZXMgPSB7fVxuICAgICAgaWYgKHRoaXMucG9zaXRpb24gPT09ICd0b3AnKSB7XG4gICAgICAgIHN0eWxlcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb25cbiAgICAgICAgc3R5bGVzLnRvcCA9IHRoaXMubWFyZ2luIHx8ICcnXG4gICAgICB9IGVsc2UgaWYgKHRoaXMucG9zaXRpb24gPT09ICdib3R0b20nKSB7XG4gICAgICAgIHN0eWxlcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb25cbiAgICAgICAgc3R5bGVzLnRvcCA9ICdpbml0aWFsJ1xuICAgICAgICBzdHlsZXMuYm90dG9tID0gdGhpcy5tYXJnaW4gfHwgJydcbiAgICAgIH1cbiAgICAgIGxldCBjc3MgPSBPYmplY3Qua2V5cyhzdHlsZXMpXG4gICAgICAubWFwKGtleSA9PiAoa2V5ICsgJzonICsgc3R5bGVzW2tleV0pKVxuICAgICAgLmpvaW4oJzsnKVxuICAgICAgcmV0dXJuIGNzc1xuICAgIH1cbiAgfTtcbiAgbWV0aG9kcz17XG4gICAgc3RvcFByb3BhZ2F0aW9uKGUpIHtcbiAgICB9LFxuICAgIHBsYXkoKSB7XG4gICAgICB0aGlzLmF1ZGlvQ3R4LnBsYXkoKVxuICAgIH0sXG4gICAgdG91Y2htb3ZlKGUpIHtcbiAgICAgIGlmICh0aGlzLmlzVG91Y2hpbmcpIHJldHVyblxuICAgICAgbGV0IGN1cnJlbnRZID0gZS50b3VjaGVzWzBdLnBhZ2VZXG4gICAgICBpZiAoY3VycmVudFkgPT09IHRoaXMubGFzdFkpIHJldHVyblxuICAgICAgbGV0IGlzU2xpZGVEb3duID0gY3VycmVudFkgPiB0aGlzLmxhc3RZXG4gICAgICB0aGlzLmlzVG91Y2hpbmcgPSB0cnVlIC8vIOmBv+WFjeivr+inplxuICAgICAgdGhpcy5oYW5kbGVTbGlkZShpc1NsaWRlRG93bilcbiAgICB9LFxuICAgIHRvdWNoc3RhcnQoZSkge1xuICAgICAgdGhpcy5sYXN0WSA9IGUudG91Y2hlc1swXS5wYWdlWVxuICAgIH0sXG4gICAgdG91Y2hlbmQoZSkge1xuICAgICAgdGhpcy5pc1RvdWNoaW5nID0gZmFsc2VcbiAgICB9LFxuICAgIHZpZXdNb3JlKCkge1xuICAgICAgdGhpcy5nZXREZXRhaWxzKClcbiAgICB9LFxuICAgIGNsb3NlKCkge1xuICAgICAgdGhpcy5oaWRlKClcbiAgICB9XG4gIH1cbiAgc2hvdyh7d29yZCwgb3B0aW9uc30pIHtcbiAgICBpZiAoIXdvcmQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLnZpc2libGUgPSB0cnVlXG4gICAgdGhpcy53b3JkID0gd29yZFxuICAgIC8vIOa4heepuuW9k+WJjee7k+aenO+8jOmBv+WFjeWcqOe9kee7nOaFoueahOaDheWGteS4i+eCueWHu+S6huS4i+S4gOS4quivjSDnv7vor5HmoYblhoXlrrnov5jlgZznlZnlnKjkuIrkuIDkuKror41cbiAgICB0aGlzLnByb24gPSAnJ1xuICAgIHRoaXMuZGVmaW5pdGlvbiA9ICcnXG4gICAgdGhpcy5hdWRpbyA9ICcnXG4gICAgdGhpcy4kYXBwbHkoKVxuICAgIHd4LnJlcXVlc3Qoe1xuICAgICAgdXJsOiBgaHR0cHM6Ly9hcGkuc2hhbmJheS5jb20vYmRjL3NlYXJjaC8/d29yZD0ke3dvcmR9YCxcbiAgICAgIHN1Y2Nlc3M6IChyZXMpID0+IHtcbiAgICAgICAgaWYgKHJlcy5kYXRhLm1zZyA9PT0gJ1NVQ0NFU1MnKSB7XG4gICAgICAgICAgdmFyIHthdWRpbywgcHJvbiwgZGVmaW5pdGlvbiwgaWQsIGNvbnRlbnR9ID0gcmVzLmRhdGEuZGF0YVxuICAgICAgICAgIHRoaXMud29yZCA9IGNvbnRlbnQgLy8g55So6L+U5Zue55qE6K+N5bGV56S677yM5L6L5aaC5p+l6K+i55qE5Y2V6K+N5piv4oCcRGFpbHnigJ0s6L+U5Zue55qE5piv4oCcZGFpbHnigJ3vvIzku6Xov5Tlm57nmoTnu5PmnpzkuLrlh4ZcbiAgICAgICAgICB0aGlzLmF1ZGlvID0gYXVkaW9cbiAgICAgICAgICB0aGlzLnByb24gPSBwcm9uID8gYC8ke3Byb259L2AgOiAnJ1xuICAgICAgICAgIHRoaXMuZGVmaW5pdGlvbiA9IGRlZmluaXRpb24uc3BsaXQoL1xcclxcbnxcXG58XFxyLylcbiAgICAgICAgICB0aGlzLmF1ZGlvQ3R4LnNldFNyYyhhdWRpbylcbiAgICAgICAgICB0aGlzLndvcmRJZCA9IGlkXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5wcm9uID0gJydcbiAgICAgICAgICB0aGlzLmF1ZGlvQ3R4LnNldFNyYygnJylcbiAgICAgICAgICB0aGlzLmRlZmluaXRpb24gPSBbXS5jb25jYXQocmVzLmRhdGEubXNnKVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuJGFwcGx5KClcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIGhpZGUoKSB7XG4gICAgdGhpcy5pc1NsaWRpbmdEb3duID0gdHJ1ZVxuICAgIHRoaXMuJGFwcGx5KClcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlXG4gICAgICB0aGlzLndvcmQgPSAnJ1xuICAgICAgdGhpcy5hdWRpbyA9ICcnXG4gICAgICB0aGlzLnByb24gPSAnJ1xuICAgICAgdGhpcy5kZWZpbml0aW9uID0gJydcbiAgICAgIHRoaXMucG9zaXRpb24gPSAnJ1xuICAgICAgdGhpcy5tYXJnaW4gPSAnJ1xuICAgICAgdGhpcy5pc1NsaWRpbmdEb3duID0gZmFsc2VcbiAgICAgIHRoaXMuaXNEZXRhaWwgPSBmYWxzZVxuICAgICAgdGhpcy5leGFtcGxlcyA9IFt7dHJhbnNsYXRpb246ICfmmoLml6Dkvovlj6UnfV1cbiAgICAgIHRoaXMud29yZElkID0gMFxuICAgICAgdGhpcy4kYXBwbHkoKVxuICAgIH0sIDMwMClcbiAgfVxuICBnZXREZXRhaWxzKCkge1xuICAgIHRoaXMuaXNEZXRhaWwgPSB0cnVlXG4gICAgd3gucmVxdWVzdCh7XG4gICAgICB1cmw6IGBodHRwczovL2FwaS5zaGFuYmF5LmNvbS9iZGMvZXhhbXBsZS8/dm9jYWJ1bGFyeV9pZD0ke3RoaXMud29yZElkfSZ0eXBlPXN5c2AsXG4gICAgICBzdWNjZXNzOiAocmVzKSA9PiB7XG4gICAgICAgIGlmIChyZXMuZGF0YS5tc2cgPT09ICdTVUNDRVNTJyAmJiByZXMuZGF0YS5kYXRhLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuZXhhbXBsZXMgPSByZXMuZGF0YS5kYXRhLm1hcChpdGVtID0+ICh7XG4gICAgICAgICAgICBmaXJzdDogaXRlbS5maXJzdCxcbiAgICAgICAgICAgIGxhc3Q6IGl0ZW0ubGFzdCxcbiAgICAgICAgICAgIHdvcmQ6IGl0ZW0ud29yZCxcbiAgICAgICAgICAgIHRyYW5zbGF0aW9uOiBpdGVtLnRyYW5zbGF0aW9uXG4gICAgICAgICAgfSkpXG4gICAgICAgICAgdGhpcy4kYXBwbHkoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBoYW5kbGVTbGlkZShpc1NsaWRlRG93bikge1xuICAgIGlmIChpc1NsaWRlRG93bikge1xuICAgICAgaWYgKHRoaXMuaXNTbGlkaW5nRG93biA9PT0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5oaWRlKClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5nZXREZXRhaWxzKClcbiAgICB9XG4gIH1cbiAgb25Mb2FkKCkge1xuICAgIHRoaXMuYXVkaW9DdHggPSB3eC5jcmVhdGVBdWRpb0NvbnRleHQoJ2F1ZGlvJylcbiAgICAvLyB3eC5yZXF1ZXN0KHtcbiAgICAvLyAgIHVybDogJ2h0dHBzOi8vd3d3LnNoYW5iYXkuY29tL2FwaS92Mi9uZXdzL25vdGVzLz9wYXJhX2lkPUExNTI3MThQMTM0NzE4JmlwcD0zJnBhZ2U9MScsXG4gICAgLy8gICBzdWNjZXNzOiAocmVzKSA9PiB7XG4gICAgLy8gICAgIC8vIGRlYnVnZ2VyXG4gICAgLy8gICB9XG4gICAgLy8gfSlcbiAgfVxufVxuIl19