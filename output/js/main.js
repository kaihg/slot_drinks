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
            // this.app = new PIXI.Application(window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio, { backgroundColor: 0x1099bb });
            this.app = new PIXI.Application(window.innerWidth, window.innerHeight, { backgroundColor: 0x1099bb, autoResize: true });
            this.app.view.style.width = "100%";
            this.app.view.style.height = "100%";
            document.body.appendChild(this.app.view);
            if (window.addEventListener) {
                window.addEventListener("resize", this.onResize.bind(this), true);
            }
        };
        Main.prototype.onResize = function () {
            // this.app.renderer.resize(window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio);
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
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
            this.initKeyboardEvent();
            this.onResize();
        };
        Main.prototype.initReelView = function (shops) {
            console.log(shops);
            var reel = new view.ReelView(shops.normal);
            var text1 = new PIXI.Text("普通");
            // text1.resolution = devicePixelRatio;
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
        Main.prototype.initKeyboardEvent = function () {
            var space = this.keyboard(32);
            space.press = this.spin.bind(this);
            var enter = this.keyboard(13);
            enter.press = this.spin.bind(this);
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
        Main.prototype.keyboard = function (keyCode) {
            var key = {};
            key.code = keyCode;
            key.isDown = false;
            key.isUp = true;
            key.press = undefined;
            key.release = undefined;
            //The `downHandler`
            key.downHandler = function (event) {
                if (event.keyCode === key.code) {
                    if (key.isUp && key.press)
                        key.press();
                    key.isDown = true;
                    key.isUp = false;
                }
                event.preventDefault();
            };
            //The `upHandler`
            key.upHandler = function (event) {
                if (event.keyCode === key.code) {
                    if (key.isDown && key.release)
                        key.release();
                    key.isDown = false;
                    key.isUp = true;
                }
                event.preventDefault();
            };
            //Attach event listeners
            window.addEventListener("keydown", key.downHandler.bind(key), false);
            window.addEventListener("keyup", key.upHandler.bind(key), false);
            return key;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Db25zdGFudHMudHMiLCJzcmMvTWFpbi50cyIsInNyYy9lZmZlY3QvQnV0dG9uSG92ZXJFZmZlY3QudHMiLCJzcmMvdmlldy9CdXR0b24udHMiLCJzcmMvdmlldy9Mb2FkaW5nVmlldy50cyIsInNyYy92aWV3L1JlZWxWaWV3LnRzIiwic3JjL3ZpZXcvV2hlZWxWaWV3LnRzIiwic3JjL3ZvL1Nob3BzVk8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQU8sR0FBRyxDQUtUO0FBTEQsV0FBTyxHQUFHO0lBQ047UUFBQTtRQUdBLENBQUM7UUFGaUIsc0JBQVksR0FBRyxHQUFHLENBQUM7UUFDbkIsdUJBQWEsR0FBRyxHQUFHLENBQUM7UUFDdEMsZ0JBQUM7S0FIRCxBQUdDLElBQUE7SUFIWSxhQUFTLFlBR3JCLENBQUE7QUFDTCxDQUFDLEVBTE0sR0FBRyxLQUFILEdBQUcsUUFLVDtBQ0xELElBQU8sR0FBRyxDQTRNVDtBQTVNRCxXQUFPLEdBQUc7SUFDTjtRQVNJO1lBRUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUV4QixDQUFDO1FBRU8sdUJBQVEsR0FBaEI7WUFDSSwrSUFBK0k7WUFDL0ksSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRyxNQUFNLENBQUMsV0FBVyxFQUFHLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUN6SCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztZQUNuQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUVwQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENB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QU8sQ0FBQyxVQUFDLEtBQXFCLEVBQUUsQ0FBQztnQkFDM0MsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQWMsQ0FBQztnQkFDaEQsUUFBUSxDQUFDLElBQUksR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQyxDQUFBO1FBQ04sQ0FBQztRQUVMLGdCQUFDO0lBQUQsQ0FqQ0EsQUFpQ0MsQ0FqQzhCLElBQUksQ0FBQyxNQUFNLEdBaUN6QztJQWpDWSxjQUFTLFlBaUNyQixDQUFBO0FBQ0wsQ0FBQyxFQW5DTSxJQUFJLEtBQUosSUFBSSxRQW1DVjtBQ25DRCxJQUFPLEVBQUUsQ0FLUjtBQUxELFdBQU8sRUFBRTtJQUNMO1FBQUE7UUFHQSxDQUFDO1FBQUQsY0FBQztJQUFELENBSEEsQUFHQyxJQUFBO0lBSFksVUFBTyxVQUduQixDQUFBO0FBQ0wsQ0FBQyxFQUxNLEVBQUUsS0FBRixFQUFFLFFBS1IiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSBBcHAge1xuICAgIGV4cG9ydCBjbGFzcyBDb25zdGFudHMge1xuICAgICAgICBwdWJsaWMgc3RhdGljIFNZTUJPTF9XSURUSCA9IDIwMDtcbiAgICAgICAgcHVibGljIHN0YXRpYyBTWU1CT0xfSEVJR0hUID0gMTAwO1xuICAgIH1cbn0iLCJtb2R1bGUgQXBwIHtcbiAgICBleHBvcnQgY2xhc3MgTWFpbiB7XG5cbiAgICAgICAgcHJpdmF0ZSBhcHA6IFBJWEkuQXBwbGljYXRpb247XG5cbiAgICAgICAgcHJpdmF0ZSByZWVsVmlldzogdmlldy5SZWVsVmlldztcbiAgICAgICAgcHJpdmF0ZSBnb29kUmVlbFZpZXc6IHZpZXcuUmVlbFZpZXc7XG4gICAgICAgIHByaXZhdGUgc3BpbkJ0bjogUElYSS5EaXNwbGF5T2JqZWN0O1xuICAgICAgICBmaWx0ZXI6IFBJWEkuRmlsdGVyW107XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuaW5pdFBJWEkoKTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRMb2FkaW5nKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgaW5pdFBJWEkoKSB7XG4gICAgICAgICAgICAvLyB0aGlzLmFwcCA9IG5ldyBQSVhJLkFwcGxpY2F0aW9uKHdpbmRvdy5pbm5lcldpZHRoICogZGV2aWNlUGl4ZWxSYXRpbywgd2luZG93LmlubmVySGVpZ2h0ICogZGV2aWNlUGl4ZWxSYXRpbywgeyBiYWNrZ3JvdW5kQ29sb3I6IDB4MTA5OWJiIH0pO1xuICAgICAgICAgICAgdGhpcy5hcHAgPSBuZXcgUElYSS5BcHBsaWNhdGlvbih3aW5kb3cuaW5uZXJXaWR0aCAsIHdpbmRvdy5pbm5lckhlaWdodCAsIHsgYmFja2dyb3VuZENvbG9yOiAweDEwOTliYiwgYXV0b1Jlc2l6ZTp0cnVlIH0pO1xuICAgICAgICAgICAgdGhpcy5hcHAudmlldy5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgICAgICAgdGhpcy5hcHAudmlldy5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmFwcC52aWV3KTtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMub25SZXNpemUuYmluZCh0aGlzKSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBvblJlc2l6ZSgpIHtcbiAgICAgICAgICAgIC8vIHRoaXMuYXBwLnJlbmRlcmVyLnJlc2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCAqIGRldmljZVBpeGVsUmF0aW8sIHdpbmRvdy5pbm5lckhlaWdodCAqIGRldmljZVBpeGVsUmF0aW8pO1xuICAgICAgICAgICAgdGhpcy5hcHAucmVuZGVyZXIucmVzaXplKHdpbmRvdy5pbm5lcldpZHRoICwgd2luZG93LmlubmVySGVpZ2h0ICk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmFwcC5zY3JlZW4ud2lkdGggPCAyLjUgKiBBcHAuQ29uc3RhbnRzLlNZTUJPTF9XSURUSCkge1xuICAgICAgICAgICAgICAgIC8vIOWIh+ebtFxuICAgICAgICAgICAgICAgIHRoaXMucmVlbFZpZXcueCA9IHRoaXMuYXBwLnNjcmVlbi53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWVsVmlldy55ID0gdGhpcy5hcHAuc2NyZWVuLmhlaWdodCAvIDIgLSAyMDA7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmdvb2RSZWVsVmlldy54ID0gdGhpcy5hcHAuc2NyZWVuLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICB0aGlzLmdvb2RSZWVsVmlldy55ID0gdGhpcy5hcHAuc2NyZWVuLmhlaWdodCAvIDI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIOWIh+apq1xuICAgICAgICAgICAgICAgIHRoaXMucmVlbFZpZXcueCA9IHRoaXMuYXBwLnNjcmVlbi53aWR0aCAvIDIgLSAxMjU7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWVsVmlldy55ID0gdGhpcy5hcHAuc2NyZWVuLmhlaWdodCAvIDI7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmdvb2RSZWVsVmlldy54ID0gdGhpcy5hcHAuc2NyZWVuLndpZHRoIC8gMiArIDEyNTtcbiAgICAgICAgICAgICAgICB0aGlzLmdvb2RSZWVsVmlldy55ID0gdGhpcy5hcHAuc2NyZWVuLmhlaWdodCAvIDI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc3BpbkJ0bi54ID0gdGhpcy5hcHAuc2NyZWVuLndpZHRoIC8gMjtcbiAgICAgICAgICAgIHRoaXMuc3BpbkJ0bi55ID0gdGhpcy5nb29kUmVlbFZpZXcueSArIEFwcC5Db25zdGFudHMuU1lNQk9MX0hFSUdIVDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0TG9hZGluZygpOiBhbnkge1xuICAgICAgICAgICAgbGV0IGxvYWRpbmdWaWV3ID0gbmV3IHZpZXcuTG9hZGluZ1ZpZXcoKTtcbiAgICAgICAgICAgIGxvYWRpbmdWaWV3LnggPSB0aGlzLmFwcC5zY3JlZW4ud2lkdGggLyAyO1xuICAgICAgICAgICAgbG9hZGluZ1ZpZXcueSA9IHRoaXMuYXBwLnNjcmVlbi5oZWlnaHQgLyAyO1xuXG4gICAgICAgICAgICB0aGlzLmFwcC5zdGFnZS5hZGRDaGlsZChsb2FkaW5nVmlldyk7XG5cbiAgICAgICAgICAgIFBJWEkubG9hZGVyXG4gICAgICAgICAgICAgICAgLm9uKFwicHJvZ3Jlc3NcIiwgKGxvYWRlcjogUElYSS5sb2FkZXJzLkxvYWRlciwgcmVzb3VyY2U6IFBJWEkubG9hZGVycy5SZXNvdXJjZSkgPT4geyBsb2FkaW5nVmlldy51cGRhdGVQcm9ncmVzcyhsb2FkZXIucHJvZ3Jlc3MpIH0pXG4gICAgICAgICAgICAgICAgLmFkZChcInNob3BzXCIsIFwicmVzb3VyY2Uvc2hvcHMuanNvblwiKVxuICAgICAgICAgICAgICAgIC5sb2FkKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZ1ZpZXcucGFyZW50LnJlbW92ZUNoaWxkKGxvYWRpbmdWaWV3KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvYWRlZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICBvbkxvYWRlZCgpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdFJlZWxWaWV3KFBJWEkubG9hZGVyLnJlc291cmNlcy5zaG9wcy5kYXRhKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFNwaW5CdXR0b24oKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdEtleWJvYXJkRXZlbnQoKTtcblxuICAgICAgICAgICAgdGhpcy5vblJlc2l6ZSgpO1xuXG4gICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXRSZWVsVmlldyhzaG9wczogdm8uU2hvcHNWTykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coc2hvcHMpO1xuICAgICAgICAgICAgbGV0IHJlZWwgPSBuZXcgdmlldy5SZWVsVmlldyhzaG9wcy5ub3JtYWwpO1xuXG4gICAgICAgICAgICBsZXQgdGV4dDEgPSBuZXcgUElYSS5UZXh0KFwi5pmu6YCaXCIpXG4gICAgICAgICAgICAvLyB0ZXh0MS5yZXNvbHV0aW9uID0gZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgIHRleHQxLmFuY2hvci5zZXQoMC41KTtcbiAgICAgICAgICAgIHRleHQxLnkgPSAtNzU7XG4gICAgICAgICAgICByZWVsLmFkZENoaWxkKHRleHQxKTtcblxuICAgICAgICAgICAgdGhpcy5hcHAuc3RhZ2UuYWRkQ2hpbGQocmVlbCk7XG4gICAgICAgICAgICB0aGlzLnJlZWxWaWV3ID0gcmVlbDtcblxuICAgICAgICAgICAgLy8g6ICB6ZeG55qEXG4gICAgICAgICAgICBsZXQgcmVlbDIgPSBuZXcgdmlldy5SZWVsVmlldyhzaG9wcy5nb29kKTtcbiAgICAgICAgICAgIGxldCB0ZXh0MiA9IG5ldyBQSVhJLlRleHQoXCLniL1cIilcbiAgICAgICAgICAgIHRleHQyLmFuY2hvci5zZXQoMC41KTtcbiAgICAgICAgICAgIHRleHQyLnkgPSAtNzU7XG4gICAgICAgICAgICByZWVsMi5hZGRDaGlsZCh0ZXh0Mik7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwLnN0YWdlLmFkZENoaWxkKHJlZWwyKTtcbiAgICAgICAgICAgIHRoaXMuZ29vZFJlZWxWaWV3ID0gcmVlbDI7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0U3BpbkJ1dHRvbigpIHtcbiAgICAgICAgICAgIGxldCBidG4gPSBuZXcgdmlldy5CdXR0b24oXCLplovlp4tcIik7XG4gICAgICAgICAgICBidG4uYW5jaG9yLnNldCgwLjUpO1xuICAgICAgICAgICAgYnRuLnggPSB0aGlzLnJlZWxWaWV3Lng7XG4gICAgICAgICAgICBidG4ueSA9IHRoaXMucmVlbFZpZXcueSArIEFwcC5Db25zdGFudHMuU1lNQk9MX0hFSUdIVDtcbiAgICAgICAgICAgIGJ0bi5idXR0b25XaWR0aCA9IEFwcC5Db25zdGFudHMuU1lNQk9MX1dJRFRIO1xuICAgICAgICAgICAgYnRuLmJ1dHRvbkhlaWdodCA9IDU1O1xuICAgICAgICAgICAgLy8gYnRuLnggPSB0aGlzLmFwcC5zY3JlZW4ud2lkdGggLSA2NDtcbiAgICAgICAgICAgIC8vIGJ0bi55ID0gdGhpcy5hcHAuc2NyZWVuLmhlaWdodCAtIDQ4O1xuICAgICAgICAgICAgYnRuLmludGVyYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIGJ0bi5vbigncG9pbnRlcnVwJywgdGhpcy5zcGluLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICB0aGlzLnNwaW5CdG4gPSBidG47XG5cbiAgICAgICAgICAgIHRoaXMuYXBwLnN0YWdlLmFkZENoaWxkKGJ0bik7XG5cblxuICAgICAgICAgICAgLy8gbGV0IHRlc3RCdG4gPSBuZXcgdmlldy5CdXR0b24oKTtcbiAgICAgICAgICAgIC8vIHRlc3RCdG4uYnV0dG9uV2lkdGggPSBBcHAuQ29uc3RhbnRzLlNZTUJPTF9XSURUSDtcbiAgICAgICAgICAgIC8vIHRlc3RCdG4uYnV0dG9uSGVpZ2h0ID0gNzU7XG4gICAgICAgICAgICAvLyAvLyB0ZXN0QnRuLnJlZHJhdygpO1xuXG4gICAgICAgICAgICAvLyB0ZXN0QnRuLnggPSB0aGlzLnJlZWxWaWV3Lng7XG4gICAgICAgICAgICAvLyB0ZXN0QnRuLnkgPSB0aGlzLnJlZWxWaWV3LnkgKyBBcHAuQ29uc3RhbnRzLlNZTUJPTF9IRUlHSFQgKjI7XG4gICAgICAgICAgICAvLyB0aGlzLmFwcC5zdGFnZS5hZGRDaGlsZCh0ZXN0QnRuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNwaW4oKSB7XG4gICAgICAgICAgICB0aGlzLnJlZWxWaWV3Lm9uU3BpbigpO1xuICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcub25TcGluKCk7XG5cbiAgICAgICAgICAgIHRoaXMucmVlbFZpZXcuZmlsdGVycyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmdvb2RSZWVsVmlldy5maWx0ZXJzID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gbGV0IG91dGxpbmVGaWx0ZXIgPSBbdGhpcy5maWx0ZXIgfHwgbmV3IFBJWEkuZmlsdGVycy5PdXRsaW5lRmlsdGVyKDUsIDB4ZmYwMDAwKV07XG4gICAgICAgICAgICBsZXQgb3V0bGluZUZpbHRlciA9IHRoaXMuZmlsdGVyIHx8IFtuZXcgUElYSS5maWx0ZXJzLkdsb3dGaWx0ZXIoMTUpXTtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyID0gb3V0bGluZUZpbHRlcjtcblxuICAgICAgICAgICAgbGV0IG9iaiA9IHsgdmFyOiAwIH07XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8ob2JqLCA1LCB7IHZhcjogTWF0aC5yYW5kb20oKSAqIDIgKyAxNSwgb25VcGRhdGU6IHRoaXMuY2hhbmdlT3V0bGluZUZpbHRlciwgb25VcGRhdGVQYXJhbXM6IFtvYmosIG91dGxpbmVGaWx0ZXJdLCBvblVwZGF0ZVNjb3BlOiB0aGlzLCBlYXNlOiBRdWFkLmVhc2VJbk91dCB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgaW5pdEtleWJvYXJkRXZlbnQoKXtcbiAgICAgICAgICAgIGxldCBzcGFjZSA9IHRoaXMua2V5Ym9hcmQoMzIpO1xuICAgICAgICAgICAgc3BhY2UucHJlc3MgPSB0aGlzLnNwaW4uYmluZCh0aGlzKTtcblxuICAgICAgICAgICAgbGV0IGVudGVyID0gdGhpcy5rZXlib2FyZCgxMyk7XG4gICAgICAgICAgICBlbnRlci5wcmVzcyA9IHRoaXMuc3Bpbi5iaW5kKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hhbmdlT3V0bGluZUZpbHRlcihvYmo6IHsgdmFyOiBudW1iZXIgfSwgZmlsdGVyKSB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSBNYXRoLnJvdW5kKG9iai52YXIpICUgMjtcblxuICAgICAgICAgICAgaWYgKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWVsVmlldy5maWx0ZXJzID0gZmlsdGVyO1xuICAgICAgICAgICAgICAgIHRoaXMuZ29vZFJlZWxWaWV3LmZpbHRlcnMgPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlZWxWaWV3LmZpbHRlcnMgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuZ29vZFJlZWxWaWV3LmZpbHRlcnMgPSBmaWx0ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBrZXlib2FyZChrZXlDb2RlKSB7XG4gICAgICAgICAgICBsZXQga2V5IDphbnkgPSB7fTtcbiAgICAgICAgICAgIGtleS5jb2RlID0ga2V5Q29kZTtcbiAgICAgICAgICAgIGtleS5pc0Rvd24gPSBmYWxzZTtcbiAgICAgICAgICAgIGtleS5pc1VwID0gdHJ1ZTtcbiAgICAgICAgICAgIGtleS5wcmVzcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGtleS5yZWxlYXNlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgLy9UaGUgYGRvd25IYW5kbGVyYFxuICAgICAgICAgICAga2V5LmRvd25IYW5kbGVyID0gZXZlbnQgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0ga2V5LmNvZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5LmlzVXAgJiYga2V5LnByZXNzKSBrZXkucHJlc3MoKTtcbiAgICAgICAgICAgICAgICBrZXkuaXNEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBrZXkuaXNVcCA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIFxuICAgICAgICAgICAgLy9UaGUgYHVwSGFuZGxlcmBcbiAgICAgICAgICAgIGtleS51cEhhbmRsZXIgPSBldmVudCA9PiB7XG4gICAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSBrZXkuY29kZSkge1xuICAgICAgICAgICAgICAgIGlmIChrZXkuaXNEb3duICYmIGtleS5yZWxlYXNlKSBrZXkucmVsZWFzZSgpO1xuICAgICAgICAgICAgICAgIGtleS5pc0Rvd24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBrZXkuaXNVcCA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgXG4gICAgICAgICAgICAvL0F0dGFjaCBldmVudCBsaXN0ZW5lcnNcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICBcImtleWRvd25cIiwga2V5LmRvd25IYW5kbGVyLmJpbmQoa2V5KSwgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgXCJrZXl1cFwiLCBrZXkudXBIYW5kbGVyLmJpbmQoa2V5KSwgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgdmlldyB7XG4gICAgZXhwb3J0IGVudW0gSG92ZXJUeXBlIHtcbiAgICAgICAgdHlwZTFcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQnV0dG9uSG92ZXJFZmZlY3Qge1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgb25Ib3Zlcih0eXBlOiBIb3ZlclR5cGUsIHR3ZWVuT2JqOiBQSVhJLkRpc3BsYXlPYmplY3QsIGlzT3ZlckluOiBib29sZWFuKSB7XG5cbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgSG92ZXJUeXBlLnR5cGUxOlxuICAgICAgICAgICAgICAgICAgICBCdXR0b25Ib3ZlckVmZmVjdC5hbHBoYVZpc2libGUodHdlZW5PYmosIGlzT3ZlckluKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBhbHBoYVZpc2libGUodHdlZW5PYmo6IFBJWEkuRGlzcGxheU9iamVjdCwgaXNPdmVySW46IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIGxldCBzZWMgPSAwLjU7XG4gICAgICAgICAgICBUd2VlbkxpdGUua2lsbFR3ZWVuc09mKHR3ZWVuT2JqKTtcblxuICAgICAgICAgICAgaWYgKGlzT3ZlckluKSB7XG4gICAgICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHR3ZWVuT2JqLCBzZWMsIHsgYWxwaGE6IDEgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0d2Vlbk9iaiwgc2VjLCB7IGFscGhhOiAwLCBvbkNvbXBsZXRlOiAoKSA9PiB7IHR3ZWVuT2JqLnZpc2libGUgPSBmYWxzZSB9IH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH1cbn0iLCJtb2R1bGUgdmlldyB7XG5cbiAgICBleHBvcnQgY2xhc3MgQnV0dG9uIGV4dGVuZHMgUElYSS5TcHJpdGUge1xuXG4gICAgICAgIGhvdmVyVHlwZTogSG92ZXJUeXBlID0gSG92ZXJUeXBlLnR5cGUxO1xuXG5cbiAgICAgICAgZnJhbWVDb2xvciA9IDB4ZmZmZmZmO1xuICAgICAgICBiZ0NvbG9yID0gMHgwMDExZmY7XG4gICAgICAgIGJnQ29sb3JPbkNsaWNrID0gMHgzM2FhYWE7XG5cbiAgICAgICAgbGFiZWw6IFBJWEkuVGV4dDtcbiAgICAgICAgcHJpdmF0ZSBiZ1ZpZXc6IFBJWEkuR3JhcGhpY3M7XG5cbiAgICAgICAgcHJpdmF0ZSBfYnV0dG9uV2lkdGg6IG51bWJlcjtcbiAgICAgICAgcHJpdmF0ZSBfYnV0dG9uSGVpZ2h0OiBudW1iZXI7XG5cbiAgICAgICAgcHJpdmF0ZSBlZmZlY3Q6IFBJWEkuU3ByaXRlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHRleHQgPSBcIkJ1dHRvblwiKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgICAgICB0aGlzLmJnVmlldyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuZWZmZWN0ID0gbmV3IFBJWEkuU3ByaXRlKFBJWEkuVGV4dHVyZS5XSElURSk7XG4gICAgICAgICAgICB0aGlzLmVmZmVjdC5hbmNob3Iuc2V0KDAuNSk7XG4gICAgICAgICAgICB0aGlzLmVmZmVjdC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmVmZmVjdC5hbHBoYSA9IDA7XG5cbiAgICAgICAgICAgIHRoaXMubGFiZWwgPSBuZXcgUElYSS5UZXh0KHRleHQsIHsgZmlsbDogdGhpcy5mcmFtZUNvbG9yIH0pO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5hbmNob3Iuc2V0KDAuNSk7XG5cbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5iZ1ZpZXcsIHRoaXMuZWZmZWN0LCB0aGlzLmxhYmVsKTtcblxuICAgICAgICAgICAgdGhpcy5kcmF3Tm9ybWFsU3l0bGUoKTtcblxuICAgICAgICAgICAgLy8gc2V0IGludGVyYWN0aXZlXG4gICAgICAgICAgICB0aGlzLmludGVyYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uTW9kZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm9uKFwicG9pbnRlcm92ZXJcIiwgdGhpcy5vbkJ1dHRvbk92ZXIpO1xuICAgICAgICAgICAgdGhpcy5vbihcInBvaW50ZXJvdXRcIiwgdGhpcy5vbkJ1dHRvbk91dCk7XG4gICAgICAgICAgICB0aGlzLm9uKFwicG9pbnRlcmRvd25cIiwoKT0+e3RoaXMuZWZmZWN0LnRpbnQgPSB0aGlzLmJnQ29sb3JPbkNsaWNrfSk7XG4gICAgICAgICAgICB0aGlzLm9uKFwicG9pbnRlcnVwXCIsKCk9Pnt0aGlzLmVmZmVjdC50aW50ID0gdGhpcy5mcmFtZUNvbG9yfSk7XG4gICAgICAgIH1cblxuICAgICAgICBkcmF3Tm9ybWFsU3l0bGUoKSB7XG4gICAgICAgICAgICAvLyBsZXQgd2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICAgICAgLy8gbGV0IGhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgbGV0IHBhZGRpbmcgPSAxMDtcbiAgICAgICAgICAgIGxldCB3aWR0aCA9IHRoaXMuX2J1dHRvbldpZHRoIHx8IHRoaXMubGFiZWwud2lkdGggKyBwYWRkaW5nO1xuICAgICAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMuX2J1dHRvbkhlaWdodCB8fCB0aGlzLmxhYmVsLmhlaWdodCArIHBhZGRpbmc7XG5cbiAgICAgICAgICAgIC8vIGxldCBzdGFydFggPSAgLXdpZHRoICogMC41O1xuICAgICAgICAgICAgLy8gbGV0IHN0YXJ0WSA9IC1oZWlnaHQgKiAwLjU7XG4gICAgICAgICAgICBsZXQgc3RhcnRYID0gLXdpZHRoICogMC41O1xuICAgICAgICAgICAgbGV0IHN0YXJ0WSA9IC1oZWlnaHQgKiAwLjU7XG5cbiAgICAgICAgICAgIGxldCBncmFwaCA9IHRoaXMuYmdWaWV3O1xuICAgICAgICAgICAgZ3JhcGguY2xlYXIoKTtcbiAgICAgICAgICAgIGdyYXBoLmJlZ2luRmlsbCh0aGlzLmJnQ29sb3IpO1xuICAgICAgICAgICAgLy8gZ3JhcGguZHJhd1JlY3Qoc3RhcnRYLHN0YXJ0WSx3aWR0aCxoZWlnaHQpO1xuICAgICAgICAgICAgLy8gZ3JhcGguZW5kRmlsbCgpO1xuXG4gICAgICAgICAgICBncmFwaC5saW5lU3R5bGUoNSwgdGhpcy5mcmFtZUNvbG9yKTtcblxuICAgICAgICAgICAgZ3JhcGgubW92ZVRvKHN0YXJ0WCwgc3RhcnRZKTtcbiAgICAgICAgICAgIGdyYXBoLmxpbmVUbyhzdGFydFggKyB3aWR0aCwgc3RhcnRZKTtcbiAgICAgICAgICAgIGdyYXBoLmxpbmVUbyhzdGFydFggKyB3aWR0aCwgc3RhcnRZICsgaGVpZ2h0KTtcbiAgICAgICAgICAgIGdyYXBoLmxpbmVUbyhzdGFydFgsIHN0YXJ0WSArIGhlaWdodCk7XG4gICAgICAgICAgICBncmFwaC5saW5lVG8oc3RhcnRYLCBzdGFydFkpO1xuXG4gICAgICAgICAgICBncmFwaC5lbmRGaWxsKCk7XG5cblxuICAgICAgICB9XG5cbiAgICAgICAgc2V0IGJ1dHRvbldpZHRoKHdpZHRoOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2J1dHRvbldpZHRoID0gTWF0aC5tYXgod2lkdGgsIHRoaXMubGFiZWwud2lkdGgpO1xuICAgICAgICAgICAgdGhpcy5yZWRyYXcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCBidXR0b25IZWlnaHQoaGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2J1dHRvbkhlaWdodCA9IE1hdGgubWF4KGhlaWdodCwgdGhpcy5sYWJlbC5oZWlnaHQpO1xuICAgICAgICAgICAgdGhpcy5yZWRyYXcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlZHJhdygpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd05vcm1hbFN5dGxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBvbkJ1dHRvbk92ZXIoKSB7XG4gICAgICAgICAgICB0aGlzLmVmZmVjdC53aWR0aCA9IHRoaXMuX2J1dHRvbldpZHRoO1xuICAgICAgICAgICAgdGhpcy5lZmZlY3QuaGVpZ2h0ID0gdGhpcy5fYnV0dG9uSGVpZ2h0O1xuXG4gICAgICAgICAgICB0aGlzLmVmZmVjdC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZWZmZWN0LnRpbnQgPSB0aGlzLmZyYW1lQ29sb3I7XG5cblxuICAgICAgICAgICAgQnV0dG9uSG92ZXJFZmZlY3Qub25Ib3Zlcih0aGlzLmhvdmVyVHlwZSx0aGlzLmVmZmVjdCx0cnVlKTtcblxuICAgICAgICAgICAgdGhpcy5sYWJlbC5zdHlsZS5maWxsID0gdGhpcy5iZ0NvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgb25CdXR0b25PdXQoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEJ1dHRvbkhvdmVyRWZmZWN0Lm9uSG92ZXIodGhpcy5ob3ZlclR5cGUsdGhpcy5lZmZlY3QsZmFsc2UpO1xuXG4gICAgICAgICAgICB0aGlzLmxhYmVsLnN0eWxlLmZpbGwgPSB0aGlzLmZyYW1lQ29sb3I7XG4gICAgICAgIH1cbiAgICB9XG59IiwibW9kdWxlIHZpZXcge1xuICAgIGV4cG9ydCBjbGFzcyBMb2FkaW5nVmlldyBleHRlbmRzIFBJWEkuR3JhcGhpY3Mge1xuXG4gICAgICAgIHByaXZhdGUgcHJvZ3Jlc3M6IG51bWJlciA9IDA7XG4gICAgICAgIGNvbG9yOiBudW1iZXIgPSAweGFhYmMxM1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB1cGRhdGVQcm9ncmVzcyhwOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGxldCBwZXJjZW50ID0gcDtcbiAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSBwZXJjZW50O1xuXG4gICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgICAgICB0aGlzLmxpbmVTdHlsZSgxMCwgdGhpcy5jb2xvcik7XG4gICAgICAgICAgICAvLyB0aGlzLmRyYXdDaXJjbGUoMCwgMCwgMiAqIE1hdGguUEkgKiBwZXJjZW50KTtcbiAgICAgICAgICAgIHRoaXMuYXJjKDAsIDAsIDUwLCAwLCAyICogTWF0aC5QSSAqIHBlcmNlbnQpO1xuICAgICAgICAgICAgdGhpcy5lbmRGaWxsKCk7XG4gICAgICAgIH1cblxuICAgIH1cbn1cbiIsIm1vZHVsZSB2aWV3IHtcbiAgICBleHBvcnQgY2xhc3MgUmVlbFZpZXcgZXh0ZW5kcyBQSVhJLlNwcml0ZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBmcmFtZTogUElYSS5HcmFwaGljcztcbiAgICAgICAgcHJpdmF0ZSB3aGVlbDogdmlldy5XaGVlbFZpZXc7XG4gICAgICAgIHByaXZhdGUgc2hvcHM6IHN0cmluZ1tdO1xuXG4gICAgICAgIHByaXZhdGUgdGVtcElkczogbnVtYmVyW10gPSBbMCwgMSwgMl07XG4gICAgICAgIHNwaW5pbmc6IGJvb2xlYW47XG4gICAgICAgIC8vIHByaXZhdGUgX21hc2s6IFBJWEkuRGlzcGxheU9iamVjdDtcblxuICAgICAgICBjb25zdHJ1Y3RvcihzaG9wczogc3RyaW5nW10pIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICB0aGlzLnNob3BzID0gc2hvcHM7XG5cbiAgICAgICAgICAgIGxldCB3aWR0aCA9IEFwcC5Db25zdGFudHMuU1lNQk9MX1dJRFRIO1xuICAgICAgICAgICAgbGV0IGhlaWdodCA9IEFwcC5Db25zdGFudHMuU1lNQk9MX0hFSUdIVDtcblxuICAgICAgICAgICAgdGhpcy5mcmFtZSA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gICAgICAgICAgICB0aGlzLmZyYW1lLmxpbmVTdHlsZSgxMCwgMHgwMDAwMDApO1xuICAgICAgICAgICAgdGhpcy5mcmFtZS5kcmF3UmVjdCgtd2lkdGggKiAwLjUsIC1oZWlnaHQgKiAwLjUsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgICAgdGhpcy5mcmFtZS5lbmRGaWxsKCk7XG5cbiAgICAgICAgICAgIC8vIG1hc2tcbiAgICAgICAgICAgIGxldCBtYXNrID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbiAgICAgICAgICAgIG1hc2suYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICAgICAgICAgIG1hc2suZHJhd1JlY3QoLXdpZHRoICogMC41LCAtaGVpZ2h0ICogMC41LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICAgIG1hc2suZW5kRmlsbCgpO1xuXG5cbiAgICAgICAgICAgIC8vIHdoZWVsXG4gICAgICAgICAgICBsZXQgd2hlZWwgPSBuZXcgdmlldy5XaGVlbFZpZXcoc2hvcHMpO1xuICAgICAgICAgICAgd2hlZWwubWFzayA9IG1hc2s7XG4gICAgICAgICAgICB3aGVlbC5zZXRJZHModGhpcy50ZW1wSWRzKTtcbiAgICAgICAgICAgIHRoaXMud2hlZWwgPSB3aGVlbDtcblxuXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHdoZWVsLCBtYXNrLCB0aGlzLmZyYW1lKTtcblxuICAgICAgICAgICAgdGhpcy51cGRhdGVTaG9wKHRoaXMudGVtcElkcyk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGVTaG9wKHNob3BJZDogbnVtYmVyW10pIHtcbiAgICAgICAgICAgIHRoaXMud2hlZWwuc2V0SWRzKHNob3BJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBvblNwaW4oKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zcGluaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zcGluaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgbGV0IGRhbXBpbmdTdGFydFNlYyA9IDAuNTtcbiAgICAgICAgICAgIFR3ZWVuTWF4LnRvKHRoaXMud2hlZWwucG9zaXRpb24sIGRhbXBpbmdTdGFydFNlYywgeyB5OiAtNDAsIHlveW86IHRydWUsIHJlcGVhdDogMSB9KTtcbiAgICAgICAgICAgIFR3ZWVuTWF4LmZyb21Ubyh0aGlzLndoZWVsLnBvc2l0aW9uLCAwLjIsIHsgeTogMCB9LCB7IGRlbGF5OiBkYW1waW5nU3RhcnRTZWMgKiAyLCB5OiBBcHAuQ29uc3RhbnRzLlNZTUJPTF9IRUlHSFQsIHJlcGVhdDogMTAsIGVhc2U6IExpbmVhci5lYXNlTm9uZSwgb25SZXBlYXQ6IHRoaXMuc3dhcElkLCBvblJlcGVhdFNjb3BlOiB0aGlzLCBvbkNvbXBsZXRlOiB0aGlzLm9uU3BpbkNvbXBsZXRlLCBvbkNvbXBsZXRlU2NvcGU6IHRoaXMgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJhbmRvbUlkKCk6IG51bWJlciB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5zaG9wcy5sZW5ndGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dhcElkKCkge1xuICAgICAgICAgICAgdGhpcy50ZW1wSWRzLnVuc2hpZnQodGhpcy5yYW5kb21JZCgpKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2hvcCh0aGlzLnRlbXBJZHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgb25TcGluQ29tcGxldGUoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuc3BpbmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy50ZW1wSWRzLnVuc2hpZnQodGhpcy5yYW5kb21JZCgpKTtcbiAgICAgICAgICAgIHRoaXMudGVtcElkcy51bnNoaWZ0KHRoaXMucmFuZG9tSWQoKSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNob3AodGhpcy50ZW1wSWRzKTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLmZyb21Ubyh0aGlzLndoZWVsLnBvc2l0aW9uLCAxLCB7IHk6IC1BcHAuQ29uc3RhbnRzLlNZTUJPTF9IRUlHSFQgfSwgeyB5OiAwLCBlYXNlOiBCYWNrLmVhc2VPdXQgfSk7XG4gICAgICAgIH1cbiAgICB9XG59IiwibW9kdWxlIHZpZXcge1xuICAgIGV4cG9ydCBjbGFzcyBXaGVlbFZpZXcgZXh0ZW5kcyBQSVhJLlNwcml0ZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBzaG9wczogc3RyaW5nW107XG5cbiAgICAgICAgY29uc3RydWN0b3Ioc2hvcHM6IHN0cmluZ1tdKSB7XG4gICAgICAgICAgICBzdXBlcihQSVhJLlRleHR1cmUuRU1QVFkpO1xuICAgICAgICAgICAgdGhpcy5zaG9wcyA9IHNob3BzO1xuXG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN5bWJvbFRleHQgPSBuZXcgUElYSS5UZXh0KFwiXCIsIHsgZmlsbDogXCIweDAwMDAwMFwiIH0pO1xuICAgICAgICAgICAgICAgIHN5bWJvbFRleHQuYW5jaG9yLnNldCgwLjUpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGJnID0gbmV3IFBJWEkuU3ByaXRlKFBJWEkuVGV4dHVyZS5XSElURSk7XG4gICAgICAgICAgICAgICAgYmcud2lkdGggPSBBcHAuQ29uc3RhbnRzLlNZTUJPTF9XSURUSDtcbiAgICAgICAgICAgICAgICBiZy5oZWlnaHQgPSBBcHAuQ29uc3RhbnRzLlNZTUJPTF9IRUlHSFQ7XG4gICAgICAgICAgICAgICAgYmcuYW5jaG9yLnNldCgwLjUpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRhaW5lciA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hZGRDaGlsZChiZywgc3ltYm9sVGV4dCk7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnkgPSAoaSAtIDEpICogQXBwLkNvbnN0YW50cy5TWU1CT0xfSEVJR0hUO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChjb250YWluZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2V0SWRzKGlkczogbnVtYmVyW10pIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IFBJWEkuQ29udGFpbmVyLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHRleHRWaWV3ID0gY2hpbGQuZ2V0Q2hpbGRBdCgxKSBhcyBQSVhJLlRleHQ7XG4gICAgICAgICAgICAgICAgdGV4dFZpZXcudGV4dCA9IHRoaXMuc2hvcHNbaWRzW2ldXTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgIH1cbn0iLCJtb2R1bGUgdm97XG4gICAgZXhwb3J0IGNsYXNzIFNob3BzVk97XG4gICAgICAgIHB1YmxpYyBub3JtYWw6c3RyaW5nW107XG4gICAgICAgIHB1YmxpYyBnb29kOnN0cmluZ1tdO1xuICAgIH1cbn0iXX0=
