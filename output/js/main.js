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
            // this.app = new PIXI.Application(window.innerWidth , window.innerHeight , { backgroundColor: 0x1099bb, autoResize:true ,resolution:devicePixelRatio});
            // this.app.view.style.width = `100%`;
            // this.app.view.style.height = `100%`;
            this.app = new PIXI.Application(window.innerWidth, window.innerHeight, { backgroundColor: 0x1099bb, autoResize: true, resolution: devicePixelRatio });
            this.app.view.style.width = window.innerWidth + "px";
            this.app.view.style.height = window.innerHeight + "px";
            document.body.appendChild(this.app.view);
            if (window.addEventListener) {
                window.addEventListener("resize", this.onResize.bind(this), true);
            }
        };
        Main.prototype.onResize = function () {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
            this.app.view.style.width = window.innerWidth + "px";
            this.app.view.style.height = window.innerHeight + "px";
            if (this.app.screen.width < 2.5 * App.Constants.SYMBOL_WIDTH) {
                // 切直
                this.reelView.x = this.app.screen.width / 2;
                this.reelView.y = this.app.screen.height / 2 - 100;
                this.goodReelView.x = this.app.screen.width / 2;
                this.goodReelView.y = this.app.screen.height / 2 + 100;
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
            PIXI.settings.RESOLUTION = devicePixelRatio;
            // console.log(shops);
            var style = new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: 36,
                fontStyle: 'italic',
                fontWeight: 'bold',
                fill: ['#ffffff', '#00ff99'],
                stroke: '#4a1850',
                strokeThickness: 5,
                dropShadow: true,
                dropShadowColor: '#000000',
                dropShadowBlur: 4,
                dropShadowAngle: Math.PI / 6,
                dropShadowDistance: 6,
                wordWrap: true,
                wordWrapWidth: 440
            });
            var reel = new view.ReelView(shops.normal);
            var text1 = new PIXI.Text("普通", style);
            // text1.resolution = devicePixelRatio;
            text1.dirty = true;
            console.log("text resolution = " + text1.resolution + ", but window is " + devicePixelRatio + ", setting is " + PIXI.settings.RESOLUTION);
            text1.anchor.set(0.5);
            text1.y = -75;
            reel.addChild(text1);
            this.app.stage.addChild(reel);
            this.reelView = reel;
            // 老闆的
            var reel2 = new view.ReelView(shops.good);
            var text2 = new PIXI.Text("爽", style);
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
            // let outlineFilter = this.filter || [new PIXI.filters.TwistFilter(15)];
            this.filter = outlineFilter;
            var obj = { "var": 0 };
            TweenLite.to(obj, 5, { "var": Math.random() * 2 + 15, onUpdate: this.changeOutlineFilter, onUpdateParams: [obj, outlineFilter], onUpdateScope: this, ease: Quad.easeInOut });
            // this.app.stage.filters = [new PIXI.filters.TwistFilter(500,4)];
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Db25zdGFudHMudHMiLCJzcmMvTWFpbi50cyIsInNyYy9lZmZlY3QvQnV0dG9uSG92ZXJFZmZlY3QudHMiLCJzcmMvdmlldy9CdXR0b24udHMiLCJzcmMvdmlldy9Mb2FkaW5nVmlldy50cyIsInNyYy92aWV3L1JlZWxWaWV3LnRzIiwic3JjL3ZpZXcvV2hlZWxWaWV3LnRzIiwic3JjL3ZvL1Nob3BzVk8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQU8sR0FBRyxDQUtUO0FBTEQsV0FBTyxHQUFHO0lBQ047UUFBQTtRQUdBLENBQUM7UUFGaUIsc0JBQVksR0FBRyxHQUFHLENBQUM7UUFDbkIsdUJBQWEsR0FBRyxHQUFHLENBQUM7UUFDdEMsZ0JBQUM7S0FIRCxBQUdDLElBQUE7SUFIWSxhQUFTLFlBR3JCLENBQUE7QUFDTCxDQUFDLEVBTE0sR0FBRyxLQUFILEdBQUcsUUFLVDtBQ0xELElBQU8sR0FBRyxDQXlPVDtBQXpPRCxXQUFPLEdBQUc7SUFDTjtRQVNJO1lBRUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUV4QixDQUFDO1FBRU8sdUJBQVEsR0FBaEI7WUFDSSx3SkFBd0o7WUFDeEosc0NBQXNDO1lBQ3RDLHVDQUF1QztZQUN2QyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUcsRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFDLGdCQUFnQixFQUFDLENBQUMsQ0FBQztZQUNySixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFNLE1BQU0sQ0FBQyxVQUFVLE9BQUksQ0FBQztZQUNyRCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMs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QUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQWMsQ0FBQztnQkFDaEQsUUFBUSxDQUFDLElBQUksR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQyxDQUFBO1FBQ04sQ0FBQztRQUVMLGdCQUFDO0lBQUQsQ0FqQ0EsQUFpQ0MsQ0FqQzhCLElBQUksQ0FBQyxNQUFNLEdBaUN6QztJQWpDWSxjQUFTLFlBaUNyQixDQUFBO0FBQ0wsQ0FBQyxFQW5DTSxJQUFJLEtBQUosSUFBSSxRQW1DVjtBQ25DRCxJQUFPLEVBQUUsQ0FLUjtBQUxELFdBQU8sRUFBRTtJQUNMO1FBQUE7UUFHQSxDQUFDO1FBQUQsY0FBQztJQUFELENBSEEsQUFHQyxJQUFBO0lBSFksVUFBTyxVQUduQixDQUFBO0FBQ0wsQ0FBQyxFQUxNLEVBQUUsS0FBRixFQUFFLFFBS1IiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSBBcHAge1xuICAgIGV4cG9ydCBjbGFzcyBDb25zdGFudHMge1xuICAgICAgICBwdWJsaWMgc3RhdGljIFNZTUJPTF9XSURUSCA9IDIwMDtcbiAgICAgICAgcHVibGljIHN0YXRpYyBTWU1CT0xfSEVJR0hUID0gMTAwO1xuICAgIH1cbn0iLCJtb2R1bGUgQXBwIHtcbiAgICBleHBvcnQgY2xhc3MgTWFpbiB7XG5cbiAgICAgICAgcHJpdmF0ZSBhcHA6IFBJWEkuQXBwbGljYXRpb247XG5cbiAgICAgICAgcHJpdmF0ZSByZWVsVmlldzogdmlldy5SZWVsVmlldztcbiAgICAgICAgcHJpdmF0ZSBnb29kUmVlbFZpZXc6IHZpZXcuUmVlbFZpZXc7XG4gICAgICAgIHByaXZhdGUgc3BpbkJ0bjogUElYSS5EaXNwbGF5T2JqZWN0O1xuICAgICAgICBmaWx0ZXI6IGFueVtdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgICAgICB0aGlzLmluaXRQSVhJKCk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0TG9hZGluZygpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGluaXRQSVhJKCkge1xuICAgICAgICAgICAgLy8gdGhpcy5hcHAgPSBuZXcgUElYSS5BcHBsaWNhdGlvbih3aW5kb3cuaW5uZXJXaWR0aCAsIHdpbmRvdy5pbm5lckhlaWdodCAsIHsgYmFja2dyb3VuZENvbG9yOiAweDEwOTliYiwgYXV0b1Jlc2l6ZTp0cnVlICxyZXNvbHV0aW9uOmRldmljZVBpeGVsUmF0aW99KTtcbiAgICAgICAgICAgIC8vIHRoaXMuYXBwLnZpZXcuc3R5bGUud2lkdGggPSBgMTAwJWA7XG4gICAgICAgICAgICAvLyB0aGlzLmFwcC52aWV3LnN0eWxlLmhlaWdodCA9IGAxMDAlYDtcbiAgICAgICAgICAgIHRoaXMuYXBwID0gbmV3IFBJWEkuQXBwbGljYXRpb24od2luZG93LmlubmVyV2lkdGggLCB3aW5kb3cuaW5uZXJIZWlnaHQgLCB7IGJhY2tncm91bmRDb2xvcjogMHgxMDk5YmIsIGF1dG9SZXNpemU6dHJ1ZSAscmVzb2x1dGlvbjpkZXZpY2VQaXhlbFJhdGlvfSk7XG4gICAgICAgICAgICB0aGlzLmFwcC52aWV3LnN0eWxlLndpZHRoID0gYCR7d2luZG93LmlubmVyV2lkdGh9cHhgO1xuICAgICAgICAgICAgdGhpcy5hcHAudmlldy5zdHlsZS5oZWlnaHQgPSBgJHt3aW5kb3cuaW5uZXJIZWlnaHR9cHhgO1xuXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuYXBwLnZpZXcpO1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5vblJlc2l6ZS5iaW5kKHRoaXMpLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG9uUmVzaXplKCkge1xuICAgICAgICAgICAgdGhpcy5hcHAucmVuZGVyZXIucmVzaXplKHdpbmRvdy5pbm5lcldpZHRoICwgd2luZG93LmlubmVySGVpZ2h0ICk7XG4gICAgICAgICAgICB0aGlzLmFwcC52aWV3LnN0eWxlLndpZHRoID0gYCR7d2luZG93LmlubmVyV2lkdGh9cHhgO1xuICAgICAgICAgICAgdGhpcy5hcHAudmlldy5zdHlsZS5oZWlnaHQgPSBgJHt3aW5kb3cuaW5uZXJIZWlnaHR9cHhgO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5hcHAuc2NyZWVuLndpZHRoIDwgMi41ICogQXBwLkNvbnN0YW50cy5TWU1CT0xfV0lEVEgpIHtcbiAgICAgICAgICAgICAgICAvLyDliIfnm7RcbiAgICAgICAgICAgICAgICB0aGlzLnJlZWxWaWV3LnggPSB0aGlzLmFwcC5zY3JlZW4ud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgIHRoaXMucmVlbFZpZXcueSA9IHRoaXMuYXBwLnNjcmVlbi5oZWlnaHQgLyAyIC0gMTAwO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcueCA9IHRoaXMuYXBwLnNjcmVlbi53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcueSA9IHRoaXMuYXBwLnNjcmVlbi5oZWlnaHQgLyAyKzEwMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8g5YiH5qmrXG4gICAgICAgICAgICAgICAgdGhpcy5yZWVsVmlldy54ID0gdGhpcy5hcHAuc2NyZWVuLndpZHRoIC8gMiAtIDEyNTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlZWxWaWV3LnkgPSB0aGlzLmFwcC5zY3JlZW4uaGVpZ2h0IC8gMjtcblxuICAgICAgICAgICAgICAgIHRoaXMuZ29vZFJlZWxWaWV3LnggPSB0aGlzLmFwcC5zY3JlZW4ud2lkdGggLyAyICsgMTI1O1xuICAgICAgICAgICAgICAgIHRoaXMuZ29vZFJlZWxWaWV3LnkgPSB0aGlzLmFwcC5zY3JlZW4uaGVpZ2h0IC8gMjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zcGluQnRuLnggPSB0aGlzLmFwcC5zY3JlZW4ud2lkdGggLyAyO1xuICAgICAgICAgICAgdGhpcy5zcGluQnRuLnkgPSB0aGlzLmdvb2RSZWVsVmlldy55ICsgQXBwLkNvbnN0YW50cy5TWU1CT0xfSEVJR0hUO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhcnRMb2FkaW5nKCk6IGFueSB7XG4gICAgICAgICAgICBsZXQgbG9hZGluZ1ZpZXcgPSBuZXcgdmlldy5Mb2FkaW5nVmlldygpO1xuICAgICAgICAgICAgbG9hZGluZ1ZpZXcueCA9IHRoaXMuYXBwLnNjcmVlbi53aWR0aCAvIDI7XG4gICAgICAgICAgICBsb2FkaW5nVmlldy55ID0gdGhpcy5hcHAuc2NyZWVuLmhlaWdodCAvIDI7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwLnN0YWdlLmFkZENoaWxkKGxvYWRpbmdWaWV3KTtcblxuICAgICAgICAgICAgUElYSS5sb2FkZXJcbiAgICAgICAgICAgICAgICAub24oXCJwcm9ncmVzc1wiLCAobG9hZGVyOiBQSVhJLmxvYWRlcnMuTG9hZGVyLCByZXNvdXJjZTogUElYSS5sb2FkZXJzLlJlc291cmNlKSA9PiB7IGxvYWRpbmdWaWV3LnVwZGF0ZVByb2dyZXNzKGxvYWRlci5wcm9ncmVzcykgfSlcbiAgICAgICAgICAgICAgICAuYWRkKFwic2hvcHNcIiwgXCJyZXNvdXJjZS9zaG9wcy5qc29uXCIpXG4gICAgICAgICAgICAgICAgLmxvYWQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsb2FkaW5nVmlldy5wYXJlbnQucmVtb3ZlQ2hpbGQobG9hZGluZ1ZpZXcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTG9hZGVkKCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIG9uTG9hZGVkKCkge1xuICAgICAgICAgICAgdGhpcy5pbml0UmVlbFZpZXcoUElYSS5sb2FkZXIucmVzb3VyY2VzLnNob3BzLmRhdGEpO1xuICAgICAgICAgICAgdGhpcy5pbml0U3BpbkJ1dHRvbigpO1xuICAgICAgICAgICAgdGhpcy5pbml0S2V5Ym9hcmRFdmVudCgpO1xuXG4gICAgICAgICAgICB0aGlzLm9uUmVzaXplKCk7XG5cbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgaW5pdFJlZWxWaWV3KHNob3BzOiB2by5TaG9wc1ZPKSB7XG4gICAgICAgICAgICBQSVhJLnNldHRpbmdzLlJFU09MVVRJT04gPSBkZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc2hvcHMpO1xuICAgICAgICAgICAgbGV0IHN0eWxlID0gbmV3IFBJWEkuVGV4dFN0eWxlKHtcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAnQXJpYWwnLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAzNixcbiAgICAgICAgICAgICAgICBmb250U3R5bGU6ICdpdGFsaWMnLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdib2xkJyxcbiAgICAgICAgICAgICAgICBmaWxsOiBbJyNmZmZmZmYnLCAnIzAwZmY5OSddLCAvLyBncmFkaWVudFxuICAgICAgICAgICAgICAgIHN0cm9rZTogJyM0YTE4NTAnLFxuICAgICAgICAgICAgICAgIHN0cm9rZVRoaWNrbmVzczogNSxcbiAgICAgICAgICAgICAgICBkcm9wU2hhZG93OiB0cnVlLFxuICAgICAgICAgICAgICAgIGRyb3BTaGFkb3dDb2xvcjogJyMwMDAwMDAnLFxuICAgICAgICAgICAgICAgIGRyb3BTaGFkb3dCbHVyOiA0LFxuICAgICAgICAgICAgICAgIGRyb3BTaGFkb3dBbmdsZTogTWF0aC5QSSAvIDYsXG4gICAgICAgICAgICAgICAgZHJvcFNoYWRvd0Rpc3RhbmNlOiA2LFxuICAgICAgICAgICAgICAgIHdvcmRXcmFwOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdvcmRXcmFwV2lkdGg6IDQ0MFxuICAgICAgICAgICAgfSk7XG5cblxuICAgICAgICAgICAgbGV0IHJlZWwgPSBuZXcgdmlldy5SZWVsVmlldyhzaG9wcy5ub3JtYWwpO1xuXG4gICAgICAgICAgICBsZXQgdGV4dDEgPSBuZXcgUElYSS5UZXh0KFwi5pmu6YCaXCIsc3R5bGUpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIHRleHQxLnJlc29sdXRpb24gPSBkZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgdGV4dDEuZGlydHkgPSB0cnVlO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgdGV4dCByZXNvbHV0aW9uID0gJHt0ZXh0MS5yZXNvbHV0aW9ufSwgYnV0IHdpbmRvdyBpcyAke2RldmljZVBpeGVsUmF0aW99LCBzZXR0aW5nIGlzICR7UElYSS5zZXR0aW5ncy5SRVNPTFVUSU9OfWApXG4gICAgICAgICAgICB0ZXh0MS5hbmNob3Iuc2V0KDAuNSk7XG4gICAgICAgICAgICB0ZXh0MS55ID0gLTc1O1xuICAgICAgICAgICAgcmVlbC5hZGRDaGlsZCh0ZXh0MSk7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwLnN0YWdlLmFkZENoaWxkKHJlZWwpO1xuICAgICAgICAgICAgdGhpcy5yZWVsVmlldyA9IHJlZWw7XG5cbiAgICAgICAgICAgIC8vIOiAgemXhueahFxuICAgICAgICAgICAgbGV0IHJlZWwyID0gbmV3IHZpZXcuUmVlbFZpZXcoc2hvcHMuZ29vZCk7XG4gICAgICAgICAgICBsZXQgdGV4dDIgPSBuZXcgUElYSS5UZXh0KFwi54i9XCIsc3R5bGUpXG4gICAgICAgICAgICB0ZXh0Mi5hbmNob3Iuc2V0KDAuNSk7XG4gICAgICAgICAgICB0ZXh0Mi55ID0gLTc1O1xuICAgICAgICAgICAgcmVlbDIuYWRkQ2hpbGQodGV4dDIpO1xuXG4gICAgICAgICAgICB0aGlzLmFwcC5zdGFnZS5hZGRDaGlsZChyZWVsMik7XG4gICAgICAgICAgICB0aGlzLmdvb2RSZWVsVmlldyA9IHJlZWwyO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdFNwaW5CdXR0b24oKSB7XG4gICAgICAgICAgICBsZXQgYnRuID0gbmV3IHZpZXcuQnV0dG9uKFwi6ZaL5aeLXCIpO1xuICAgICAgICAgICAgYnRuLmFuY2hvci5zZXQoMC41KTtcbiAgICAgICAgICAgIGJ0bi54ID0gdGhpcy5yZWVsVmlldy54O1xuICAgICAgICAgICAgYnRuLnkgPSB0aGlzLnJlZWxWaWV3LnkgKyBBcHAuQ29uc3RhbnRzLlNZTUJPTF9IRUlHSFQ7XG4gICAgICAgICAgICBidG4uYnV0dG9uV2lkdGggPSBBcHAuQ29uc3RhbnRzLlNZTUJPTF9XSURUSDtcbiAgICAgICAgICAgIGJ0bi5idXR0b25IZWlnaHQgPSA1NTtcbiAgICAgICAgICAgIC8vIGJ0bi54ID0gdGhpcy5hcHAuc2NyZWVuLndpZHRoIC0gNjQ7XG4gICAgICAgICAgICAvLyBidG4ueSA9IHRoaXMuYXBwLnNjcmVlbi5oZWlnaHQgLSA0ODtcbiAgICAgICAgICAgIGJ0bi5pbnRlcmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICBidG4ub24oJ3BvaW50ZXJ1cCcsIHRoaXMuc3Bpbi5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5zcGluQnRuID0gYnRuO1xuXG4gICAgICAgICAgICB0aGlzLmFwcC5zdGFnZS5hZGRDaGlsZChidG4pO1xuXG5cbiAgICAgICAgICAgIC8vIGxldCB0ZXN0QnRuID0gbmV3IHZpZXcuQnV0dG9uKCk7XG4gICAgICAgICAgICAvLyB0ZXN0QnRuLmJ1dHRvbldpZHRoID0gQXBwLkNvbnN0YW50cy5TWU1CT0xfV0lEVEg7XG4gICAgICAgICAgICAvLyB0ZXN0QnRuLmJ1dHRvbkhlaWdodCA9IDc1O1xuICAgICAgICAgICAgLy8gLy8gdGVzdEJ0bi5yZWRyYXcoKTtcblxuICAgICAgICAgICAgLy8gdGVzdEJ0bi54ID0gdGhpcy5yZWVsVmlldy54O1xuICAgICAgICAgICAgLy8gdGVzdEJ0bi55ID0gdGhpcy5yZWVsVmlldy55ICsgQXBwLkNvbnN0YW50cy5TWU1CT0xfSEVJR0hUICoyO1xuICAgICAgICAgICAgLy8gdGhpcy5hcHAuc3RhZ2UuYWRkQ2hpbGQodGVzdEJ0bik7XG4gICAgICAgIH1cblxuICAgICAgICBzcGluKCkge1xuICAgICAgICAgICAgdGhpcy5yZWVsVmlldy5vblNwaW4oKTtcbiAgICAgICAgICAgIHRoaXMuZ29vZFJlZWxWaWV3Lm9uU3BpbigpO1xuXG4gICAgICAgICAgICB0aGlzLnJlZWxWaWV3LmZpbHRlcnMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcuZmlsdGVycyA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIGxldCBvdXRsaW5lRmlsdGVyID0gW3RoaXMuZmlsdGVyIHx8IG5ldyBQSVhJLmZpbHRlcnMuT3V0bGluZUZpbHRlcig1LCAweGZmMDAwMCldO1xuICAgICAgICAgICAgbGV0IG91dGxpbmVGaWx0ZXIgPSB0aGlzLmZpbHRlciB8fCBbbmV3IFBJWEkuZmlsdGVycy5HbG93RmlsdGVyKDE1KV07XG4gICAgICAgICAgICAvLyBsZXQgb3V0bGluZUZpbHRlciA9IHRoaXMuZmlsdGVyIHx8IFtuZXcgUElYSS5maWx0ZXJzLlR3aXN0RmlsdGVyKDE1KV07XG4gICAgICAgICAgICB0aGlzLmZpbHRlciA9IG91dGxpbmVGaWx0ZXI7XG5cbiAgICAgICAgICAgIGxldCBvYmogPSB7IHZhcjogMCB9O1xuICAgICAgICAgICAgVHdlZW5MaXRlLnRvKG9iaiwgNSwgeyB2YXI6IE1hdGgucmFuZG9tKCkgKiAyICsgMTUsIG9uVXBkYXRlOiB0aGlzLmNoYW5nZU91dGxpbmVGaWx0ZXIsIG9uVXBkYXRlUGFyYW1zOiBbb2JqLCBvdXRsaW5lRmlsdGVyXSwgb25VcGRhdGVTY29wZTogdGhpcywgZWFzZTogUXVhZC5lYXNlSW5PdXQgfSk7XG5cblxuICAgICAgICAgICAgLy8gdGhpcy5hcHAuc3RhZ2UuZmlsdGVycyA9IFtuZXcgUElYSS5maWx0ZXJzLlR3aXN0RmlsdGVyKDUwMCw0KV07XG4gICAgICAgIH1cblxuICAgICAgICBpbml0S2V5Ym9hcmRFdmVudCgpe1xuICAgICAgICAgICAgbGV0IHNwYWNlID0gdGhpcy5rZXlib2FyZCgzMik7XG4gICAgICAgICAgICBzcGFjZS5wcmVzcyA9IHRoaXMuc3Bpbi5iaW5kKHRoaXMpO1xuXG4gICAgICAgICAgICBsZXQgZW50ZXIgPSB0aGlzLmtleWJvYXJkKDEzKTtcbiAgICAgICAgICAgIGVudGVyLnByZXNzID0gdGhpcy5zcGluLmJpbmQodGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBjaGFuZ2VPdXRsaW5lRmlsdGVyKG9iajogeyB2YXI6IG51bWJlciB9LCBmaWx0ZXIpIHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IE1hdGgucm91bmQob2JqLnZhcikgJSAyO1xuXG4gICAgICAgICAgICBpZiAoaW5kZXgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlZWxWaWV3LmZpbHRlcnMgPSBmaWx0ZXI7XG4gICAgICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcuZmlsdGVycyA9IG51bGw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVlbFZpZXcuZmlsdGVycyA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcuZmlsdGVycyA9IGZpbHRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGtleWJvYXJkKGtleUNvZGUpIHtcbiAgICAgICAgICAgIGxldCBrZXkgOmFueSA9IHt9O1xuICAgICAgICAgICAga2V5LmNvZGUgPSBrZXlDb2RlO1xuICAgICAgICAgICAga2V5LmlzRG93biA9IGZhbHNlO1xuICAgICAgICAgICAga2V5LmlzVXAgPSB0cnVlO1xuICAgICAgICAgICAga2V5LnByZXNzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAga2V5LnJlbGVhc2UgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAvL1RoZSBgZG93bkhhbmRsZXJgXG4gICAgICAgICAgICBrZXkuZG93bkhhbmRsZXIgPSBldmVudCA9PiB7XG4gICAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSBrZXkuY29kZSkge1xuICAgICAgICAgICAgICAgIGlmIChrZXkuaXNVcCAmJiBrZXkucHJlc3MpIGtleS5wcmVzcygpO1xuICAgICAgICAgICAgICAgIGtleS5pc0Rvd24gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGtleS5pc1VwID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgXG4gICAgICAgICAgICAvL1RoZSBgdXBIYW5kbGVyYFxuICAgICAgICAgICAga2V5LnVwSGFuZGxlciA9IGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IGtleS5jb2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleS5pc0Rvd24gJiYga2V5LnJlbGVhc2UpIGtleS5yZWxlYXNlKCk7XG4gICAgICAgICAgICAgICAga2V5LmlzRG93biA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGtleS5pc1VwID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICBcbiAgICAgICAgICAgIC8vQXR0YWNoIGV2ZW50IGxpc3RlbmVyc1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgIFwia2V5ZG93blwiLCBrZXkuZG93bkhhbmRsZXIuYmluZChrZXkpLCBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICBcImtleXVwXCIsIGtleS51cEhhbmRsZXIuYmluZChrZXkpLCBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBrZXk7XG4gICAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSB2aWV3IHtcbiAgICBleHBvcnQgZW51bSBIb3ZlclR5cGUge1xuICAgICAgICB0eXBlMVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBCdXR0b25Ib3ZlckVmZmVjdCB7XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBvbkhvdmVyKHR5cGU6IEhvdmVyVHlwZSwgdHdlZW5PYmo6IFBJWEkuRGlzcGxheU9iamVjdCwgaXNPdmVySW46IGJvb2xlYW4pIHtcblxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBIb3ZlclR5cGUudHlwZTE6XG4gICAgICAgICAgICAgICAgICAgIEJ1dHRvbkhvdmVyRWZmZWN0LmFscGhhVmlzaWJsZSh0d2Vlbk9iaiwgaXNPdmVySW4pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGFscGhhVmlzaWJsZSh0d2Vlbk9iajogUElYSS5EaXNwbGF5T2JqZWN0LCBpc092ZXJJbjogYm9vbGVhbikge1xuICAgICAgICAgICAgbGV0IHNlYyA9IDAuNTtcbiAgICAgICAgICAgIFR3ZWVuTGl0ZS5raWxsVHdlZW5zT2YodHdlZW5PYmopO1xuXG4gICAgICAgICAgICBpZiAoaXNPdmVySW4pIHtcbiAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8odHdlZW5PYmosIHNlYywgeyBhbHBoYTogMSB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHR3ZWVuT2JqLCBzZWMsIHsgYWxwaGE6IDAsIG9uQ29tcGxldGU6ICgpID0+IHsgdHdlZW5PYmoudmlzaWJsZSA9IGZhbHNlIH0gfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfVxufSIsIm1vZHVsZSB2aWV3IHtcblxuICAgIGV4cG9ydCBjbGFzcyBCdXR0b24gZXh0ZW5kcyBQSVhJLlNwcml0ZSB7XG5cbiAgICAgICAgaG92ZXJUeXBlOiBIb3ZlclR5cGUgPSBIb3ZlclR5cGUudHlwZTE7XG5cblxuICAgICAgICBmcmFtZUNvbG9yID0gMHhmZmZmZmY7XG4gICAgICAgIGJnQ29sb3IgPSAweDAwMTFmZjtcbiAgICAgICAgYmdDb2xvck9uQ2xpY2sgPSAweDMzYWFhYTtcblxuICAgICAgICBsYWJlbDogUElYSS5UZXh0O1xuICAgICAgICBwcml2YXRlIGJnVmlldzogUElYSS5HcmFwaGljcztcblxuICAgICAgICBwcml2YXRlIF9idXR0b25XaWR0aDogbnVtYmVyO1xuICAgICAgICBwcml2YXRlIF9idXR0b25IZWlnaHQ6IG51bWJlcjtcblxuICAgICAgICBwcml2YXRlIGVmZmVjdDogUElYSS5TcHJpdGU7XG5cbiAgICAgICAgY29uc3RydWN0b3IodGV4dCA9IFwiQnV0dG9uXCIpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuYmdWaWV3ID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcblxuICAgICAgICAgICAgdGhpcy5lZmZlY3QgPSBuZXcgUElYSS5TcHJpdGUoUElYSS5UZXh0dXJlLldISVRFKTtcbiAgICAgICAgICAgIHRoaXMuZWZmZWN0LmFuY2hvci5zZXQoMC41KTtcbiAgICAgICAgICAgIHRoaXMuZWZmZWN0LnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZWZmZWN0LmFscGhhID0gMDtcblxuICAgICAgICAgICAgdGhpcy5sYWJlbCA9IG5ldyBQSVhJLlRleHQodGV4dCwgeyBmaWxsOiB0aGlzLmZyYW1lQ29sb3IgfSk7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLmFuY2hvci5zZXQoMC41KTtcblxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmJnVmlldywgdGhpcy5lZmZlY3QsIHRoaXMubGFiZWwpO1xuXG4gICAgICAgICAgICB0aGlzLmRyYXdOb3JtYWxTeXRsZSgpO1xuXG4gICAgICAgICAgICAvLyBzZXQgaW50ZXJhY3RpdmVcbiAgICAgICAgICAgIHRoaXMuaW50ZXJhY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5idXR0b25Nb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMub24oXCJwb2ludGVyb3ZlclwiLCB0aGlzLm9uQnV0dG9uT3Zlcik7XG4gICAgICAgICAgICB0aGlzLm9uKFwicG9pbnRlcm91dFwiLCB0aGlzLm9uQnV0dG9uT3V0KTtcbiAgICAgICAgICAgIHRoaXMub24oXCJwb2ludGVyZG93blwiLCAoKSA9PiB7IHRoaXMuZWZmZWN0LnRpbnQgPSB0aGlzLmJnQ29sb3JPbkNsaWNrIH0pO1xuICAgICAgICAgICAgdGhpcy5vbihcInBvaW50ZXJ1cFwiLCAoKSA9PiB7IHRoaXMuZWZmZWN0LnRpbnQgPSB0aGlzLmZyYW1lQ29sb3IgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBkcmF3Tm9ybWFsU3l0bGUoKSB7XG4gICAgICAgICAgICAvLyBsZXQgd2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICAgICAgLy8gbGV0IGhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgbGV0IHBhZGRpbmcgPSAxMDtcbiAgICAgICAgICAgIGxldCB3aWR0aCA9IHRoaXMuX2J1dHRvbldpZHRoIHx8IHRoaXMubGFiZWwud2lkdGggKyBwYWRkaW5nO1xuICAgICAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMuX2J1dHRvbkhlaWdodCB8fCB0aGlzLmxhYmVsLmhlaWdodCArIHBhZGRpbmc7XG5cbiAgICAgICAgICAgIC8vIGxldCBzdGFydFggPSAgLXdpZHRoICogMC41O1xuICAgICAgICAgICAgLy8gbGV0IHN0YXJ0WSA9IC1oZWlnaHQgKiAwLjU7XG4gICAgICAgICAgICBsZXQgc3RhcnRYID0gLXdpZHRoICogMC41O1xuICAgICAgICAgICAgbGV0IHN0YXJ0WSA9IC1oZWlnaHQgKiAwLjU7XG5cbiAgICAgICAgICAgIGxldCBncmFwaCA9IHRoaXMuYmdWaWV3O1xuICAgICAgICAgICAgZ3JhcGguY2xlYXIoKTtcbiAgICAgICAgICAgIGdyYXBoLmJlZ2luRmlsbCh0aGlzLmJnQ29sb3IpO1xuICAgICAgICAgICAgLy8gZ3JhcGguZHJhd1JlY3Qoc3RhcnRYLHN0YXJ0WSx3aWR0aCxoZWlnaHQpO1xuICAgICAgICAgICAgLy8gZ3JhcGguZW5kRmlsbCgpO1xuXG4gICAgICAgICAgICBncmFwaC5saW5lU3R5bGUoNSwgdGhpcy5mcmFtZUNvbG9yKTtcblxuICAgICAgICAgICAgZ3JhcGgubW92ZVRvKHN0YXJ0WCwgc3RhcnRZKTtcbiAgICAgICAgICAgIGdyYXBoLmxpbmVUbyhzdGFydFggKyB3aWR0aCwgc3RhcnRZKTtcbiAgICAgICAgICAgIGdyYXBoLmxpbmVUbyhzdGFydFggKyB3aWR0aCwgc3RhcnRZICsgaGVpZ2h0KTtcbiAgICAgICAgICAgIGdyYXBoLmxpbmVUbyhzdGFydFgsIHN0YXJ0WSArIGhlaWdodCk7XG4gICAgICAgICAgICBncmFwaC5saW5lVG8oc3RhcnRYLCBzdGFydFkpO1xuXG4gICAgICAgICAgICBncmFwaC5lbmRGaWxsKCk7XG5cblxuICAgICAgICB9XG5cbiAgICAgICAgc2V0IGJ1dHRvbldpZHRoKHdpZHRoOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2J1dHRvbldpZHRoID0gTWF0aC5tYXgod2lkdGgsIHRoaXMubGFiZWwud2lkdGgpO1xuICAgICAgICAgICAgdGhpcy5yZWRyYXcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCBidXR0b25IZWlnaHQoaGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2J1dHRvbkhlaWdodCA9IE1hdGgubWF4KGhlaWdodCwgdGhpcy5sYWJlbC5oZWlnaHQpO1xuICAgICAgICAgICAgdGhpcy5yZWRyYXcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlZHJhdygpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd05vcm1hbFN5dGxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBvbkJ1dHRvbk92ZXIoKSB7XG4gICAgICAgICAgICB0aGlzLmVmZmVjdC53aWR0aCA9IHRoaXMuX2J1dHRvbldpZHRoO1xuICAgICAgICAgICAgdGhpcy5lZmZlY3QuaGVpZ2h0ID0gdGhpcy5fYnV0dG9uSGVpZ2h0O1xuXG4gICAgICAgICAgICB0aGlzLmVmZmVjdC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZWZmZWN0LnRpbnQgPSB0aGlzLmZyYW1lQ29sb3I7XG5cblxuICAgICAgICAgICAgQnV0dG9uSG92ZXJFZmZlY3Qub25Ib3Zlcih0aGlzLmhvdmVyVHlwZSwgdGhpcy5lZmZlY3QsIHRydWUpO1xuXG4gICAgICAgICAgICB0aGlzLmxhYmVsLnN0eWxlLmZpbGwgPSB0aGlzLmJnQ29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBvbkJ1dHRvbk91dCgpIHtcblxuICAgICAgICAgICAgQnV0dG9uSG92ZXJFZmZlY3Qub25Ib3Zlcih0aGlzLmhvdmVyVHlwZSwgdGhpcy5lZmZlY3QsIGZhbHNlKTtcblxuICAgICAgICAgICAgdGhpcy5sYWJlbC5zdHlsZS5maWxsID0gdGhpcy5mcmFtZUNvbG9yO1xuICAgICAgICB9XG4gICAgfVxufSIsIm1vZHVsZSB2aWV3IHtcbiAgICBleHBvcnQgY2xhc3MgTG9hZGluZ1ZpZXcgZXh0ZW5kcyBQSVhJLkdyYXBoaWNzIHtcblxuICAgICAgICBwcml2YXRlIHByb2dyZXNzOiBudW1iZXIgPSAwO1xuICAgICAgICBjb2xvcjogbnVtYmVyID0gMHhhYWJjMTNcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdXBkYXRlUHJvZ3Jlc3MocDogbnVtYmVyKSB7XG4gICAgICAgICAgICBsZXQgcGVyY2VudCA9IHA7XG4gICAgICAgICAgICB0aGlzLnByb2dyZXNzID0gcGVyY2VudDtcblxuICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICAgICAgdGhpcy5saW5lU3R5bGUoMTAsIHRoaXMuY29sb3IpO1xuICAgICAgICAgICAgLy8gdGhpcy5kcmF3Q2lyY2xlKDAsIDAsIDIgKiBNYXRoLlBJICogcGVyY2VudCk7XG4gICAgICAgICAgICB0aGlzLmFyYygwLCAwLCA1MCwgMCwgMiAqIE1hdGguUEkgKiBwZXJjZW50KTtcbiAgICAgICAgICAgIHRoaXMuZW5kRmlsbCgpO1xuICAgICAgICB9XG5cbiAgICB9XG59XG4iLCJtb2R1bGUgdmlldyB7XG4gICAgZXhwb3J0IGNsYXNzIFJlZWxWaWV3IGV4dGVuZHMgUElYSS5TcHJpdGUge1xuXG4gICAgICAgIHByaXZhdGUgZnJhbWU6IFBJWEkuR3JhcGhpY3M7XG4gICAgICAgIHByaXZhdGUgd2hlZWw6IHZpZXcuV2hlZWxWaWV3O1xuICAgICAgICBwcml2YXRlIHNob3BzOiBzdHJpbmdbXTtcblxuICAgICAgICBwcml2YXRlIHRlbXBJZHM6IG51bWJlcltdID0gWzAsIDEsIDJdO1xuICAgICAgICBzcGluaW5nOiBib29sZWFuO1xuICAgICAgICAvLyBwcml2YXRlIF9tYXNrOiBQSVhJLkRpc3BsYXlPYmplY3Q7XG5cbiAgICAgICAgY29uc3RydWN0b3Ioc2hvcHM6IHN0cmluZ1tdKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5zaG9wcyA9IHNob3BzO1xuXG4gICAgICAgICAgICBsZXQgd2lkdGggPSBBcHAuQ29uc3RhbnRzLlNZTUJPTF9XSURUSDtcbiAgICAgICAgICAgIGxldCBoZWlnaHQgPSBBcHAuQ29uc3RhbnRzLlNZTUJPTF9IRUlHSFQ7XG5cbiAgICAgICAgICAgIHRoaXMuZnJhbWUgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuICAgICAgICAgICAgdGhpcy5mcmFtZS5saW5lU3R5bGUoMTAsIDB4MDAwMDAwKTtcbiAgICAgICAgICAgIHRoaXMuZnJhbWUuZHJhd1JlY3QoLXdpZHRoICogMC41LCAtaGVpZ2h0ICogMC41LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMuZnJhbWUuZW5kRmlsbCgpO1xuXG4gICAgICAgICAgICAvLyBtYXNrXG4gICAgICAgICAgICBsZXQgbWFzayA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gICAgICAgICAgICBtYXNrLmJlZ2luRmlsbCgweEZGRkZGRik7XG4gICAgICAgICAgICBtYXNrLmRyYXdSZWN0KC13aWR0aCAqIDAuNSwgLWhlaWdodCAqIDAuNSwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICBtYXNrLmVuZEZpbGwoKTtcblxuXG4gICAgICAgICAgICAvLyB3aGVlbFxuICAgICAgICAgICAgbGV0IHdoZWVsID0gbmV3IHZpZXcuV2hlZWxWaWV3KHNob3BzKTtcbiAgICAgICAgICAgIHdoZWVsLm1hc2sgPSBtYXNrO1xuICAgICAgICAgICAgd2hlZWwuc2V0SWRzKHRoaXMudGVtcElkcyk7XG4gICAgICAgICAgICB0aGlzLndoZWVsID0gd2hlZWw7XG5cblxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh3aGVlbCwgbWFzaywgdGhpcy5mcmFtZSk7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2hvcCh0aGlzLnRlbXBJZHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlU2hvcChzaG9wSWQ6IG51bWJlcltdKSB7XG4gICAgICAgICAgICB0aGlzLndoZWVsLnNldElkcyhzaG9wSWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgb25TcGluKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BpbmluZykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3BpbmluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIGxldCBkYW1waW5nU3RhcnRTZWMgPSAwLjU7XG4gICAgICAgICAgICBUd2Vlbk1heC50byh0aGlzLndoZWVsLnBvc2l0aW9uLCBkYW1waW5nU3RhcnRTZWMsIHsgeTogLTQwLCB5b3lvOiB0cnVlLCByZXBlYXQ6IDEgfSk7XG4gICAgICAgICAgICBUd2Vlbk1heC5mcm9tVG8odGhpcy53aGVlbC5wb3NpdGlvbiwgMC4yLCB7IHk6IDAgfSwgeyBkZWxheTogZGFtcGluZ1N0YXJ0U2VjICogMiwgeTogQXBwLkNvbnN0YW50cy5TWU1CT0xfSEVJR0hULCByZXBlYXQ6IDEwLCBlYXNlOiBMaW5lYXIuZWFzZU5vbmUsIG9uUmVwZWF0OiB0aGlzLnN3YXBJZCwgb25SZXBlYXRTY29wZTogdGhpcywgb25Db21wbGV0ZTogdGhpcy5vblNwaW5Db21wbGV0ZSwgb25Db21wbGV0ZVNjb3BlOiB0aGlzIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICByYW5kb21JZCgpOiBudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuc2hvcHMubGVuZ3RoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3YXBJZCgpIHtcbiAgICAgICAgICAgIHRoaXMudGVtcElkcy51bnNoaWZ0KHRoaXMucmFuZG9tSWQoKSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNob3AodGhpcy50ZW1wSWRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9uU3BpbkNvbXBsZXRlKCkge1xuXG4gICAgICAgICAgICB0aGlzLnNwaW5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMudGVtcElkcy51bnNoaWZ0KHRoaXMucmFuZG9tSWQoKSk7XG4gICAgICAgICAgICB0aGlzLnRlbXBJZHMudW5zaGlmdCh0aGlzLnJhbmRvbUlkKCkpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTaG9wKHRoaXMudGVtcElkcyk7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS5mcm9tVG8odGhpcy53aGVlbC5wb3NpdGlvbiwgMSwgeyB5OiAtQXBwLkNvbnN0YW50cy5TWU1CT0xfSEVJR0hUIH0sIHsgeTogMCwgZWFzZTogQmFjay5lYXNlT3V0IH0pO1xuICAgICAgICB9XG4gICAgfVxufSIsIm1vZHVsZSB2aWV3IHtcbiAgICBleHBvcnQgY2xhc3MgV2hlZWxWaWV3IGV4dGVuZHMgUElYSS5TcHJpdGUge1xuXG4gICAgICAgIHByaXZhdGUgc2hvcHM6IHN0cmluZ1tdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHNob3BzOiBzdHJpbmdbXSkge1xuICAgICAgICAgICAgc3VwZXIoUElYSS5UZXh0dXJlLkVNUFRZKTtcbiAgICAgICAgICAgIHRoaXMuc2hvcHMgPSBzaG9wcztcblxuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBzeW1ib2xUZXh0ID0gbmV3IFBJWEkuVGV4dChcIlwiLCB7IGZpbGw6IFwiMHgwMDAwMDBcIiB9KTtcbiAgICAgICAgICAgICAgICBzeW1ib2xUZXh0LmFuY2hvci5zZXQoMC41KTtcblxuICAgICAgICAgICAgICAgIGxldCBiZyA9IG5ldyBQSVhJLlNwcml0ZShQSVhJLlRleHR1cmUuV0hJVEUpO1xuICAgICAgICAgICAgICAgIGJnLndpZHRoID0gQXBwLkNvbnN0YW50cy5TWU1CT0xfV0lEVEg7XG4gICAgICAgICAgICAgICAgYmcuaGVpZ2h0ID0gQXBwLkNvbnN0YW50cy5TWU1CT0xfSEVJR0hUO1xuICAgICAgICAgICAgICAgIGJnLmFuY2hvci5zZXQoMC41KTtcblxuICAgICAgICAgICAgICAgIGxldCBjb250YWluZXIgPSBuZXcgUElYSS5Db250YWluZXIoKTtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuYWRkQ2hpbGQoYmcsIHN5bWJvbFRleHQpO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci55ID0gKGkgLSAxKSAqIEFwcC5Db25zdGFudHMuU1lNQk9MX0hFSUdIVDtcblxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNldElkcyhpZHM6IG51bWJlcltdKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBQSVhJLkNvbnRhaW5lciwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0ZXh0VmlldyA9IGNoaWxkLmdldENoaWxkQXQoMSkgYXMgUElYSS5UZXh0O1xuICAgICAgICAgICAgICAgIHRleHRWaWV3LnRleHQgPSB0aGlzLnNob3BzW2lkc1tpXV07XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICB9XG59IiwibW9kdWxlIHZve1xuICAgIGV4cG9ydCBjbGFzcyBTaG9wc1ZPe1xuICAgICAgICBwdWJsaWMgbm9ybWFsOnN0cmluZ1tdO1xuICAgICAgICBwdWJsaWMgZ29vZDpzdHJpbmdbXTtcbiAgICB9XG59Il19
