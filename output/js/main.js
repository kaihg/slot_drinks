var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var App;
(function (App) {
    var Constants = /** @class */ (function () {
        function Constants() {
        }
        Constants.SYMBOL_WIDTH = 200;
        Constants.SYMBOL_HEIGHT = 100;
        return Constants;
    }());
    App.Constants = Constants;
})(App || (App = {}));
var App;
(function (App) {
    var Main = /** @class */ (function () {
        function Main() {
            this.initPIXI();
            this.startLoading();
        }
        Main.prototype.initPIXI = function () {
            this.app = new PIXI.Application(window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio, { backgroundColor: 0x1099bb });
            this.app.view.style.width = "100%";
            this.app.view.style.height = "100%";
            document.body.appendChild(this.app.view);
            if (window.addEventListener) {
                window.addEventListener("resize", this.onResize.bind(this), true);
            }
        };
        Main.prototype.onResize = function () {
            this.app.renderer.resize(window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio);
            if (this.app.screen.width < 2.5 * App.Constants.SYMBOL_WIDTH) {
                // 切直
                this.reelView.x = this.app.screen.width / 2;
                this.reelView.y = this.app.screen.height / 2 - 200;
                this.goodReelView.x = this.app.screen.width / 2;
                this.goodReelView.y = this.app.screen.height / 2;
            }
            else {
                // 切橫
                this.reelView.x = this.app.screen.width / 2 - 125;
                this.reelView.y = this.app.screen.height / 2;
                this.goodReelView.x = this.app.screen.width / 2 + 125;
                this.goodReelView.y = this.app.screen.height / 2;
            }
            this.spinBtn.x = this.app.screen.width / 2;
            this.spinBtn.y = this.goodReelView.y + App.Constants.SYMBOL_HEIGHT;
        };
        Main.prototype.startLoading = function () {
            var _this = this;
            var loadingView = new view.LoadingView();
            loadingView.x = this.app.screen.width / 2;
            loadingView.y = this.app.screen.height / 2;
            this.app.stage.addChild(loadingView);
            PIXI.loader
                .on("progress", function (loader, resource) { loadingView.updateProgress(loader.progress); })
                .add("shops", "resource/shops.json")
                .load(function () {
                loadingView.parent.removeChild(loadingView);
                _this.onLoaded();
            });
        };
        Main.prototype.onLoaded = function () {
            this.initReelView(PIXI.loader.resources.shops.data);
            this.initSpinButton();
            this.onResize();
        };
        Main.prototype.initReelView = function (shops) {
            console.log(shops);
            var reel = new view.ReelView(shops.normal);
            var text1 = new PIXI.Text("普通");
            text1.anchor.set(0.5);
            text1.y = -75;
            reel.addChild(text1);
            this.app.stage.addChild(reel);
            this.reelView = reel;
            // 老闆的
            var reel2 = new view.ReelView(shops.good);
            var text2 = new PIXI.Text("爽");
            text2.anchor.set(0.5);
            text2.y = -75;
            reel2.addChild(text2);
            this.app.stage.addChild(reel2);
            this.goodReelView = reel2;
        };
        Main.prototype.initSpinButton = function () {
            var btn = new view.Button("開始");
            btn.anchor.set(0.5);
            btn.x = this.reelView.x;
            btn.y = this.reelView.y + App.Constants.SYMBOL_HEIGHT;
            btn.buttonWidth = App.Constants.SYMBOL_WIDTH;
            btn.buttonHeight = 55;
            // btn.x = this.app.screen.width - 64;
            // btn.y = this.app.screen.height - 48;
            btn.interactive = true;
            btn.on('pointerup', this.spin.bind(this));
            this.spinBtn = btn;
            this.app.stage.addChild(btn);
            // let testBtn = new view.Button();
            // testBtn.buttonWidth = App.Constants.SYMBOL_WIDTH;
            // testBtn.buttonHeight = 75;
            // // testBtn.redraw();
            // testBtn.x = this.reelView.x;
            // testBtn.y = this.reelView.y + App.Constants.SYMBOL_HEIGHT *2;
            // this.app.stage.addChild(testBtn);
        };
        Main.prototype.spin = function () {
            this.reelView.onSpin();
            this.goodReelView.onSpin();
            this.reelView.filters = null;
            this.goodReelView.filters = null;
            // let outlineFilter = [this.filter || new PIXI.filters.OutlineFilter(5, 0xff0000)];
            var outlineFilter = this.filter || [new PIXI.filters.GlowFilter(15)];
            this.filter = outlineFilter;
            var obj = { "var": 0 };
            TweenLite.to(obj, 5, { "var": Math.random() * 2 + 15, onUpdate: this.changeOutlineFilter, onUpdateParams: [obj, outlineFilter], onUpdateScope: this, ease: Quad.easeInOut });
        };
        Main.prototype.changeOutlineFilter = function (obj, filter) {
            var index = Math.round(obj["var"]) % 2;
            if (index) {
                this.reelView.filters = filter;
                this.goodReelView.filters = null;
            }
            else {
                this.reelView.filters = null;
                this.goodReelView.filters = filter;
            }
        };
        return Main;
    }());
    App.Main = Main;
})(App || (App = {}));
var view;
(function (view) {
    var HoverType;
    (function (HoverType) {
        HoverType[HoverType["type1"] = 0] = "type1";
    })(HoverType = view.HoverType || (view.HoverType = {}));
    var ButtonHoverEffect = /** @class */ (function () {
        function ButtonHoverEffect() {
        }
        ButtonHoverEffect.onHover = function (type, tweenObj, isOverIn) {
            switch (type) {
                case HoverType.type1:
                    ButtonHoverEffect.alphaVisible(tweenObj, isOverIn);
                    break;
            }
        };
        ButtonHoverEffect.alphaVisible = function (tweenObj, isOverIn) {
            var sec = 0.5;
            TweenLite.killTweensOf(tweenObj);
            if (isOverIn) {
                TweenLite.to(tweenObj, sec, { alpha: 1 });
            }
            else {
                TweenLite.to(tweenObj, sec, { alpha: 0, onComplete: function () { tweenObj.visible = false; } });
            }
        };
        return ButtonHoverEffect;
    }());
    view.ButtonHoverEffect = ButtonHoverEffect;
})(view || (view = {}));
var view;
(function (view) {
    var Button = /** @class */ (function (_super) {
        __extends(Button, _super);
        function Button(text) {
            if (text === void 0) { text = "Button"; }
            var _this = _super.call(this) || this;
            _this.hoverType = view.HoverType.type1;
            _this.frameColor = 0xffffff;
            _this.bgColor = 0x0011ff;
            _this.bgColorOnClick = 0x33aaaa;
            _this.bgView = new PIXI.Graphics();
            _this.effect = new PIXI.Sprite(PIXI.Texture.WHITE);
            _this.effect.anchor.set(0.5);
            _this.effect.visible = false;
            _this.effect.alpha = 0;
            _this.label = new PIXI.Text(text, { fill: _this.frameColor });
            _this.label.anchor.set(0.5);
            _this.addChild(_this.bgView, _this.effect, _this.label);
            _this.drawNormalSytle();
            // set interactive
            _this.interactive = true;
            _this.buttonMode = true;
            _this.on("pointerover", _this.onButtonOver);
            _this.on("pointerout", _this.onButtonOut);
            _this.on("pointerdown", function () { _this.effect.tint = _this.bgColorOnClick; });
            _this.on("pointerup", function () { _this.effect.tint = _this.frameColor; });
            return _this;
        }
        Button.prototype.drawNormalSytle = function () {
            // let width = this.width;
            // let height = this.height;
            var padding = 10;
            var width = this._buttonWidth || this.label.width + padding;
            var height = this._buttonHeight || this.label.height + padding;
            // let startX =  -width * 0.5;
            // let startY = -height * 0.5;
            var startX = -width * 0.5;
            var startY = -height * 0.5;
            var graph = this.bgView;
            graph.clear();
            graph.beginFill(this.bgColor);
            // graph.drawRect(startX,startY,width,height);
            // graph.endFill();
            graph.lineStyle(5, this.frameColor);
            graph.moveTo(startX, startY);
            graph.lineTo(startX + width, startY);
            graph.lineTo(startX + width, startY + height);
            graph.lineTo(startX, startY + height);
            graph.lineTo(startX, startY);
            graph.endFill();
        };
        Object.defineProperty(Button.prototype, "buttonWidth", {
            set: function (width) {
                this._buttonWidth = Math.max(width, this.label.width);
                this.redraw();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "buttonHeight", {
            set: function (height) {
                this._buttonHeight = Math.max(height, this.label.height);
                this.redraw();
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype.redraw = function () {
            this.drawNormalSytle();
        };
        Button.prototype.onButtonOver = function () {
            this.effect.width = this._buttonWidth;
            this.effect.height = this._buttonHeight;
            this.effect.visible = true;
            this.effect.tint = this.frameColor;
            view.ButtonHoverEffect.onHover(this.hoverType, this.effect, true);
            this.label.style.fill = this.bgColor;
        };
        Button.prototype.onButtonOut = function () {
            view.ButtonHoverEffect.onHover(this.hoverType, this.effect, false);
            this.label.style.fill = this.frameColor;
        };
        return Button;
    }(PIXI.Sprite));
    view.Button = Button;
})(view || (view = {}));
var view;
(function (view) {
    var LoadingView = /** @class */ (function (_super) {
        __extends(LoadingView, _super);
        function LoadingView() {
            var _this = _super.call(this) || this;
            _this.progress = 0;
            _this.color = 0xaabc13;
            return _this;
        }
        LoadingView.prototype.updateProgress = function (p) {
            var percent = p;
            this.progress = percent;
            this.clear();
            this.lineStyle(10, this.color);
            // this.drawCircle(0, 0, 2 * Math.PI * percent);
            this.arc(0, 0, 50, 0, 2 * Math.PI * percent);
            this.endFill();
        };
        return LoadingView;
    }(PIXI.Graphics));
    view.LoadingView = LoadingView;
})(view || (view = {}));
var view;
(function (view) {
    var ReelView = /** @class */ (function (_super) {
        __extends(ReelView, _super);
        // private _mask: PIXI.DisplayObject;
        function ReelView(shops) {
            var _this = _super.call(this) || this;
            _this.tempIds = [0, 1, 2];
            _this.shops = shops;
            var width = App.Constants.SYMBOL_WIDTH;
            var height = App.Constants.SYMBOL_HEIGHT;
            _this.frame = new PIXI.Graphics();
            _this.frame.lineStyle(10, 0x000000);
            _this.frame.drawRect(-width * 0.5, -height * 0.5, width, height);
            _this.frame.endFill();
            // mask
            var mask = new PIXI.Graphics();
            mask.beginFill(0xFFFFFF);
            mask.drawRect(-width * 0.5, -height * 0.5, width, height);
            mask.endFill();
            // wheel
            var wheel = new view.WheelView(shops);
            wheel.mask = mask;
            wheel.setIds(_this.tempIds);
            _this.wheel = wheel;
            _this.addChild(wheel, mask, _this.frame);
            _this.updateShop(_this.tempIds);
            return _this;
        }
        ReelView.prototype.updateShop = function (shopId) {
            this.wheel.setIds(shopId);
        };
        ReelView.prototype.onSpin = function () {
            if (this.spining) {
                return;
            }
            this.spining = true;
            var dampingStartSec = 0.5;
            TweenMax.to(this.wheel.position, dampingStartSec, { y: -40, yoyo: true, repeat: 1 });
            TweenMax.fromTo(this.wheel.position, 0.2, { y: 0 }, { delay: dampingStartSec * 2, y: App.Constants.SYMBOL_HEIGHT, repeat: 10, ease: Linear.easeNone, onRepeat: this.swapId, onRepeatScope: this, onComplete: this.onSpinComplete, onCompleteScope: this });
        };
        ReelView.prototype.randomId = function () {
            return Math.floor(Math.random() * this.shops.length);
        };
        ReelView.prototype.swapId = function () {
            this.tempIds.unshift(this.randomId());
            this.updateShop(this.tempIds);
        };
        ReelView.prototype.onSpinComplete = function () {
            this.spining = false;
            this.tempIds.unshift(this.randomId());
            this.tempIds.unshift(this.randomId());
            this.updateShop(this.tempIds);
            TweenLite.fromTo(this.wheel.position, 1, { y: -App.Constants.SYMBOL_HEIGHT }, { y: 0, ease: Back.easeOut });
        };
        return ReelView;
    }(PIXI.Sprite));
    view.ReelView = ReelView;
})(view || (view = {}));
var view;
(function (view) {
    var WheelView = /** @class */ (function (_super) {
        __extends(WheelView, _super);
        function WheelView(shops) {
            var _this = _super.call(this, PIXI.Texture.EMPTY) || this;
            _this.shops = shops;
            for (var i = 0; i < 3; i++) {
                var symbolText = new PIXI.Text("", { fill: "0x000000" });
                symbolText.anchor.set(0.5);
                var bg = new PIXI.Sprite(PIXI.Texture.WHITE);
                bg.width = App.Constants.SYMBOL_WIDTH;
                bg.height = App.Constants.SYMBOL_HEIGHT;
                bg.anchor.set(0.5);
                var container = new PIXI.Container();
                container.addChild(bg, symbolText);
                container.y = (i - 1) * App.Constants.SYMBOL_HEIGHT;
                _this.addChild(container);
            }
            return _this;
        }
        WheelView.prototype.setIds = function (ids) {
            var _this = this;
            this.children.forEach(function (child, i) {
                var textView = child.getChildAt(1);
                textView.text = _this.shops[ids[i]];
            });
        };
        return WheelView;
    }(PIXI.Sprite));
    view.WheelView = WheelView;
})(view || (view = {}));
var vo;
(function (vo) {
    var ShopsVO = /** @class */ (function () {
        function ShopsVO() {
        }
        return ShopsVO;
    }());
    vo.ShopsVO = ShopsVO;
})(vo || (vo = {}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Db25zdGFudHMudHMiLCJzcmMvTWFpbi50cyIsInNyYy9lZmZlY3QvQnV0dG9uSG92ZXJFZmZlY3QudHMiLCJzcmMvdmlldy9CdXR0b24udHMiLCJzcmMvdmlldy9Mb2FkaW5nVmlldy50cyIsInNyYy92aWV3L1JlZWxWaWV3LnRzIiwic3JjL3ZpZXcvV2hlZWxWaWV3LnRzIiwic3JjL3ZvL1Nob3BzVk8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQU8sR0FBRyxDQUtUO0FBTEQsV0FBTyxHQUFHO0lBQ047UUFBQTtRQUdBLENBQUM7UUFGaUIsc0JBQVksR0FBRyxHQUFHLENBQUM7UUFDbkIsdUJBQWEsR0FBRyxHQUFHLENBQUM7UUFDdEMsZ0JBQUM7S0FIRCxBQUdDLElBQUE7SUFIWSxhQUFTLFlBR3JCLENBQUE7QUFDTCxDQUFDLEVBTE0sR0FBRyxLQUFILEdBQUcsUUFLVDtBQ0xELElBQU8sR0FBRyxDQXdKVDtBQXhKRCxXQUFPLEdBQUc7SUFDTjtRQVNJO1lBRUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUV4QixDQUFDO1FBRU8sdUJBQVEsR0FBaEI7WUFDSSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxXQUFXLEdBQUcsZ0JBQWdCLEVBQUUsRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUM1SSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztZQUNuQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUVwQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxD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bGFzcyBDb25zdGFudHMge1xuICAgICAgICBwdWJsaWMgc3RhdGljIFNZTUJPTF9XSURUSCA9IDIwMDtcbiAgICAgICAgcHVibGljIHN0YXRpYyBTWU1CT0xfSEVJR0hUID0gMTAwO1xuICAgIH1cbn0iLCJtb2R1bGUgQXBwIHtcbiAgICBleHBvcnQgY2xhc3MgTWFpbiB7XG5cbiAgICAgICAgcHJpdmF0ZSBhcHA6IFBJWEkuQXBwbGljYXRpb247XG5cbiAgICAgICAgcHJpdmF0ZSByZWVsVmlldzogdmlldy5SZWVsVmlldztcbiAgICAgICAgcHJpdmF0ZSBnb29kUmVlbFZpZXc6IHZpZXcuUmVlbFZpZXc7XG4gICAgICAgIHByaXZhdGUgc3BpbkJ0bjogUElYSS5EaXNwbGF5T2JqZWN0O1xuICAgICAgICBmaWx0ZXI6IFBJWEkuRmlsdGVyW107XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdFBJWEkoKTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRMb2FkaW5nKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgaW5pdFBJWEkoKSB7XG4gICAgICAgICAgICB0aGlzLmFwcCA9IG5ldyBQSVhJLkFwcGxpY2F0aW9uKHdpbmRvdy5pbm5lcldpZHRoICogZGV2aWNlUGl4ZWxSYXRpbywgd2luZG93LmlubmVySGVpZ2h0ICogZGV2aWNlUGl4ZWxSYXRpbywgeyBiYWNrZ3JvdW5kQ29sb3I6IDB4MTA5OWJiIH0pO1xuICAgICAgICAgICAgdGhpcy5hcHAudmlldy5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgICAgICAgdGhpcy5hcHAudmlldy5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmFwcC52aWV3KTtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMub25SZXNpemUuYmluZCh0aGlzKSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBvblJlc2l6ZSgpIHtcbiAgICAgICAgICAgIHRoaXMuYXBwLnJlbmRlcmVyLnJlc2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCAqIGRldmljZVBpeGVsUmF0aW8sIHdpbmRvdy5pbm5lckhlaWdodCAqIGRldmljZVBpeGVsUmF0aW8pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5hcHAuc2NyZWVuLndpZHRoIDwgMi41ICogQXBwLkNvbnN0YW50cy5TWU1CT0xfV0lEVEgpIHtcbiAgICAgICAgICAgICAgICAvLyDliIfnm7RcbiAgICAgICAgICAgICAgICB0aGlzLnJlZWxWaWV3LnggPSB0aGlzLmFwcC5zY3JlZW4ud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgIHRoaXMucmVlbFZpZXcueSA9IHRoaXMuYXBwLnNjcmVlbi5oZWlnaHQgLyAyIC0gMjAwO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcueCA9IHRoaXMuYXBwLnNjcmVlbi53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcueSA9IHRoaXMuYXBwLnNjcmVlbi5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyDliIfmqatcbiAgICAgICAgICAgICAgICB0aGlzLnJlZWxWaWV3LnggPSB0aGlzLmFwcC5zY3JlZW4ud2lkdGggLyAyIC0gMTI1O1xuICAgICAgICAgICAgICAgIHRoaXMucmVlbFZpZXcueSA9IHRoaXMuYXBwLnNjcmVlbi5oZWlnaHQgLyAyO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcueCA9IHRoaXMuYXBwLnNjcmVlbi53aWR0aCAvIDIgKyAxMjU7XG4gICAgICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcueSA9IHRoaXMuYXBwLnNjcmVlbi5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNwaW5CdG4ueCA9IHRoaXMuYXBwLnNjcmVlbi53aWR0aCAvIDI7XG4gICAgICAgICAgICB0aGlzLnNwaW5CdG4ueSA9IHRoaXMuZ29vZFJlZWxWaWV3LnkgKyBBcHAuQ29uc3RhbnRzLlNZTUJPTF9IRUlHSFQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydExvYWRpbmcoKTogYW55IHtcbiAgICAgICAgICAgIGxldCBsb2FkaW5nVmlldyA9IG5ldyB2aWV3LkxvYWRpbmdWaWV3KCk7XG4gICAgICAgICAgICBsb2FkaW5nVmlldy54ID0gdGhpcy5hcHAuc2NyZWVuLndpZHRoIC8gMjtcbiAgICAgICAgICAgIGxvYWRpbmdWaWV3LnkgPSB0aGlzLmFwcC5zY3JlZW4uaGVpZ2h0IC8gMjtcblxuICAgICAgICAgICAgdGhpcy5hcHAuc3RhZ2UuYWRkQ2hpbGQobG9hZGluZ1ZpZXcpO1xuXG4gICAgICAgICAgICBQSVhJLmxvYWRlclxuICAgICAgICAgICAgICAgIC5vbihcInByb2dyZXNzXCIsIChsb2FkZXI6IFBJWEkubG9hZGVycy5Mb2FkZXIsIHJlc291cmNlOiBQSVhJLmxvYWRlcnMuUmVzb3VyY2UpID0+IHsgbG9hZGluZ1ZpZXcudXBkYXRlUHJvZ3Jlc3MobG9hZGVyLnByb2dyZXNzKSB9KVxuICAgICAgICAgICAgICAgIC5hZGQoXCJzaG9wc1wiLCBcInJlc291cmNlL3Nob3BzLmpzb25cIilcbiAgICAgICAgICAgICAgICAubG9hZCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmdWaWV3LnBhcmVudC5yZW1vdmVDaGlsZChsb2FkaW5nVmlldyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Mb2FkZWQoKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgb25Mb2FkZWQoKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRSZWVsVmlldyhQSVhJLmxvYWRlci5yZXNvdXJjZXMuc2hvcHMuZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmluaXRTcGluQnV0dG9uKCk7XG4gICAgICAgICAgICB0aGlzLm9uUmVzaXplKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0UmVlbFZpZXcoc2hvcHM6IHZvLlNob3BzVk8pIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNob3BzKTtcbiAgICAgICAgICAgIGxldCByZWVsID0gbmV3IHZpZXcuUmVlbFZpZXcoc2hvcHMubm9ybWFsKTtcblxuICAgICAgICAgICAgbGV0IHRleHQxID0gbmV3IFBJWEkuVGV4dChcIuaZrumAmlwiKVxuICAgICAgICAgICAgdGV4dDEuYW5jaG9yLnNldCgwLjUpO1xuICAgICAgICAgICAgdGV4dDEueSA9IC03NTtcbiAgICAgICAgICAgIHJlZWwuYWRkQ2hpbGQodGV4dDEpO1xuXG4gICAgICAgICAgICB0aGlzLmFwcC5zdGFnZS5hZGRDaGlsZChyZWVsKTtcbiAgICAgICAgICAgIHRoaXMucmVlbFZpZXcgPSByZWVsO1xuXG4gICAgICAgICAgICAvLyDogIHpl4bnmoRcbiAgICAgICAgICAgIGxldCByZWVsMiA9IG5ldyB2aWV3LlJlZWxWaWV3KHNob3BzLmdvb2QpO1xuICAgICAgICAgICAgbGV0IHRleHQyID0gbmV3IFBJWEkuVGV4dChcIueIvVwiKVxuICAgICAgICAgICAgdGV4dDIuYW5jaG9yLnNldCgwLjUpO1xuICAgICAgICAgICAgdGV4dDIueSA9IC03NTtcbiAgICAgICAgICAgIHJlZWwyLmFkZENoaWxkKHRleHQyKTtcblxuICAgICAgICAgICAgdGhpcy5hcHAuc3RhZ2UuYWRkQ2hpbGQocmVlbDIpO1xuICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcgPSByZWVsMjtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXRTcGluQnV0dG9uKCkge1xuICAgICAgICAgICAgbGV0IGJ0biA9IG5ldyB2aWV3LkJ1dHRvbihcIumWi+Wni1wiKTtcbiAgICAgICAgICAgIGJ0bi5hbmNob3Iuc2V0KDAuNSk7XG4gICAgICAgICAgICBidG4ueCA9IHRoaXMucmVlbFZpZXcueDtcbiAgICAgICAgICAgIGJ0bi55ID0gdGhpcy5yZWVsVmlldy55ICsgQXBwLkNvbnN0YW50cy5TWU1CT0xfSEVJR0hUO1xuICAgICAgICAgICAgYnRuLmJ1dHRvbldpZHRoID0gQXBwLkNvbnN0YW50cy5TWU1CT0xfV0lEVEg7XG4gICAgICAgICAgICBidG4uYnV0dG9uSGVpZ2h0ID0gNTU7XG4gICAgICAgICAgICAvLyBidG4ueCA9IHRoaXMuYXBwLnNjcmVlbi53aWR0aCAtIDY0O1xuICAgICAgICAgICAgLy8gYnRuLnkgPSB0aGlzLmFwcC5zY3JlZW4uaGVpZ2h0IC0gNDg7XG4gICAgICAgICAgICBidG4uaW50ZXJhY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgYnRuLm9uKCdwb2ludGVydXAnLCB0aGlzLnNwaW4uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIHRoaXMuc3BpbkJ0biA9IGJ0bjtcblxuICAgICAgICAgICAgdGhpcy5hcHAuc3RhZ2UuYWRkQ2hpbGQoYnRuKTtcblxuXG4gICAgICAgICAgICAvLyBsZXQgdGVzdEJ0biA9IG5ldyB2aWV3LkJ1dHRvbigpO1xuICAgICAgICAgICAgLy8gdGVzdEJ0bi5idXR0b25XaWR0aCA9IEFwcC5Db25zdGFudHMuU1lNQk9MX1dJRFRIO1xuICAgICAgICAgICAgLy8gdGVzdEJ0bi5idXR0b25IZWlnaHQgPSA3NTtcbiAgICAgICAgICAgIC8vIC8vIHRlc3RCdG4ucmVkcmF3KCk7XG5cbiAgICAgICAgICAgIC8vIHRlc3RCdG4ueCA9IHRoaXMucmVlbFZpZXcueDtcbiAgICAgICAgICAgIC8vIHRlc3RCdG4ueSA9IHRoaXMucmVlbFZpZXcueSArIEFwcC5Db25zdGFudHMuU1lNQk9MX0hFSUdIVCAqMjtcbiAgICAgICAgICAgIC8vIHRoaXMuYXBwLnN0YWdlLmFkZENoaWxkKHRlc3RCdG4pO1xuICAgICAgICB9XG5cbiAgICAgICAgc3BpbigpIHtcbiAgICAgICAgICAgIHRoaXMucmVlbFZpZXcub25TcGluKCk7XG4gICAgICAgICAgICB0aGlzLmdvb2RSZWVsVmlldy5vblNwaW4oKTtcblxuICAgICAgICAgICAgdGhpcy5yZWVsVmlldy5maWx0ZXJzID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZ29vZFJlZWxWaWV3LmZpbHRlcnMgPSBudWxsO1xuXG4gICAgICAgICAgICAvLyBsZXQgb3V0bGluZUZpbHRlciA9IFt0aGlzLmZpbHRlciB8fCBuZXcgUElYSS5maWx0ZXJzLk91dGxpbmVGaWx0ZXIoNSwgMHhmZjAwMDApXTtcbiAgICAgICAgICAgIGxldCBvdXRsaW5lRmlsdGVyID0gdGhpcy5maWx0ZXIgfHwgW25ldyBQSVhJLmZpbHRlcnMuR2xvd0ZpbHRlcigxNSldO1xuICAgICAgICAgICAgdGhpcy5maWx0ZXIgPSBvdXRsaW5lRmlsdGVyO1xuXG4gICAgICAgICAgICBsZXQgb2JqID0geyB2YXI6IDAgfTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS50byhvYmosIDUsIHsgdmFyOiBNYXRoLnJhbmRvbSgpICogMiArIDE1LCBvblVwZGF0ZTogdGhpcy5jaGFuZ2VPdXRsaW5lRmlsdGVyLCBvblVwZGF0ZVBhcmFtczogW29iaiwgb3V0bGluZUZpbHRlcl0sIG9uVXBkYXRlU2NvcGU6IHRoaXMsIGVhc2U6IFF1YWQuZWFzZUluT3V0IH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICBjaGFuZ2VPdXRsaW5lRmlsdGVyKG9iajogeyB2YXI6IG51bWJlciB9LCBmaWx0ZXIpIHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IE1hdGgucm91bmQob2JqLnZhcikgJSAyO1xuXG4gICAgICAgICAgICBpZiAoaW5kZXgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlZWxWaWV3LmZpbHRlcnMgPSBmaWx0ZXI7XG4gICAgICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcuZmlsdGVycyA9IG51bGw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVlbFZpZXcuZmlsdGVycyA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcuZmlsdGVycyA9IGZpbHRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB2aWV3IHtcbiAgICBleHBvcnQgZW51bSBIb3ZlclR5cGUge1xuICAgICAgICB0eXBlMVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBCdXR0b25Ib3ZlckVmZmVjdCB7XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBvbkhvdmVyKHR5cGU6IEhvdmVyVHlwZSwgdHdlZW5PYmo6IFBJWEkuRGlzcGxheU9iamVjdCwgaXNPdmVySW46IGJvb2xlYW4pIHtcblxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBIb3ZlclR5cGUudHlwZTE6XG4gICAgICAgICAgICAgICAgICAgIEJ1dHRvbkhvdmVyRWZmZWN0LmFscGhhVmlzaWJsZSh0d2Vlbk9iaiwgaXNPdmVySW4pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGFscGhhVmlzaWJsZSh0d2Vlbk9iajogUElYSS5EaXNwbGF5T2JqZWN0LCBpc092ZXJJbjogYm9vbGVhbikge1xuICAgICAgICAgICAgbGV0IHNlYyA9IDAuNTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS5raWxsVHdlZW5zT2YodHdlZW5PYmopO1xuXG4gICAgICAgICAgICBpZiAoaXNPdmVySW4pIHtcbiAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8odHdlZW5PYmosIHNlYywgeyBhbHBoYTogMSB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHR3ZWVuT2JqLCBzZWMsIHsgYWxwaGE6IDAsIG9uQ29tcGxldGU6ICgpID0+IHsgdHdlZW5PYmoudmlzaWJsZSA9IGZhbHNlIH0gfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfVxufSIsIm1vZHVsZSB2aWV3IHtcblxuICAgIGV4cG9ydCBjbGFzcyBCdXR0b24gZXh0ZW5kcyBQSVhJLlNwcml0ZSB7XG5cbiAgICAgICAgaG92ZXJUeXBlOiBIb3ZlclR5cGUgPSBIb3ZlclR5cGUudHlwZTE7XG5cblxuICAgICAgICBmcmFtZUNvbG9yID0gMHhmZmZmZmY7XG4gICAgICAgIGJnQ29sb3IgPSAweDAwMTFmZjtcbiAgICAgICAgYmdDb2xvck9uQ2xpY2sgPSAweDMzYWFhYTtcblxuICAgICAgICBsYWJlbDogUElYSS5UZXh0O1xuICAgICAgICBwcml2YXRlIGJnVmlldzogUElYSS5HcmFwaGljcztcblxuICAgICAgICBwcml2YXRlIF9idXR0b25XaWR0aDogbnVtYmVyO1xuICAgICAgICBwcml2YXRlIF9idXR0b25IZWlnaHQ6IG51bWJlcjtcblxuICAgICAgICBwcml2YXRlIGVmZmVjdDogUElYSS5TcHJpdGU7XG5cbiAgICAgICAgY29uc3RydWN0b3IodGV4dCA9IFwiQnV0dG9uXCIpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuYmdWaWV3ID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcblxuICAgICAgICAgICAgdGhpcy5lZmZlY3QgPSBuZXcgUElYSS5TcHJpdGUoUElYSS5UZXh0dXJlLldISVRFKTtcbiAgICAgICAgICAgIHRoaXMuZWZmZWN0LmFuY2hvci5zZXQoMC41KTtcbiAgICAgICAgICAgIHRoaXMuZWZmZWN0LnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZWZmZWN0LmFscGhhID0gMDtcblxuICAgICAgICAgICAgdGhpcy5sYWJlbCA9IG5ldyBQSVhJLlRleHQodGV4dCwgeyBmaWxsOiB0aGlzLmZyYW1lQ29sb3IgfSk7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmFuY2hvci5zZXQoMC41KTtcblxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmJnVmlldywgdGhpcy5lZmZlY3QsIHRoaXMubGFiZWwpO1xuXG4gICAgICAgICAgICB0aGlzLmRyYXdOb3JtYWxTeXRsZSgpO1xuXG4gICAgICAgICAgICAvLyBzZXQgaW50ZXJhY3RpdmVcbiAgICAgICAgICAgIHRoaXMuaW50ZXJhY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5idXR0b25Nb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMub24oXCJwb2ludGVyb3ZlclwiLCB0aGlzLm9uQnV0dG9uT3Zlcik7XG4gICAgICAgICAgICB0aGlzLm9uKFwicG9pbnRlcm91dFwiLCB0aGlzLm9uQnV0dG9uT3V0KTtcbiAgICAgICAgICAgIHRoaXMub24oXCJwb2ludGVyZG93blwiLCgpPT57dGhpcy5lZmZlY3QudGludCA9IHRoaXMuYmdDb2xvck9uQ2xpY2t9KTtcbiAgICAgICAgICAgIHRoaXMub24oXCJwb2ludGVydXBcIiwoKT0+e3RoaXMuZWZmZWN0LnRpbnQgPSB0aGlzLmZyYW1lQ29sb3J9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRyYXdOb3JtYWxTeXRsZSgpIHtcbiAgICAgICAgICAgIC8vIGxldCB3aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgICAgICAgICAvLyBsZXQgaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgICAgICBsZXQgcGFkZGluZyA9IDEwO1xuICAgICAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5fYnV0dG9uV2lkdGggfHwgdGhpcy5sYWJlbC53aWR0aCArIHBhZGRpbmc7XG4gICAgICAgICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5fYnV0dG9uSGVpZ2h0IHx8IHRoaXMubGFiZWwuaGVpZ2h0ICsgcGFkZGluZztcblxuICAgICAgICAgICAgLy8gbGV0IHN0YXJ0WCA9ICAtd2lkdGggKiAwLjU7XG4gICAgICAgICAgICAvLyBsZXQgc3RhcnRZID0gLWhlaWdodCAqIDAuNTtcbiAgICAgICAgICAgIGxldCBzdGFydFggPSAtd2lkdGggKiAwLjU7XG4gICAgICAgICAgICBsZXQgc3RhcnRZID0gLWhlaWdodCAqIDAuNTtcblxuICAgICAgICAgICAgbGV0IGdyYXBoID0gdGhpcy5iZ1ZpZXc7XG4gICAgICAgICAgICBncmFwaC5jbGVhcigpO1xuICAgICAgICAgICAgZ3JhcGguYmVnaW5GaWxsKHRoaXMuYmdDb2xvcik7XG4gICAgICAgICAgICAvLyBncmFwaC5kcmF3UmVjdChzdGFydFgsc3RhcnRZLHdpZHRoLGhlaWdodCk7XG4gICAgICAgICAgICAvLyBncmFwaC5lbmRGaWxsKCk7XG5cbiAgICAgICAgICAgIGdyYXBoLmxpbmVTdHlsZSg1LCB0aGlzLmZyYW1lQ29sb3IpO1xuXG4gICAgICAgICAgICBncmFwaC5tb3ZlVG8oc3RhcnRYLCBzdGFydFkpO1xuICAgICAgICAgICAgZ3JhcGgubGluZVRvKHN0YXJ0WCArIHdpZHRoLCBzdGFydFkpO1xuICAgICAgICAgICAgZ3JhcGgubGluZVRvKHN0YXJ0WCArIHdpZHRoLCBzdGFydFkgKyBoZWlnaHQpO1xuICAgICAgICAgICAgZ3JhcGgubGluZVRvKHN0YXJ0WCwgc3RhcnRZICsgaGVpZ2h0KTtcbiAgICAgICAgICAgIGdyYXBoLmxpbmVUbyhzdGFydFgsIHN0YXJ0WSk7XG5cbiAgICAgICAgICAgIGdyYXBoLmVuZEZpbGwoKTtcblxuXG4gICAgICAgIH1cblxuICAgICAgICBzZXQgYnV0dG9uV2lkdGgod2lkdGg6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5fYnV0dG9uV2lkdGggPSBNYXRoLm1heCh3aWR0aCwgdGhpcy5sYWJlbC53aWR0aCk7XG4gICAgICAgICAgICB0aGlzLnJlZHJhdygpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IGJ1dHRvbkhlaWdodChoZWlnaHQ6IG51bWJlcikge1xuICAgICAgICAgICAgdGhpcy5fYnV0dG9uSGVpZ2h0ID0gTWF0aC5tYXgoaGVpZ2h0LCB0aGlzLmxhYmVsLmhlaWdodCk7XG4gICAgICAgICAgICB0aGlzLnJlZHJhdygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVkcmF3KCkge1xuICAgICAgICAgICAgdGhpcy5kcmF3Tm9ybWFsU3l0bGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9uQnV0dG9uT3ZlcigpIHtcbiAgICAgICAgICAgIHRoaXMuZWZmZWN0LndpZHRoID0gdGhpcy5fYnV0dG9uV2lkdGg7XG4gICAgICAgICAgICB0aGlzLmVmZmVjdC5oZWlnaHQgPSB0aGlzLl9idXR0b25IZWlnaHQ7XG5cbiAgICAgICAgICAgIHRoaXMuZWZmZWN0LnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5lZmZlY3QudGludCA9IHRoaXMuZnJhbWVDb2xvcjtcblxuXG4gICAgICAgICAgICBCdXR0b25Ib3ZlckVmZmVjdC5vbkhvdmVyKHRoaXMuaG92ZXJUeXBlLHRoaXMuZWZmZWN0LHRydWUpO1xuXG4gICAgICAgICAgICB0aGlzLmxhYmVsLnN0eWxlLmZpbGwgPSB0aGlzLmJnQ29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBvbkJ1dHRvbk91dCgpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQnV0dG9uSG92ZXJFZmZlY3Qub25Ib3Zlcih0aGlzLmhvdmVyVHlwZSx0aGlzLmVmZmVjdCxmYWxzZSk7XG5cbiAgICAgICAgICAgIHRoaXMubGFiZWwuc3R5bGUuZmlsbCA9IHRoaXMuZnJhbWVDb2xvcjtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJtb2R1bGUgdmlldyB7XG4gICAgZXhwb3J0IGNsYXNzIExvYWRpbmdWaWV3IGV4dGVuZHMgUElYSS5HcmFwaGljcyB7XG5cbiAgICAgICAgcHJpdmF0ZSBwcm9ncmVzczogbnVtYmVyID0gMDtcbiAgICAgICAgY29sb3I6IG51bWJlciA9IDB4YWFiYzEzXG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHVwZGF0ZVByb2dyZXNzKHA6IG51bWJlcikge1xuICAgICAgICAgICAgbGV0IHBlcmNlbnQgPSBwO1xuICAgICAgICAgICAgdGhpcy5wcm9ncmVzcyA9IHBlcmNlbnQ7XG5cbiAgICAgICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgICAgIHRoaXMubGluZVN0eWxlKDEwLCB0aGlzLmNvbG9yKTtcbiAgICAgICAgICAgIC8vIHRoaXMuZHJhd0NpcmNsZSgwLCAwLCAyICogTWF0aC5QSSAqIHBlcmNlbnQpO1xuICAgICAgICAgICAgdGhpcy5hcmMoMCwgMCwgNTAsIDAsIDIgKiBNYXRoLlBJICogcGVyY2VudCk7XG4gICAgICAgICAgICB0aGlzLmVuZEZpbGwoKTtcbiAgICAgICAgfVxuXG4gICAgfVxufVxuIiwibW9kdWxlIHZpZXcge1xuICAgIGV4cG9ydCBjbGFzcyBSZWVsVmlldyBleHRlbmRzIFBJWEkuU3ByaXRlIHtcblxuICAgICAgICBwcml2YXRlIGZyYW1lOiBQSVhJLkdyYXBoaWNzO1xuICAgICAgICBwcml2YXRlIHdoZWVsOiB2aWV3LldoZWVsVmlldztcbiAgICAgICAgcHJpdmF0ZSBzaG9wczogc3RyaW5nW107XG5cbiAgICAgICAgcHJpdmF0ZSB0ZW1wSWRzOiBudW1iZXJbXSA9IFswLCAxLCAyXTtcbiAgICAgICAgc3BpbmluZzogYm9vbGVhbjtcbiAgICAgICAgLy8gcHJpdmF0ZSBfbWFzazogUElYSS5EaXNwbGF5T2JqZWN0O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHNob3BzOiBzdHJpbmdbXSkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgICAgIHRoaXMuc2hvcHMgPSBzaG9wcztcblxuICAgICAgICAgICAgbGV0IHdpZHRoID0gQXBwLkNvbnN0YW50cy5TWU1CT0xfV0lEVEg7XG4gICAgICAgICAgICBsZXQgaGVpZ2h0ID0gQXBwLkNvbnN0YW50cy5TWU1CT0xfSEVJR0hUO1xuXG4gICAgICAgICAgICB0aGlzLmZyYW1lID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbiAgICAgICAgICAgIHRoaXMuZnJhbWUubGluZVN0eWxlKDEwLCAweDAwMDAwMCk7XG4gICAgICAgICAgICB0aGlzLmZyYW1lLmRyYXdSZWN0KC13aWR0aCAqIDAuNSwgLWhlaWdodCAqIDAuNSwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICB0aGlzLmZyYW1lLmVuZEZpbGwoKTtcblxuICAgICAgICAgICAgLy8gbWFza1xuICAgICAgICAgICAgbGV0IG1hc2sgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuICAgICAgICAgICAgbWFzay5iZWdpbkZpbGwoMHhGRkZGRkYpO1xuICAgICAgICAgICAgbWFzay5kcmF3UmVjdCgtd2lkdGggKiAwLjUsIC1oZWlnaHQgKiAwLjUsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgICAgbWFzay5lbmRGaWxsKCk7XG5cblxuICAgICAgICAgICAgLy8gd2hlZWxcbiAgICAgICAgICAgIGxldCB3aGVlbCA9IG5ldyB2aWV3LldoZWVsVmlldyhzaG9wcyk7XG4gICAgICAgICAgICB3aGVlbC5tYXNrID0gbWFzaztcbiAgICAgICAgICAgIHdoZWVsLnNldElkcyh0aGlzLnRlbXBJZHMpO1xuICAgICAgICAgICAgdGhpcy53aGVlbCA9IHdoZWVsO1xuXG5cbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQod2hlZWwsIG1hc2ssIHRoaXMuZnJhbWUpO1xuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNob3AodGhpcy50ZW1wSWRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZVNob3Aoc2hvcElkOiBudW1iZXJbXSkge1xuICAgICAgICAgICAgdGhpcy53aGVlbC5zZXRJZHMoc2hvcElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9uU3BpbigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwaW5pbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNwaW5pbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICBsZXQgZGFtcGluZ1N0YXJ0U2VjID0gMC41O1xuICAgICAgICAgICAgVHdlZW5NYXgudG8odGhpcy53aGVlbC5wb3NpdGlvbiwgZGFtcGluZ1N0YXJ0U2VjLCB7IHk6IC00MCwgeW95bzogdHJ1ZSwgcmVwZWF0OiAxIH0pO1xuICAgICAgICAgICAgVHdlZW5NYXguZnJvbVRvKHRoaXMud2hlZWwucG9zaXRpb24sIDAuMiwgeyB5OiAwIH0sIHsgZGVsYXk6IGRhbXBpbmdTdGFydFNlYyAqIDIsIHk6IEFwcC5Db25zdGFudHMuU1lNQk9MX0hFSUdIVCwgcmVwZWF0OiAxMCwgZWFzZTogTGluZWFyLmVhc2VOb25lLCBvblJlcGVhdDogdGhpcy5zd2FwSWQsIG9uUmVwZWF0U2NvcGU6IHRoaXMsIG9uQ29tcGxldGU6IHRoaXMub25TcGluQ29tcGxldGUsIG9uQ29tcGxldGVTY29wZTogdGhpcyB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcmFuZG9tSWQoKTogbnVtYmVyIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLnNob3BzLmxlbmd0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBzd2FwSWQoKSB7XG4gICAgICAgICAgICB0aGlzLnRlbXBJZHMudW5zaGlmdCh0aGlzLnJhbmRvbUlkKCkpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTaG9wKHRoaXMudGVtcElkcyk7XG4gICAgICAgIH1cblxuICAgICAgICBvblNwaW5Db21wbGV0ZSgpIHtcblxuICAgICAgICAgICAgdGhpcy5zcGluaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnRlbXBJZHMudW5zaGlmdCh0aGlzLnJhbmRvbUlkKCkpO1xuICAgICAgICAgICAgdGhpcy50ZW1wSWRzLnVuc2hpZnQodGhpcy5yYW5kb21JZCgpKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2hvcCh0aGlzLnRlbXBJZHMpO1xuXG4gICAgICAgICAgICBUd2VlbkxpdGUuZnJvbVRvKHRoaXMud2hlZWwucG9zaXRpb24sIDEsIHsgeTogLUFwcC5Db25zdGFudHMuU1lNQk9MX0hFSUdIVCB9LCB7IHk6IDAsIGVhc2U6IEJhY2suZWFzZU91dCB9KTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJtb2R1bGUgdmlldyB7XG4gICAgZXhwb3J0IGNsYXNzIFdoZWVsVmlldyBleHRlbmRzIFBJWEkuU3ByaXRlIHtcblxuICAgICAgICBwcml2YXRlIHNob3BzOiBzdHJpbmdbXTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihzaG9wczogc3RyaW5nW10pIHtcbiAgICAgICAgICAgIHN1cGVyKFBJWEkuVGV4dHVyZS5FTVBUWSk7XG4gICAgICAgICAgICB0aGlzLnNob3BzID0gc2hvcHM7XG5cblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgc3ltYm9sVGV4dCA9IG5ldyBQSVhJLlRleHQoXCJcIiwgeyBmaWxsOiBcIjB4MDAwMDAwXCIgfSk7XG4gICAgICAgICAgICAgICAgc3ltYm9sVGV4dC5hbmNob3Iuc2V0KDAuNSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgYmcgPSBuZXcgUElYSS5TcHJpdGUoUElYSS5UZXh0dXJlLldISVRFKTtcbiAgICAgICAgICAgICAgICBiZy53aWR0aCA9IEFwcC5Db25zdGFudHMuU1lNQk9MX1dJRFRIO1xuICAgICAgICAgICAgICAgIGJnLmhlaWdodCA9IEFwcC5Db25zdGFudHMuU1lNQk9MX0hFSUdIVDtcbiAgICAgICAgICAgICAgICBiZy5hbmNob3Iuc2V0KDAuNSk7XG5cbiAgICAgICAgICAgICAgICBsZXQgY29udGFpbmVyID0gbmV3IFBJWEkuQ29udGFpbmVyKCk7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmFkZENoaWxkKGJnLCBzeW1ib2xUZXh0KTtcbiAgICAgICAgICAgICAgICBjb250YWluZXIueSA9IChpIC0gMSkgKiBBcHAuQ29uc3RhbnRzLlNZTUJPTF9IRUlHSFQ7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFkZENoaWxkKGNvbnRhaW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzZXRJZHMoaWRzOiBudW1iZXJbXSkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogUElYSS5Db250YWluZXIsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgdGV4dFZpZXcgPSBjaGlsZC5nZXRDaGlsZEF0KDEpIGFzIFBJWEkuVGV4dDtcbiAgICAgICAgICAgICAgICB0ZXh0Vmlldy50ZXh0ID0gdGhpcy5zaG9wc1tpZHNbaV1dO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgfVxufSIsIm1vZHVsZSB2b3tcbiAgICBleHBvcnQgY2xhc3MgU2hvcHNWT3tcbiAgICAgICAgcHVibGljIG5vcm1hbDpzdHJpbmdbXTtcbiAgICAgICAgcHVibGljIGdvb2Q6c3RyaW5nW107XG4gICAgfVxufSJdfQ==
