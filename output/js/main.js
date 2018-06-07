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
            this.app = new PIXI.Application(window.innerWidth, window.innerHeight, { backgroundColor: 0x1099bb });
            document.body.appendChild(this.app.view);
            if (window.addEventListener) {
                window.addEventListener("resize", this.onResize.bind(this), true);
            }
        };
        Main.prototype.onResize = function () {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
            if (window.innerWidth < 2.5 * App.Constants.SYMBOL_WIDTH) {
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
            _this.effectSec = 0.5;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Db25zdGFudHMudHMiLCJzcmMvTWFpbi50cyIsInNyYy9lZmZlY3QvQnV0dG9uSG92ZXJFZmZlY3QudHMiLCJzcmMvdmlldy9CdXR0b24udHMiLCJzcmMvdmlldy9Mb2FkaW5nVmlldy50cyIsInNyYy92aWV3L1JlZWxWaWV3LnRzIiwic3JjL3ZpZXcvV2hlZWxWaWV3LnRzIiwic3JjL3ZvL1Nob3BzVk8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQU8sR0FBRyxDQUtUO0FBTEQsV0FBTyxHQUFHO0lBQ047UUFBQTtRQUdBLENBQUM7UUFGaUIsc0JBQVksR0FBRyxHQUFHLENBQUM7UUFDbkIsdUJBQWEsR0FBRyxHQUFHLENBQUM7UUFDdEMsZ0JBQUM7S0FIRCxBQUdDLElBQUE7SUFIWSxhQUFTLFlBR3JCLENBQUE7QUFDTCxDQUFDLEVBTE0sR0FBRyxLQUFILEdBQUcsUUFLVDtBQ0xELElBQU8sR0FBRyxDQWtJVDtBQWxJRCxXQUFPLEdBQUc7SUFDTjtRQVFJO1lBRUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUV4QixDQUFDO1FBRU8sdUJBQVEsR0FBaEI7WUFDSSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUN0RyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pDLElBQUksTUFBTSxDQUFDLGdCQUFnQixFQUFFO2dCQUN6QixNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ3JFO1FBQ0wsQ0FBQztRQUVELHVCQUFRLEdBQVI7WUFDSSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFaEUsSUFBSSxNQUFNLENBQUMsVUFBVSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRTtnQkFDdEQsS0FBSztnQkFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFFbkQsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDaEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzthQUNwRDtpQkFBTTtnQkFDSCxLQUFLO2dCQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUNsRCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUU3QyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFDdEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsSUFB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QztnQkFDM0MsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQWMsQ0FBQztnQkFDaEQsUUFBUSxDQUFDLElBQUksR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQyxDQUFBO1FBQ04sQ0FBQztRQUVMLGdCQUFDO0lBQUQsQ0FqQ0EsQUFpQ0MsQ0FqQzhCLElBQUksQ0FBQyxNQUFNLEdBaUN6QztJQWpDWSxjQUFTLFlBaUNyQixDQUFBO0FBQ0wsQ0FBQyxFQW5DTSxJQUFJLEtBQUosSUFBSSxRQW1DVjtBQ25DRCxJQUFPLEVBQUUsQ0FLUjtBQUxELFdBQU8sRUFBRTtJQUNMO1FBQUE7UUFHQSxDQUFDO1FBQUQsY0FBQztJQUFELENBSEEsQUFHQyxJQUFBO0lBSFksVUFBTyxVQUduQixDQUFBO0FBQ0wsQ0FBQyxFQUxNLEVBQUUsS0FBRixFQUFFLFFBS1IiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSBBcHAge1xuICAgIGV4cG9ydCBjbGFzcyBDb25zdGFudHMge1xuICAgICAgICBwdWJsaWMgc3RhdGljIFNZTUJPTF9XSURUSCA9IDIwMDtcbiAgICAgICAgcHVibGljIHN0YXRpYyBTWU1CT0xfSEVJR0hUID0gMTAwO1xuICAgIH1cbn0iLCJtb2R1bGUgQXBwIHtcbiAgICBleHBvcnQgY2xhc3MgTWFpbiB7XG5cbiAgICAgICAgcHJpdmF0ZSBhcHA6IFBJWEkuQXBwbGljYXRpb247XG5cbiAgICAgICAgcHJpdmF0ZSByZWVsVmlldzogdmlldy5SZWVsVmlldztcbiAgICAgICAgcHJpdmF0ZSBnb29kUmVlbFZpZXc6IHZpZXcuUmVlbFZpZXc7XG4gICAgICAgIHByaXZhdGUgc3BpbkJ0bjogUElYSS5EaXNwbGF5T2JqZWN0O1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgICAgICB0aGlzLmluaXRQSVhJKCk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0TG9hZGluZygpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGluaXRQSVhJKCkge1xuICAgICAgICAgICAgdGhpcy5hcHAgPSBuZXcgUElYSS5BcHBsaWNhdGlvbih3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0LCB7IGJhY2tncm91bmRDb2xvcjogMHgxMDk5YmIgfSk7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuYXBwLnZpZXcpO1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5vblJlc2l6ZS5iaW5kKHRoaXMpLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG9uUmVzaXplKCkge1xuICAgICAgICAgICAgdGhpcy5hcHAucmVuZGVyZXIucmVzaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXG4gICAgICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPCAyLjUgKiBBcHAuQ29uc3RhbnRzLlNZTUJPTF9XSURUSCkge1xuICAgICAgICAgICAgICAgIC8vIOWIh+ebtFxuICAgICAgICAgICAgICAgIHRoaXMucmVlbFZpZXcueCA9IHRoaXMuYXBwLnNjcmVlbi53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWVsVmlldy55ID0gdGhpcy5hcHAuc2NyZWVuLmhlaWdodCAvIDIgLSAyMDA7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmdvb2RSZWVsVmlldy54ID0gdGhpcy5hcHAuc2NyZWVuLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICB0aGlzLmdvb2RSZWVsVmlldy55ID0gdGhpcy5hcHAuc2NyZWVuLmhlaWdodCAvIDI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIOWIh+apq1xuICAgICAgICAgICAgICAgIHRoaXMucmVlbFZpZXcueCA9IHRoaXMuYXBwLnNjcmVlbi53aWR0aCAvIDIgLSAxMjU7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWVsVmlldy55ID0gdGhpcy5hcHAuc2NyZWVuLmhlaWdodCAvIDI7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmdvb2RSZWVsVmlldy54ID0gdGhpcy5hcHAuc2NyZWVuLndpZHRoIC8gMiArIDEyNTtcbiAgICAgICAgICAgICAgICB0aGlzLmdvb2RSZWVsVmlldy55ID0gdGhpcy5hcHAuc2NyZWVuLmhlaWdodCAvIDI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc3BpbkJ0bi54ID0gdGhpcy5hcHAuc2NyZWVuLndpZHRoIC8gMjtcbiAgICAgICAgICAgIHRoaXMuc3BpbkJ0bi55ID0gdGhpcy5nb29kUmVlbFZpZXcueSArIEFwcC5Db25zdGFudHMuU1lNQk9MX0hFSUdIVDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXJ0TG9hZGluZygpOiBhbnkge1xuICAgICAgICAgICAgbGV0IGxvYWRpbmdWaWV3ID0gbmV3IHZpZXcuTG9hZGluZ1ZpZXcoKTtcbiAgICAgICAgICAgIGxvYWRpbmdWaWV3LnggPSB0aGlzLmFwcC5zY3JlZW4ud2lkdGggLyAyO1xuICAgICAgICAgICAgbG9hZGluZ1ZpZXcueSA9IHRoaXMuYXBwLnNjcmVlbi5oZWlnaHQgLyAyO1xuXG4gICAgICAgICAgICB0aGlzLmFwcC5zdGFnZS5hZGRDaGlsZChsb2FkaW5nVmlldyk7XG5cbiAgICAgICAgICAgIFBJWEkubG9hZGVyXG4gICAgICAgICAgICAgICAgLm9uKFwicHJvZ3Jlc3NcIiwgKGxvYWRlcjogUElYSS5sb2FkZXJzLkxvYWRlciwgcmVzb3VyY2U6IFBJWEkubG9hZGVycy5SZXNvdXJjZSkgPT4geyBsb2FkaW5nVmlldy51cGRhdGVQcm9ncmVzcyhsb2FkZXIucHJvZ3Jlc3MpIH0pXG4gICAgICAgICAgICAgICAgLmFkZChcInNob3BzXCIsIFwicmVzb3VyY2Uvc2hvcHMuanNvblwiKVxuICAgICAgICAgICAgICAgIC5sb2FkKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9hZGluZ1ZpZXcucGFyZW50LnJlbW92ZUNoaWxkKGxvYWRpbmdWaWV3KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkxvYWRlZCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICBvbkxvYWRlZCgpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdFJlZWxWaWV3KFBJWEkubG9hZGVyLnJlc291cmNlcy5zaG9wcy5kYXRhKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFNwaW5CdXR0b24oKTtcbiAgICAgICAgICAgIHRoaXMub25SZXNpemUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXRSZWVsVmlldyhzaG9wczogdm8uU2hvcHNWTykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coc2hvcHMpO1xuICAgICAgICAgICAgbGV0IHJlZWwgPSBuZXcgdmlldy5SZWVsVmlldyhzaG9wcy5ub3JtYWwpO1xuXG4gICAgICAgICAgICBsZXQgdGV4dDEgPSBuZXcgUElYSS5UZXh0KFwi5pmu6YCaXCIpXG4gICAgICAgICAgICB0ZXh0MS5hbmNob3Iuc2V0KDAuNSk7XG4gICAgICAgICAgICB0ZXh0MS55ID0gLTc1O1xuICAgICAgICAgICAgcmVlbC5hZGRDaGlsZCh0ZXh0MSk7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwLnN0YWdlLmFkZENoaWxkKHJlZWwpO1xuXG4gICAgICAgICAgICB0aGlzLnJlZWxWaWV3ID0gcmVlbDtcblxuXG4gICAgICAgICAgICAvLyDogIHpl4bnmoRcbiAgICAgICAgICAgIGxldCByZWVsMiA9IG5ldyB2aWV3LlJlZWxWaWV3KHNob3BzLmdvb2QpO1xuICAgICAgICAgICAgbGV0IHRleHQyID0gbmV3IFBJWEkuVGV4dChcIueIvVwiKVxuICAgICAgICAgICAgdGV4dDIuYW5jaG9yLnNldCgwLjUpO1xuICAgICAgICAgICAgdGV4dDIueSA9IC03NTtcbiAgICAgICAgICAgIHJlZWwyLmFkZENoaWxkKHRleHQyKTtcblxuICAgICAgICAgICAgdGhpcy5hcHAuc3RhZ2UuYWRkQ2hpbGQocmVlbDIpO1xuXG4gICAgICAgICAgICB0aGlzLmdvb2RSZWVsVmlldyA9IHJlZWwyO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdFNwaW5CdXR0b24oKSB7XG4gICAgICAgICAgICBsZXQgYnRuID0gbmV3IHZpZXcuQnV0dG9uKFwi6ZaL5aeLXCIpO1xuICAgICAgICAgICAgYnRuLmFuY2hvci5zZXQoMC41KTtcbiAgICAgICAgICAgIGJ0bi54ID0gdGhpcy5yZWVsVmlldy54O1xuICAgICAgICAgICAgYnRuLnkgPSB0aGlzLnJlZWxWaWV3LnkgKyBBcHAuQ29uc3RhbnRzLlNZTUJPTF9IRUlHSFQ7XG4gICAgICAgICAgICBidG4uYnV0dG9uV2lkdGggPSBBcHAuQ29uc3RhbnRzLlNZTUJPTF9XSURUSDtcbiAgICAgICAgICAgIGJ0bi5idXR0b25IZWlnaHQgPSA1NTtcbiAgICAgICAgICAgIC8vIGJ0bi54ID0gdGhpcy5hcHAuc2NyZWVuLndpZHRoIC0gNjQ7XG4gICAgICAgICAgICAvLyBidG4ueSA9IHRoaXMuYXBwLnNjcmVlbi5oZWlnaHQgLSA0ODtcbiAgICAgICAgICAgIGJ0bi5pbnRlcmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICBidG4ub24oJ3BvaW50ZXJ1cCcsIHRoaXMuc3Bpbi5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5zcGluQnRuID0gYnRuO1xuXG4gICAgICAgICAgICB0aGlzLmFwcC5zdGFnZS5hZGRDaGlsZChidG4pO1xuXG5cbiAgICAgICAgICAgIC8vIGxldCB0ZXN0QnRuID0gbmV3IHZpZXcuQnV0dG9uKCk7XG4gICAgICAgICAgICAvLyB0ZXN0QnRuLmJ1dHRvbldpZHRoID0gQXBwLkNvbnN0YW50cy5TWU1CT0xfV0lEVEg7XG4gICAgICAgICAgICAvLyB0ZXN0QnRuLmJ1dHRvbkhlaWdodCA9IDc1O1xuICAgICAgICAgICAgLy8gLy8gdGVzdEJ0bi5yZWRyYXcoKTtcblxuICAgICAgICAgICAgLy8gdGVzdEJ0bi54ID0gdGhpcy5yZWVsVmlldy54O1xuICAgICAgICAgICAgLy8gdGVzdEJ0bi55ID0gdGhpcy5yZWVsVmlldy55ICsgQXBwLkNvbnN0YW50cy5TWU1CT0xfSEVJR0hUICoyO1xuICAgICAgICAgICAgLy8gdGhpcy5hcHAuc3RhZ2UuYWRkQ2hpbGQodGVzdEJ0bik7XG4gICAgICAgIH1cblxuICAgICAgICBzcGluKCkge1xuICAgICAgICAgICAgdGhpcy5yZWVsVmlldy5vblNwaW4oKTtcbiAgICAgICAgICAgIHRoaXMuZ29vZFJlZWxWaWV3Lm9uU3BpbigpO1xuICAgICAgICB9XG5cblxuICAgIH1cbn1cbiIsIm1vZHVsZSB2aWV3IHtcbiAgICBleHBvcnQgZW51bSBIb3ZlclR5cGUge1xuICAgICAgICB0eXBlMVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBCdXR0b25Ib3ZlckVmZmVjdCB7XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBvbkhvdmVyKHR5cGU6IEhvdmVyVHlwZSwgdHdlZW5PYmo6IFBJWEkuRGlzcGxheU9iamVjdCwgaXNPdmVySW46IGJvb2xlYW4pIHtcblxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBIb3ZlclR5cGUudHlwZTE6XG4gICAgICAgICAgICAgICAgICAgIEJ1dHRvbkhvdmVyRWZmZWN0LmFscGhhVmlzaWJsZSh0d2Vlbk9iaiwgaXNPdmVySW4pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGFscGhhVmlzaWJsZSh0d2Vlbk9iajogUElYSS5EaXNwbGF5T2JqZWN0LCBpc092ZXJJbjogYm9vbGVhbikge1xuICAgICAgICAgICAgbGV0IHNlYyA9IDAuNTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS5raWxsVHdlZW5zT2YodHdlZW5PYmopO1xuXG4gICAgICAgICAgICBpZiAoaXNPdmVySW4pIHtcbiAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8odHdlZW5PYmosIHNlYywgeyBhbHBoYTogMSB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHR3ZWVuT2JqLCBzZWMsIHsgYWxwaGE6IDAsIG9uQ29tcGxldGU6ICgpID0+IHsgdHdlZW5PYmoudmlzaWJsZSA9IGZhbHNlIH0gfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfVxufSIsIm1vZHVsZSB2aWV3IHtcblxuICAgIGV4cG9ydCBjbGFzcyBCdXR0b24gZXh0ZW5kcyBQSVhJLlNwcml0ZSB7XG5cbiAgICAgICAgaG92ZXJUeXBlOiBIb3ZlclR5cGUgPSBIb3ZlclR5cGUudHlwZTE7XG5cblxuICAgICAgICBmcmFtZUNvbG9yID0gMHhmZmZmZmY7XG4gICAgICAgIGJnQ29sb3IgPSAweDAwMTFmZjtcblxuICAgICAgICBsYWJlbDogUElYSS5UZXh0O1xuICAgICAgICBwcml2YXRlIGJnVmlldzogUElYSS5HcmFwaGljcztcblxuICAgICAgICBfYnV0dG9uV2lkdGg6IG51bWJlcjtcbiAgICAgICAgX2J1dHRvbkhlaWdodDogbnVtYmVyO1xuXG4gICAgICAgIHByaXZhdGUgZWZmZWN0U2VjID0gMC41O1xuICAgICAgICBwcml2YXRlIGVmZmVjdDogUElYSS5TcHJpdGU7XG5cbiAgICAgICAgcHJpdmF0ZSBjdXJyZW50VHdlZW46IFR3ZWVuTGl0ZTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcih0ZXh0ID0gXCJCdXR0b25cIikge1xuICAgICAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAgICAgdGhpcy5iZ1ZpZXcgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuXG4gICAgICAgICAgICB0aGlzLmVmZmVjdCA9IG5ldyBQSVhJLlNwcml0ZShQSVhJLlRleHR1cmUuV0hJVEUpO1xuICAgICAgICAgICAgdGhpcy5lZmZlY3QuYW5jaG9yLnNldCgwLjUpO1xuICAgICAgICAgICAgdGhpcy5lZmZlY3QudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5lZmZlY3QuYWxwaGEgPSAwO1xuXG4gICAgICAgICAgICB0aGlzLmxhYmVsID0gbmV3IFBJWEkuVGV4dCh0ZXh0LCB7IGZpbGw6IHRoaXMuZnJhbWVDb2xvciB9KTtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuYW5jaG9yLnNldCgwLjUpO1xuXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuYmdWaWV3LCB0aGlzLmVmZmVjdCwgdGhpcy5sYWJlbCk7XG5cbiAgICAgICAgICAgIHRoaXMuZHJhd05vcm1hbFN5dGxlKCk7XG5cbiAgICAgICAgICAgIC8vIHNldCBpbnRlcmFjdGl2ZVxuICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbk1vZGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5vbihcInBvaW50ZXJvdmVyXCIsIHRoaXMub25CdXR0b25PdmVyKTtcbiAgICAgICAgICAgIHRoaXMub24oXCJwb2ludGVyb3V0XCIsIHRoaXMub25CdXR0b25PdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZHJhd05vcm1hbFN5dGxlKCkge1xuICAgICAgICAgICAgLy8gbGV0IHdpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgICAgIC8vIGxldCBoZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgICAgIGxldCBwYWRkaW5nID0gMTA7XG4gICAgICAgICAgICBsZXQgd2lkdGggPSB0aGlzLl9idXR0b25XaWR0aCB8fCB0aGlzLmxhYmVsLndpZHRoICsgcGFkZGluZztcbiAgICAgICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLl9idXR0b25IZWlnaHQgfHwgdGhpcy5sYWJlbC5oZWlnaHQgKyBwYWRkaW5nO1xuXG4gICAgICAgICAgICAvLyBsZXQgc3RhcnRYID0gIC13aWR0aCAqIDAuNTtcbiAgICAgICAgICAgIC8vIGxldCBzdGFydFkgPSAtaGVpZ2h0ICogMC41O1xuICAgICAgICAgICAgbGV0IHN0YXJ0WCA9IC13aWR0aCAqIDAuNTtcbiAgICAgICAgICAgIGxldCBzdGFydFkgPSAtaGVpZ2h0ICogMC41O1xuXG4gICAgICAgICAgICBsZXQgZ3JhcGggPSB0aGlzLmJnVmlldztcbiAgICAgICAgICAgIGdyYXBoLmNsZWFyKCk7XG4gICAgICAgICAgICBncmFwaC5iZWdpbkZpbGwodGhpcy5iZ0NvbG9yKTtcbiAgICAgICAgICAgIC8vIGdyYXBoLmRyYXdSZWN0KHN0YXJ0WCxzdGFydFksd2lkdGgsaGVpZ2h0KTtcbiAgICAgICAgICAgIC8vIGdyYXBoLmVuZEZpbGwoKTtcblxuICAgICAgICAgICAgZ3JhcGgubGluZVN0eWxlKDUsIHRoaXMuZnJhbWVDb2xvcik7XG5cbiAgICAgICAgICAgIGdyYXBoLm1vdmVUbyhzdGFydFgsIHN0YXJ0WSk7XG4gICAgICAgICAgICBncmFwaC5saW5lVG8oc3RhcnRYICsgd2lkdGgsIHN0YXJ0WSk7XG4gICAgICAgICAgICBncmFwaC5saW5lVG8oc3RhcnRYICsgd2lkdGgsIHN0YXJ0WSArIGhlaWdodCk7XG4gICAgICAgICAgICBncmFwaC5saW5lVG8oc3RhcnRYLCBzdGFydFkgKyBoZWlnaHQpO1xuICAgICAgICAgICAgZ3JhcGgubGluZVRvKHN0YXJ0WCwgc3RhcnRZKTtcblxuICAgICAgICAgICAgZ3JhcGguZW5kRmlsbCgpO1xuXG5cbiAgICAgICAgfVxuXG4gICAgICAgIHNldCBidXR0b25XaWR0aCh3aWR0aDogbnVtYmVyKSB7XG4gICAgICAgICAgICB0aGlzLl9idXR0b25XaWR0aCA9IE1hdGgubWF4KHdpZHRoLCB0aGlzLmxhYmVsLndpZHRoKTtcbiAgICAgICAgICAgIHRoaXMucmVkcmF3KCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgYnV0dG9uSGVpZ2h0KGhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgICAgICB0aGlzLl9idXR0b25IZWlnaHQgPSBNYXRoLm1heChoZWlnaHQsIHRoaXMubGFiZWwuaGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMucmVkcmF3KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZWRyYXcoKSB7XG4gICAgICAgICAgICB0aGlzLmRyYXdOb3JtYWxTeXRsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgb25CdXR0b25PdmVyKCkge1xuICAgICAgICAgICAgdGhpcy5lZmZlY3Qud2lkdGggPSB0aGlzLl9idXR0b25XaWR0aDtcbiAgICAgICAgICAgIHRoaXMuZWZmZWN0LmhlaWdodCA9IHRoaXMuX2J1dHRvbkhlaWdodDtcblxuICAgICAgICAgICAgdGhpcy5lZmZlY3QudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmVmZmVjdC50aW50ID0gdGhpcy5mcmFtZUNvbG9yO1xuXG5cbiAgICAgICAgICAgIEJ1dHRvbkhvdmVyRWZmZWN0Lm9uSG92ZXIodGhpcy5ob3ZlclR5cGUsdGhpcy5lZmZlY3QsdHJ1ZSk7XG5cbiAgICAgICAgICAgIHRoaXMubGFiZWwuc3R5bGUuZmlsbCA9IHRoaXMuYmdDb2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIG9uQnV0dG9uT3V0KCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBCdXR0b25Ib3ZlckVmZmVjdC5vbkhvdmVyKHRoaXMuaG92ZXJUeXBlLHRoaXMuZWZmZWN0LGZhbHNlKTtcblxuICAgICAgICAgICAgdGhpcy5sYWJlbC5zdHlsZS5maWxsID0gdGhpcy5mcmFtZUNvbG9yO1xuICAgICAgICB9XG4gICAgfVxufSIsIm1vZHVsZSB2aWV3IHtcbiAgICBleHBvcnQgY2xhc3MgTG9hZGluZ1ZpZXcgZXh0ZW5kcyBQSVhJLkdyYXBoaWNzIHtcblxuICAgICAgICBwcml2YXRlIHByb2dyZXNzOiBudW1iZXIgPSAwO1xuICAgICAgICBjb2xvcjogbnVtYmVyID0gMHhhYWJjMTNcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdXBkYXRlUHJvZ3Jlc3MocDogbnVtYmVyKSB7XG4gICAgICAgICAgICBsZXQgcGVyY2VudCA9IHA7XG4gICAgICAgICAgICB0aGlzLnByb2dyZXNzID0gcGVyY2VudDtcblxuICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICAgICAgdGhpcy5saW5lU3R5bGUoMTAsIHRoaXMuY29sb3IpO1xuICAgICAgICAgICAgLy8gdGhpcy5kcmF3Q2lyY2xlKDAsIDAsIDIgKiBNYXRoLlBJICogcGVyY2VudCk7XG4gICAgICAgICAgICB0aGlzLmFyYygwLCAwLCA1MCwgMCwgMiAqIE1hdGguUEkgKiBwZXJjZW50KTtcbiAgICAgICAgICAgIHRoaXMuZW5kRmlsbCgpO1xuICAgICAgICB9XG5cbiAgICB9XG59XG4iLCJtb2R1bGUgdmlldyB7XG4gICAgZXhwb3J0IGNsYXNzIFJlZWxWaWV3IGV4dGVuZHMgUElYSS5TcHJpdGUge1xuXG4gICAgICAgIHByaXZhdGUgZnJhbWU6IFBJWEkuR3JhcGhpY3M7XG4gICAgICAgIHByaXZhdGUgd2hlZWw6IHZpZXcuV2hlZWxWaWV3O1xuICAgICAgICBwcml2YXRlIHNob3BzOiBzdHJpbmdbXTtcblxuICAgICAgICBwcml2YXRlIHRlbXBJZHM6IG51bWJlcltdID0gWzAsIDEsIDJdO1xuICAgICAgICBzcGluaW5nOiBib29sZWFuO1xuICAgICAgICAvLyBwcml2YXRlIF9tYXNrOiBQSVhJLkRpc3BsYXlPYmplY3Q7XG5cbiAgICAgICAgY29uc3RydWN0b3Ioc2hvcHM6IHN0cmluZ1tdKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5zaG9wcyA9IHNob3BzO1xuXG4gICAgICAgICAgICBsZXQgd2lkdGggPSBBcHAuQ29uc3RhbnRzLlNZTUJPTF9XSURUSDtcbiAgICAgICAgICAgIGxldCBoZWlnaHQgPSBBcHAuQ29uc3RhbnRzLlNZTUJPTF9IRUlHSFQ7XG5cbiAgICAgICAgICAgIHRoaXMuZnJhbWUgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuICAgICAgICAgICAgdGhpcy5mcmFtZS5saW5lU3R5bGUoMTAsIDB4MDAwMDAwKTtcbiAgICAgICAgICAgIHRoaXMuZnJhbWUuZHJhd1JlY3QoLXdpZHRoICogMC41LCAtaGVpZ2h0ICogMC41LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMuZnJhbWUuZW5kRmlsbCgpO1xuXG4gICAgICAgICAgICAvLyBtYXNrXG4gICAgICAgICAgICBsZXQgbWFzayA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gICAgICAgICAgICBtYXNrLmJlZ2luRmlsbCgweEZGRkZGRik7XG4gICAgICAgICAgICBtYXNrLmRyYXdSZWN0KC13aWR0aCAqIDAuNSwgLWhlaWdodCAqIDAuNSwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICBtYXNrLmVuZEZpbGwoKTtcblxuXG4gICAgICAgICAgICAvLyB3aGVlbFxuICAgICAgICAgICAgbGV0IHdoZWVsID0gbmV3IHZpZXcuV2hlZWxWaWV3KHNob3BzKTtcbiAgICAgICAgICAgIHdoZWVsLm1hc2sgPSBtYXNrO1xuICAgICAgICAgICAgd2hlZWwuc2V0SWRzKHRoaXMudGVtcElkcyk7XG4gICAgICAgICAgICB0aGlzLndoZWVsID0gd2hlZWw7XG5cblxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh3aGVlbCwgbWFzaywgdGhpcy5mcmFtZSk7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2hvcCh0aGlzLnRlbXBJZHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlU2hvcChzaG9wSWQ6IG51bWJlcltdKSB7XG4gICAgICAgICAgICB0aGlzLndoZWVsLnNldElkcyhzaG9wSWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgb25TcGluKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BpbmluZykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3BpbmluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIGxldCBkYW1waW5nU3RhcnRTZWMgPSAwLjU7XG4gICAgICAgICAgICBUd2Vlbk1heC50byh0aGlzLndoZWVsLnBvc2l0aW9uLCBkYW1waW5nU3RhcnRTZWMsIHsgeTogLTQwLCB5b3lvOiB0cnVlLCByZXBlYXQ6IDEgfSk7XG4gICAgICAgICAgICBUd2Vlbk1heC5mcm9tVG8odGhpcy53aGVlbC5wb3NpdGlvbiwgMC4yLCB7IHk6IDAgfSwgeyBkZWxheTogZGFtcGluZ1N0YXJ0U2VjICogMiwgeTogQXBwLkNvbnN0YW50cy5TWU1CT0xfSEVJR0hULCByZXBlYXQ6IDEwLCBlYXNlOiBMaW5lYXIuZWFzZU5vbmUsIG9uUmVwZWF0OiB0aGlzLnN3YXBJZCwgb25SZXBlYXRTY29wZTogdGhpcywgb25Db21wbGV0ZTogdGhpcy5vblNwaW5Db21wbGV0ZSwgb25Db21wbGV0ZVNjb3BlOiB0aGlzIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICByYW5kb21JZCgpOiBudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuc2hvcHMubGVuZ3RoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3YXBJZCgpIHtcbiAgICAgICAgICAgIHRoaXMudGVtcElkcy51bnNoaWZ0KHRoaXMucmFuZG9tSWQoKSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNob3AodGhpcy50ZW1wSWRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9uU3BpbkNvbXBsZXRlKCkge1xuXG4gICAgICAgICAgICB0aGlzLnNwaW5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMudGVtcElkcy51bnNoaWZ0KHRoaXMucmFuZG9tSWQoKSk7XG4gICAgICAgICAgICB0aGlzLnRlbXBJZHMudW5zaGlmdCh0aGlzLnJhbmRvbUlkKCkpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTaG9wKHRoaXMudGVtcElkcyk7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS5mcm9tVG8odGhpcy53aGVlbC5wb3NpdGlvbiwgMSwgeyB5OiAtQXBwLkNvbnN0YW50cy5TWU1CT0xfSEVJR0hUIH0sIHsgeTogMCwgZWFzZTogQmFjay5lYXNlT3V0IH0pO1xuICAgICAgICB9XG4gICAgfVxufSIsIm1vZHVsZSB2aWV3IHtcbiAgICBleHBvcnQgY2xhc3MgV2hlZWxWaWV3IGV4dGVuZHMgUElYSS5TcHJpdGUge1xuXG4gICAgICAgIHByaXZhdGUgc2hvcHM6IHN0cmluZ1tdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHNob3BzOiBzdHJpbmdbXSkge1xuICAgICAgICAgICAgc3VwZXIoUElYSS5UZXh0dXJlLkVNUFRZKTtcbiAgICAgICAgICAgIHRoaXMuc2hvcHMgPSBzaG9wcztcblxuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBzeW1ib2xUZXh0ID0gbmV3IFBJWEkuVGV4dChcIlwiLCB7IGZpbGw6IFwiMHgwMDAwMDBcIiB9KTtcbiAgICAgICAgICAgICAgICBzeW1ib2xUZXh0LmFuY2hvci5zZXQoMC41KTtcblxuICAgICAgICAgICAgICAgIGxldCBiZyA9IG5ldyBQSVhJLlNwcml0ZShQSVhJLlRleHR1cmUuV0hJVEUpO1xuICAgICAgICAgICAgICAgIGJnLndpZHRoID0gQXBwLkNvbnN0YW50cy5TWU1CT0xfV0lEVEg7XG4gICAgICAgICAgICAgICAgYmcuaGVpZ2h0ID0gQXBwLkNvbnN0YW50cy5TWU1CT0xfSEVJR0hUO1xuICAgICAgICAgICAgICAgIGJnLmFuY2hvci5zZXQoMC41KTtcblxuICAgICAgICAgICAgICAgIGxldCBjb250YWluZXIgPSBuZXcgUElYSS5Db250YWluZXIoKTtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuYWRkQ2hpbGQoYmcsIHN5bWJvbFRleHQpO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci55ID0gKGkgLSAxKSAqIEFwcC5Db25zdGFudHMuU1lNQk9MX0hFSUdIVDtcblxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNldElkcyhpZHM6IG51bWJlcltdKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBQSVhJLkNvbnRhaW5lciwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0ZXh0VmlldyA9IGNoaWxkLmdldENoaWxkQXQoMSkgYXMgUElYSS5UZXh0O1xuICAgICAgICAgICAgICAgIHRleHRWaWV3LnRleHQgPSB0aGlzLnNob3BzW2lkc1tpXV07XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICB9XG59IiwibW9kdWxlIHZve1xuICAgIGV4cG9ydCBjbGFzcyBTaG9wc1ZPe1xuICAgICAgICBwdWJsaWMgbm9ybWFsOnN0cmluZ1tdO1xuICAgICAgICBwdWJsaWMgZ29vZDpzdHJpbmdbXTtcbiAgICB9XG59Il19
