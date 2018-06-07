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
            // PIXI.settings.PRECISION_FRAGMENT = "highp"
            // this.app = new PIXI.Application(window.innerWidth * devicePixelRatio, window.innerHeight * devicePixelRatio, { backgroundColor: 0x1099bb, autoResize:true});
            this.app = new PIXI.Application(window.innerWidth, window.innerHeight, { backgroundColor: 0x1099bb, autoResize: true });
            console.log(devicePixelRatio, window.devicePixelRatio);
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
            // PIXI.settings.RESOLUTION = devicePixelRatio;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Db25zdGFudHMudHMiLCJzcmMvTWFpbi50cyIsInNyYy9lZmZlY3QvQnV0dG9uSG92ZXJFZmZlY3QudHMiLCJzcmMvdmlldy9CdXR0b24udHMiLCJzcmMvdmlldy9Mb2FkaW5nVmlldy50cyIsInNyYy92aWV3L1JlZWxWaWV3LnRzIiwic3JjL3ZpZXcvV2hlZWxWaWV3LnRzIiwic3JjL3ZvL1Nob3BzVk8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQU8sR0FBRyxDQUtUO0FBTEQsV0FBTyxHQUFHO0lBQ047UUFBQTtRQUdBLENBQUM7UUFGaUIsc0JBQVksR0FBRyxHQUFHLENBQUM7UUFDbkIsdUJBQWEsR0FBRyxHQUFHLENBQUM7UUFDdEMsZ0JBQUM7S0FIRCxBQUdDLElBQUE7SUFIWSxhQUFTLFlBR3JCLENBQUE7QUFDTCxDQUFDLEVBTE0sR0FBRyxLQUFILEdBQUcsUUFLVDtBQ0xELElBQU8sR0FBRyxDQXlPVDtBQXpPRCxXQUFPLEdBQUc7SUFDTjtRQVNJO1lBRUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUV4QixDQUFDO1FBRU8sdUJBQVEsR0FBaEI7WUFDSSw2Q0FBNkM7WUFDN0MsK0pBQStKO1lBQy9KLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRyxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFFekgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUNyRCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztZQUNuQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUks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TSxHQWlDekM7SUFqQ1ksY0FBUyxZQWlDckIsQ0FBQTtBQUNMLENBQUMsRUFuQ00sSUFBSSxLQUFKLElBQUksUUFtQ1Y7QUNuQ0QsSUFBTyxFQUFFLENBS1I7QUFMRCxXQUFPLEVBQUU7SUFDTDtRQUFBO1FBR0EsQ0FBQztRQUFELGNBQUM7SUFBRCxDQUhBLEFBR0MsSUFBQTtJQUhZLFVBQU8sVUFHbkIsQ0FBQTtBQUNMLENBQUMsRUFMTSxFQUFFLEtBQUYsRUFBRSxRQUtSIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgQXBwIHtcbiAgICBleHBvcnQgY2xhc3MgQ29uc3RhbnRzIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBTWU1CT0xfV0lEVEggPSAyMDA7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgU1lNQk9MX0hFSUdIVCA9IDEwMDtcbiAgICB9XG59IiwibW9kdWxlIEFwcCB7XG4gICAgZXhwb3J0IGNsYXNzIE1haW4ge1xuXG4gICAgICAgIHByaXZhdGUgYXBwOiBQSVhJLkFwcGxpY2F0aW9uO1xuXG4gICAgICAgIHByaXZhdGUgcmVlbFZpZXc6IHZpZXcuUmVlbFZpZXc7XG4gICAgICAgIHByaXZhdGUgZ29vZFJlZWxWaWV3OiB2aWV3LlJlZWxWaWV3O1xuICAgICAgICBwcml2YXRlIHNwaW5CdG46IFBJWEkuRGlzcGxheU9iamVjdDtcbiAgICAgICAgZmlsdGVyOiBhbnlbXTtcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICAgICAgdGhpcy5pbml0UElYSSgpO1xuICAgICAgICAgICAgdGhpcy5zdGFydExvYWRpbmcoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBpbml0UElYSSgpIHtcbiAgICAgICAgICAgIC8vIFBJWEkuc2V0dGluZ3MuUFJFQ0lTSU9OX0ZSQUdNRU5UID0gXCJoaWdocFwiXG4gICAgICAgICAgICAvLyB0aGlzLmFwcCA9IG5ldyBQSVhJLkFwcGxpY2F0aW9uKHdpbmRvdy5pbm5lcldpZHRoICogZGV2aWNlUGl4ZWxSYXRpbywgd2luZG93LmlubmVySGVpZ2h0ICogZGV2aWNlUGl4ZWxSYXRpbywgeyBiYWNrZ3JvdW5kQ29sb3I6IDB4MTA5OWJiLCBhdXRvUmVzaXplOnRydWV9KTtcbiAgICAgICAgICAgIHRoaXMuYXBwID0gbmV3IFBJWEkuQXBwbGljYXRpb24od2luZG93LmlubmVyV2lkdGggLCB3aW5kb3cuaW5uZXJIZWlnaHQgLCB7IGJhY2tncm91bmRDb2xvcjogMHgxMDk5YmIsIGF1dG9SZXNpemU6dHJ1ZSB9KTtcblxuICAgICAgICAgICAgY29uc29sZS5sb2coZGV2aWNlUGl4ZWxSYXRpbyx3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbylcbiAgICAgICAgICAgIHRoaXMuYXBwLnZpZXcuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgICAgICAgIHRoaXMuYXBwLnZpZXcuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5hcHAudmlldyk7XG4gICAgICAgICAgICBpZiAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLm9uUmVzaXplLmJpbmQodGhpcyksIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgb25SZXNpemUoKSB7XG4gICAgICAgICAgICAvLyB0aGlzLmFwcC5yZW5kZXJlci5yZXNpemUod2luZG93LmlubmVyV2lkdGggKiBkZXZpY2VQaXhlbFJhdGlvLCB3aW5kb3cuaW5uZXJIZWlnaHQgKiBkZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgICAgICAgIHRoaXMuYXBwLnJlbmRlcmVyLnJlc2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCAsIHdpbmRvdy5pbm5lckhlaWdodCApO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5hcHAuc2NyZWVuLndpZHRoIDwgMi41ICogQXBwLkNvbnN0YW50cy5TWU1CT0xfV0lEVEgpIHtcbiAgICAgICAgICAgICAgICAvLyDliIfnm7RcbiAgICAgICAgICAgICAgICB0aGlzLnJlZWxWaWV3LnggPSB0aGlzLmFwcC5zY3JlZW4ud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgIHRoaXMucmVlbFZpZXcueSA9IHRoaXMuYXBwLnNjcmVlbi5oZWlnaHQgLyAyIC0gMjAwO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcueCA9IHRoaXMuYXBwLnNjcmVlbi53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcueSA9IHRoaXMuYXBwLnNjcmVlbi5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyDliIfmqatcbiAgICAgICAgICAgICAgICB0aGlzLnJlZWxWaWV3LnggPSB0aGlzLmFwcC5zY3JlZW4ud2lkdGggLyAyIC0gMTI1O1xuICAgICAgICAgICAgICAgIHRoaXMucmVlbFZpZXcueSA9IHRoaXMuYXBwLnNjcmVlbi5oZWlnaHQgLyAyO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcueCA9IHRoaXMuYXBwLnNjcmVlbi53aWR0aCAvIDIgKyAxMjU7XG4gICAgICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcueSA9IHRoaXMuYXBwLnNjcmVlbi5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNwaW5CdG4ueCA9IHRoaXMuYXBwLnNjcmVlbi53aWR0aCAvIDI7XG4gICAgICAgICAgICB0aGlzLnNwaW5CdG4ueSA9IHRoaXMuZ29vZFJlZWxWaWV3LnkgKyBBcHAuQ29uc3RhbnRzLlNZTUJPTF9IRUlHSFQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydExvYWRpbmcoKTogYW55IHtcbiAgICAgICAgICAgIGxldCBsb2FkaW5nVmlldyA9IG5ldyB2aWV3LkxvYWRpbmdWaWV3KCk7XG4gICAgICAgICAgICBsb2FkaW5nVmlldy54ID0gdGhpcy5hcHAuc2NyZWVuLndpZHRoIC8gMjtcbiAgICAgICAgICAgIGxvYWRpbmdWaWV3LnkgPSB0aGlzLmFwcC5zY3JlZW4uaGVpZ2h0IC8gMjtcblxuICAgICAgICAgICAgdGhpcy5hcHAuc3RhZ2UuYWRkQ2hpbGQobG9hZGluZ1ZpZXcpO1xuXG4gICAgICAgICAgICBQSVhJLmxvYWRlclxuICAgICAgICAgICAgICAgIC5vbihcInByb2dyZXNzXCIsIChsb2FkZXI6IFBJWEkubG9hZGVycy5Mb2FkZXIsIHJlc291cmNlOiBQSVhJLmxvYWRlcnMuUmVzb3VyY2UpID0+IHsgbG9hZGluZ1ZpZXcudXBkYXRlUHJvZ3Jlc3MobG9hZGVyLnByb2dyZXNzKSB9KVxuICAgICAgICAgICAgICAgIC5hZGQoXCJzaG9wc1wiLCBcInJlc291cmNlL3Nob3BzLmpzb25cIilcbiAgICAgICAgICAgICAgICAubG9hZCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmdWaWV3LnBhcmVudC5yZW1vdmVDaGlsZChsb2FkaW5nVmlldyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Mb2FkZWQoKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgb25Mb2FkZWQoKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRSZWVsVmlldyhQSVhJLmxvYWRlci5yZXNvdXJjZXMuc2hvcHMuZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmluaXRTcGluQnV0dG9uKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRLZXlib2FyZEV2ZW50KCk7XG5cbiAgICAgICAgICAgIHRoaXMub25SZXNpemUoKTtcblxuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICBpbml0UmVlbFZpZXcoc2hvcHM6IHZvLlNob3BzVk8pIHtcbiAgICAgICAgICAgIC8vIFBJWEkuc2V0dGluZ3MuUkVTT0xVVElPTiA9IGRldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzaG9wcyk7XG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBuZXcgUElYSS5UZXh0U3R5bGUoe1xuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdBcmlhbCcsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDM2LFxuICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogJ2l0YWxpYycsXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ2JvbGQnLFxuICAgICAgICAgICAgICAgIGZpbGw6IFsnI2ZmZmZmZicsICcjMDBmZjk5J10sIC8vIGdyYWRpZW50XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiAnIzRhMTg1MCcsXG4gICAgICAgICAgICAgICAgc3Ryb2tlVGhpY2tuZXNzOiA1LFxuICAgICAgICAgICAgICAgIGRyb3BTaGFkb3c6IHRydWUsXG4gICAgICAgICAgICAgICAgZHJvcFNoYWRvd0NvbG9yOiAnIzAwMDAwMCcsXG4gICAgICAgICAgICAgICAgZHJvcFNoYWRvd0JsdXI6IDQsXG4gICAgICAgICAgICAgICAgZHJvcFNoYWRvd0FuZ2xlOiBNYXRoLlBJIC8gNixcbiAgICAgICAgICAgICAgICBkcm9wU2hhZG93RGlzdGFuY2U6IDYsXG4gICAgICAgICAgICAgICAgd29yZFdyYXA6IHRydWUsXG4gICAgICAgICAgICAgICAgd29yZFdyYXBXaWR0aDogNDQwXG4gICAgICAgICAgICB9KTtcblxuXG4gICAgICAgICAgICBsZXQgcmVlbCA9IG5ldyB2aWV3LlJlZWxWaWV3KHNob3BzLm5vcm1hbCk7XG5cbiAgICAgICAgICAgIGxldCB0ZXh0MSA9IG5ldyBQSVhJLlRleHQoXCLmma7pgJpcIixzdHlsZSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gdGV4dDEucmVzb2x1dGlvbiA9IGRldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICB0ZXh0MS5kaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGB0ZXh0IHJlc29sdXRpb24gPSAke3RleHQxLnJlc29sdXRpb259LCBidXQgd2luZG93IGlzICR7ZGV2aWNlUGl4ZWxSYXRpb30sIHNldHRpbmcgaXMgJHtQSVhJLnNldHRpbmdzLlJFU09MVVRJT059YClcbiAgICAgICAgICAgIHRleHQxLmFuY2hvci5zZXQoMC41KTtcbiAgICAgICAgICAgIHRleHQxLnkgPSAtNzU7XG4gICAgICAgICAgICByZWVsLmFkZENoaWxkKHRleHQxKTtcblxuICAgICAgICAgICAgdGhpcy5hcHAuc3RhZ2UuYWRkQ2hpbGQocmVlbCk7XG4gICAgICAgICAgICB0aGlzLnJlZWxWaWV3ID0gcmVlbDtcblxuICAgICAgICAgICAgLy8g6ICB6ZeG55qEXG4gICAgICAgICAgICBsZXQgcmVlbDIgPSBuZXcgdmlldy5SZWVsVmlldyhzaG9wcy5nb29kKTtcbiAgICAgICAgICAgIGxldCB0ZXh0MiA9IG5ldyBQSVhJLlRleHQoXCLniL1cIixzdHlsZSlcbiAgICAgICAgICAgIHRleHQyLmFuY2hvci5zZXQoMC41KTtcbiAgICAgICAgICAgIHRleHQyLnkgPSAtNzU7XG4gICAgICAgICAgICByZWVsMi5hZGRDaGlsZCh0ZXh0Mik7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwLnN0YWdlLmFkZENoaWxkKHJlZWwyKTtcbiAgICAgICAgICAgIHRoaXMuZ29vZFJlZWxWaWV3ID0gcmVlbDI7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0U3BpbkJ1dHRvbigpIHtcbiAgICAgICAgICAgIGxldCBidG4gPSBuZXcgdmlldy5CdXR0b24oXCLplovlp4tcIik7XG4gICAgICAgICAgICBidG4uYW5jaG9yLnNldCgwLjUpO1xuICAgICAgICAgICAgYnRuLnggPSB0aGlzLnJlZWxWaWV3Lng7XG4gICAgICAgICAgICBidG4ueSA9IHRoaXMucmVlbFZpZXcueSArIEFwcC5Db25zdGFudHMuU1lNQk9MX0hFSUdIVDtcbiAgICAgICAgICAgIGJ0bi5idXR0b25XaWR0aCA9IEFwcC5Db25zdGFudHMuU1lNQk9MX1dJRFRIO1xuICAgICAgICAgICAgYnRuLmJ1dHRvbkhlaWdodCA9IDU1O1xuICAgICAgICAgICAgLy8gYnRuLnggPSB0aGlzLmFwcC5zY3JlZW4ud2lkdGggLSA2NDtcbiAgICAgICAgICAgIC8vIGJ0bi55ID0gdGhpcy5hcHAuc2NyZWVuLmhlaWdodCAtIDQ4O1xuICAgICAgICAgICAgYnRuLmludGVyYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIGJ0bi5vbigncG9pbnRlcnVwJywgdGhpcy5zcGluLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICB0aGlzLnNwaW5CdG4gPSBidG47XG5cbiAgICAgICAgICAgIHRoaXMuYXBwLnN0YWdlLmFkZENoaWxkKGJ0bik7XG5cblxuICAgICAgICAgICAgLy8gbGV0IHRlc3RCdG4gPSBuZXcgdmlldy5CdXR0b24oKTtcbiAgICAgICAgICAgIC8vIHRlc3RCdG4uYnV0dG9uV2lkdGggPSBBcHAuQ29uc3RhbnRzLlNZTUJPTF9XSURUSDtcbiAgICAgICAgICAgIC8vIHRlc3RCdG4uYnV0dG9uSGVpZ2h0ID0gNzU7XG4gICAgICAgICAgICAvLyAvLyB0ZXN0QnRuLnJlZHJhdygpO1xuXG4gICAgICAgICAgICAvLyB0ZXN0QnRuLnggPSB0aGlzLnJlZWxWaWV3Lng7XG4gICAgICAgICAgICAvLyB0ZXN0QnRuLnkgPSB0aGlzLnJlZWxWaWV3LnkgKyBBcHAuQ29uc3RhbnRzLlNZTUJPTF9IRUlHSFQgKjI7XG4gICAgICAgICAgICAvLyB0aGlzLmFwcC5zdGFnZS5hZGRDaGlsZCh0ZXN0QnRuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNwaW4oKSB7XG4gICAgICAgICAgICB0aGlzLnJlZWxWaWV3Lm9uU3BpbigpO1xuICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcub25TcGluKCk7XG5cbiAgICAgICAgICAgIHRoaXMucmVlbFZpZXcuZmlsdGVycyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmdvb2RSZWVsVmlldy5maWx0ZXJzID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gbGV0IG91dGxpbmVGaWx0ZXIgPSBbdGhpcy5maWx0ZXIgfHwgbmV3IFBJWEkuZmlsdGVycy5PdXRsaW5lRmlsdGVyKDUsIDB4ZmYwMDAwKV07XG4gICAgICAgICAgICBsZXQgb3V0bGluZUZpbHRlciA9IHRoaXMuZmlsdGVyIHx8IFtuZXcgUElYSS5maWx0ZXJzLkdsb3dGaWx0ZXIoMTUpXTtcbiAgICAgICAgICAgIC8vIGxldCBvdXRsaW5lRmlsdGVyID0gdGhpcy5maWx0ZXIgfHwgW25ldyBQSVhJLmZpbHRlcnMuVHdpc3RGaWx0ZXIoMTUpXTtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyID0gb3V0bGluZUZpbHRlcjtcblxuICAgICAgICAgICAgbGV0IG9iaiA9IHsgdmFyOiAwIH07XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8ob2JqLCA1LCB7IHZhcjogTWF0aC5yYW5kb20oKSAqIDIgKyAxNSwgb25VcGRhdGU6IHRoaXMuY2hhbmdlT3V0bGluZUZpbHRlciwgb25VcGRhdGVQYXJhbXM6IFtvYmosIG91dGxpbmVGaWx0ZXJdLCBvblVwZGF0ZVNjb3BlOiB0aGlzLCBlYXNlOiBRdWFkLmVhc2VJbk91dCB9KTtcblxuXG4gICAgICAgICAgICAvLyB0aGlzLmFwcC5zdGFnZS5maWx0ZXJzID0gW25ldyBQSVhJLmZpbHRlcnMuVHdpc3RGaWx0ZXIoNTAwLDQpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGluaXRLZXlib2FyZEV2ZW50KCl7XG4gICAgICAgICAgICBsZXQgc3BhY2UgPSB0aGlzLmtleWJvYXJkKDMyKTtcbiAgICAgICAgICAgIHNwYWNlLnByZXNzID0gdGhpcy5zcGluLmJpbmQodGhpcyk7XG5cbiAgICAgICAgICAgIGxldCBlbnRlciA9IHRoaXMua2V5Ym9hcmQoMTMpO1xuICAgICAgICAgICAgZW50ZXIucHJlc3MgPSB0aGlzLnNwaW4uYmluZCh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoYW5nZU91dGxpbmVGaWx0ZXIob2JqOiB7IHZhcjogbnVtYmVyIH0sIGZpbHRlcikge1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gTWF0aC5yb3VuZChvYmoudmFyKSAlIDI7XG5cbiAgICAgICAgICAgIGlmIChpbmRleCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVlbFZpZXcuZmlsdGVycyA9IGZpbHRlcjtcbiAgICAgICAgICAgICAgICB0aGlzLmdvb2RSZWVsVmlldy5maWx0ZXJzID0gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWVsVmlldy5maWx0ZXJzID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLmdvb2RSZWVsVmlldy5maWx0ZXJzID0gZmlsdGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAga2V5Ym9hcmQoa2V5Q29kZSkge1xuICAgICAgICAgICAgbGV0IGtleSA6YW55ID0ge307XG4gICAgICAgICAgICBrZXkuY29kZSA9IGtleUNvZGU7XG4gICAgICAgICAgICBrZXkuaXNEb3duID0gZmFsc2U7XG4gICAgICAgICAgICBrZXkuaXNVcCA9IHRydWU7XG4gICAgICAgICAgICBrZXkucHJlc3MgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBrZXkucmVsZWFzZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIC8vVGhlIGBkb3duSGFuZGxlcmBcbiAgICAgICAgICAgIGtleS5kb3duSGFuZGxlciA9IGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IGtleS5jb2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleS5pc1VwICYmIGtleS5wcmVzcykga2V5LnByZXNzKCk7XG4gICAgICAgICAgICAgICAga2V5LmlzRG93biA9IHRydWU7XG4gICAgICAgICAgICAgICAga2V5LmlzVXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICBcbiAgICAgICAgICAgIC8vVGhlIGB1cEhhbmRsZXJgXG4gICAgICAgICAgICBrZXkudXBIYW5kbGVyID0gZXZlbnQgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0ga2V5LmNvZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5LmlzRG93biAmJiBrZXkucmVsZWFzZSkga2V5LnJlbGVhc2UoKTtcbiAgICAgICAgICAgICAgICBrZXkuaXNEb3duID0gZmFsc2U7XG4gICAgICAgICAgICAgICAga2V5LmlzVXAgPSB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIFxuICAgICAgICAgICAgLy9BdHRhY2ggZXZlbnQgbGlzdGVuZXJzXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgXCJrZXlkb3duXCIsIGtleS5kb3duSGFuZGxlci5iaW5kKGtleSksIGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgIFwia2V5dXBcIiwga2V5LnVwSGFuZGxlci5iaW5kKGtleSksIGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIHZpZXcge1xuICAgIGV4cG9ydCBlbnVtIEhvdmVyVHlwZSB7XG4gICAgICAgIHR5cGUxXG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIEJ1dHRvbkhvdmVyRWZmZWN0IHtcblxuICAgICAgICBwdWJsaWMgc3RhdGljIG9uSG92ZXIodHlwZTogSG92ZXJUeXBlLCB0d2Vlbk9iajogUElYSS5EaXNwbGF5T2JqZWN0LCBpc092ZXJJbjogYm9vbGVhbikge1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIEhvdmVyVHlwZS50eXBlMTpcbiAgICAgICAgICAgICAgICAgICAgQnV0dG9uSG92ZXJFZmZlY3QuYWxwaGFWaXNpYmxlKHR3ZWVuT2JqLCBpc092ZXJJbik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgYWxwaGFWaXNpYmxlKHR3ZWVuT2JqOiBQSVhJLkRpc3BsYXlPYmplY3QsIGlzT3ZlckluOiBib29sZWFuKSB7XG4gICAgICAgICAgICBsZXQgc2VjID0gMC41O1xuICAgICAgICAgICAgVHdlZW5MaXRlLmtpbGxUd2VlbnNPZih0d2Vlbk9iaik7XG5cbiAgICAgICAgICAgIGlmIChpc092ZXJJbikge1xuICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0d2Vlbk9iaiwgc2VjLCB7IGFscGhhOiAxIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBUd2VlbkxpdGUudG8odHdlZW5PYmosIHNlYywgeyBhbHBoYTogMCwgb25Db21wbGV0ZTogKCkgPT4geyB0d2Vlbk9iai52aXNpYmxlID0gZmFsc2UgfSB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9XG59IiwibW9kdWxlIHZpZXcge1xuXG4gICAgZXhwb3J0IGNsYXNzIEJ1dHRvbiBleHRlbmRzIFBJWEkuU3ByaXRlIHtcblxuICAgICAgICBob3ZlclR5cGU6IEhvdmVyVHlwZSA9IEhvdmVyVHlwZS50eXBlMTtcblxuXG4gICAgICAgIGZyYW1lQ29sb3IgPSAweGZmZmZmZjtcbiAgICAgICAgYmdDb2xvciA9IDB4MDAxMWZmO1xuICAgICAgICBiZ0NvbG9yT25DbGljayA9IDB4MzNhYWFhO1xuXG4gICAgICAgIGxhYmVsOiBQSVhJLlRleHQ7XG4gICAgICAgIHByaXZhdGUgYmdWaWV3OiBQSVhJLkdyYXBoaWNzO1xuXG4gICAgICAgIHByaXZhdGUgX2J1dHRvbldpZHRoOiBudW1iZXI7XG4gICAgICAgIHByaXZhdGUgX2J1dHRvbkhlaWdodDogbnVtYmVyO1xuXG4gICAgICAgIHByaXZhdGUgZWZmZWN0OiBQSVhJLlNwcml0ZTtcblxuICAgICAgICBjb25zdHJ1Y3Rvcih0ZXh0ID0gXCJCdXR0b25cIikge1xuICAgICAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICAgICAgdGhpcy5iZ1ZpZXcgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuXG4gICAgICAgICAgICB0aGlzLmVmZmVjdCA9IG5ldyBQSVhJLlNwcml0ZShQSVhJLlRleHR1cmUuV0hJVEUpO1xuICAgICAgICAgICAgdGhpcy5lZmZlY3QuYW5jaG9yLnNldCgwLjUpO1xuICAgICAgICAgICAgdGhpcy5lZmZlY3QudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5lZmZlY3QuYWxwaGEgPSAwO1xuXG4gICAgICAgICAgICB0aGlzLmxhYmVsID0gbmV3IFBJWEkuVGV4dCh0ZXh0LCB7IGZpbGw6IHRoaXMuZnJhbWVDb2xvciB9KTtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuYW5jaG9yLnNldCgwLjUpO1xuXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuYmdWaWV3LCB0aGlzLmVmZmVjdCwgdGhpcy5sYWJlbCk7XG5cbiAgICAgICAgICAgIHRoaXMuZHJhd05vcm1hbFN5dGxlKCk7XG5cbiAgICAgICAgICAgIC8vIHNldCBpbnRlcmFjdGl2ZVxuICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbk1vZGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5vbihcInBvaW50ZXJvdmVyXCIsIHRoaXMub25CdXR0b25PdmVyKTtcbiAgICAgICAgICAgIHRoaXMub24oXCJwb2ludGVyb3V0XCIsIHRoaXMub25CdXR0b25PdXQpO1xuICAgICAgICAgICAgdGhpcy5vbihcInBvaW50ZXJkb3duXCIsKCk9Pnt0aGlzLmVmZmVjdC50aW50ID0gdGhpcy5iZ0NvbG9yT25DbGlja30pO1xuICAgICAgICAgICAgdGhpcy5vbihcInBvaW50ZXJ1cFwiLCgpPT57dGhpcy5lZmZlY3QudGludCA9IHRoaXMuZnJhbWVDb2xvcn0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZHJhd05vcm1hbFN5dGxlKCkge1xuICAgICAgICAgICAgLy8gbGV0IHdpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgICAgIC8vIGxldCBoZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgICAgIGxldCBwYWRkaW5nID0gMTA7XG4gICAgICAgICAgICBsZXQgd2lkdGggPSB0aGlzLl9idXR0b25XaWR0aCB8fCB0aGlzLmxhYmVsLndpZHRoICsgcGFkZGluZztcbiAgICAgICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLl9idXR0b25IZWlnaHQgfHwgdGhpcy5sYWJlbC5oZWlnaHQgKyBwYWRkaW5nO1xuXG4gICAgICAgICAgICAvLyBsZXQgc3RhcnRYID0gIC13aWR0aCAqIDAuNTtcbiAgICAgICAgICAgIC8vIGxldCBzdGFydFkgPSAtaGVpZ2h0ICogMC41O1xuICAgICAgICAgICAgbGV0IHN0YXJ0WCA9IC13aWR0aCAqIDAuNTtcbiAgICAgICAgICAgIGxldCBzdGFydFkgPSAtaGVpZ2h0ICogMC41O1xuXG4gICAgICAgICAgICBsZXQgZ3JhcGggPSB0aGlzLmJnVmlldztcbiAgICAgICAgICAgIGdyYXBoLmNsZWFyKCk7XG4gICAgICAgICAgICBncmFwaC5iZWdpbkZpbGwodGhpcy5iZ0NvbG9yKTtcbiAgICAgICAgICAgIC8vIGdyYXBoLmRyYXdSZWN0KHN0YXJ0WCxzdGFydFksd2lkdGgsaGVpZ2h0KTtcbiAgICAgICAgICAgIC8vIGdyYXBoLmVuZEZpbGwoKTtcblxuICAgICAgICAgICAgZ3JhcGgubGluZVN0eWxlKDUsIHRoaXMuZnJhbWVDb2xvcik7XG5cbiAgICAgICAgICAgIGdyYXBoLm1vdmVUbyhzdGFydFgsIHN0YXJ0WSk7XG4gICAgICAgICAgICBncmFwaC5saW5lVG8oc3RhcnRYICsgd2lkdGgsIHN0YXJ0WSk7XG4gICAgICAgICAgICBncmFwaC5saW5lVG8oc3RhcnRYICsgd2lkdGgsIHN0YXJ0WSArIGhlaWdodCk7XG4gICAgICAgICAgICBncmFwaC5saW5lVG8oc3RhcnRYLCBzdGFydFkgKyBoZWlnaHQpO1xuICAgICAgICAgICAgZ3JhcGgubGluZVRvKHN0YXJ0WCwgc3RhcnRZKTtcblxuICAgICAgICAgICAgZ3JhcGguZW5kRmlsbCgpO1xuXG5cbiAgICAgICAgfVxuXG4gICAgICAgIHNldCBidXR0b25XaWR0aCh3aWR0aDogbnVtYmVyKSB7XG4gICAgICAgICAgICB0aGlzLl9idXR0b25XaWR0aCA9IE1hdGgubWF4KHdpZHRoLCB0aGlzLmxhYmVsLndpZHRoKTtcbiAgICAgICAgICAgIHRoaXMucmVkcmF3KCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgYnV0dG9uSGVpZ2h0KGhlaWdodDogbnVtYmVyKSB7XG4gICAgICAgICAgICB0aGlzLl9idXR0b25IZWlnaHQgPSBNYXRoLm1heChoZWlnaHQsIHRoaXMubGFiZWwuaGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMucmVkcmF3KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZWRyYXcoKSB7XG4gICAgICAgICAgICB0aGlzLmRyYXdOb3JtYWxTeXRsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgb25CdXR0b25PdmVyKCkge1xuICAgICAgICAgICAgdGhpcy5lZmZlY3Qud2lkdGggPSB0aGlzLl9idXR0b25XaWR0aDtcbiAgICAgICAgICAgIHRoaXMuZWZmZWN0LmhlaWdodCA9IHRoaXMuX2J1dHRvbkhlaWdodDtcblxuICAgICAgICAgICAgdGhpcy5lZmZlY3QudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmVmZmVjdC50aW50ID0gdGhpcy5mcmFtZUNvbG9yO1xuXG5cbiAgICAgICAgICAgIEJ1dHRvbkhvdmVyRWZmZWN0Lm9uSG92ZXIodGhpcy5ob3ZlclR5cGUsdGhpcy5lZmZlY3QsdHJ1ZSk7XG5cbiAgICAgICAgICAgIHRoaXMubGFiZWwuc3R5bGUuZmlsbCA9IHRoaXMuYmdDb2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIG9uQnV0dG9uT3V0KCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBCdXR0b25Ib3ZlckVmZmVjdC5vbkhvdmVyKHRoaXMuaG92ZXJUeXBlLHRoaXMuZWZmZWN0LGZhbHNlKTtcblxuICAgICAgICAgICAgdGhpcy5sYWJlbC5zdHlsZS5maWxsID0gdGhpcy5mcmFtZUNvbG9yO1xuICAgICAgICB9XG4gICAgfVxufSIsIm1vZHVsZSB2aWV3IHtcbiAgICBleHBvcnQgY2xhc3MgTG9hZGluZ1ZpZXcgZXh0ZW5kcyBQSVhJLkdyYXBoaWNzIHtcblxuICAgICAgICBwcml2YXRlIHByb2dyZXNzOiBudW1iZXIgPSAwO1xuICAgICAgICBjb2xvcjogbnVtYmVyID0gMHhhYWJjMTNcblxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgdXBkYXRlUHJvZ3Jlc3MocDogbnVtYmVyKSB7XG4gICAgICAgICAgICBsZXQgcGVyY2VudCA9IHA7XG4gICAgICAgICAgICB0aGlzLnByb2dyZXNzID0gcGVyY2VudDtcblxuICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICAgICAgdGhpcy5saW5lU3R5bGUoMTAsIHRoaXMuY29sb3IpO1xuICAgICAgICAgICAgLy8gdGhpcy5kcmF3Q2lyY2xlKDAsIDAsIDIgKiBNYXRoLlBJICogcGVyY2VudCk7XG4gICAgICAgICAgICB0aGlzLmFyYygwLCAwLCA1MCwgMCwgMiAqIE1hdGguUEkgKiBwZXJjZW50KTtcbiAgICAgICAgICAgIHRoaXMuZW5kRmlsbCgpO1xuICAgICAgICB9XG5cbiAgICB9XG59XG4iLCJtb2R1bGUgdmlldyB7XG4gICAgZXhwb3J0IGNsYXNzIFJlZWxWaWV3IGV4dGVuZHMgUElYSS5TcHJpdGUge1xuXG4gICAgICAgIHByaXZhdGUgZnJhbWU6IFBJWEkuR3JhcGhpY3M7XG4gICAgICAgIHByaXZhdGUgd2hlZWw6IHZpZXcuV2hlZWxWaWV3O1xuICAgICAgICBwcml2YXRlIHNob3BzOiBzdHJpbmdbXTtcblxuICAgICAgICBwcml2YXRlIHRlbXBJZHM6IG51bWJlcltdID0gWzAsIDEsIDJdO1xuICAgICAgICBzcGluaW5nOiBib29sZWFuO1xuICAgICAgICAvLyBwcml2YXRlIF9tYXNrOiBQSVhJLkRpc3BsYXlPYmplY3Q7XG5cbiAgICAgICAgY29uc3RydWN0b3Ioc2hvcHM6IHN0cmluZ1tdKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuICAgICAgICAgICAgdGhpcy5zaG9wcyA9IHNob3BzO1xuXG4gICAgICAgICAgICBsZXQgd2lkdGggPSBBcHAuQ29uc3RhbnRzLlNZTUJPTF9XSURUSDtcbiAgICAgICAgICAgIGxldCBoZWlnaHQgPSBBcHAuQ29uc3RhbnRzLlNZTUJPTF9IRUlHSFQ7XG5cbiAgICAgICAgICAgIHRoaXMuZnJhbWUgPSBuZXcgUElYSS5HcmFwaGljcygpO1xuICAgICAgICAgICAgdGhpcy5mcmFtZS5saW5lU3R5bGUoMTAsIDB4MDAwMDAwKTtcbiAgICAgICAgICAgIHRoaXMuZnJhbWUuZHJhd1JlY3QoLXdpZHRoICogMC41LCAtaGVpZ2h0ICogMC41LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICAgIHRoaXMuZnJhbWUuZW5kRmlsbCgpO1xuXG4gICAgICAgICAgICAvLyBtYXNrXG4gICAgICAgICAgICBsZXQgbWFzayA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gICAgICAgICAgICBtYXNrLmJlZ2luRmlsbCgweEZGRkZGRik7XG4gICAgICAgICAgICBtYXNrLmRyYXdSZWN0KC13aWR0aCAqIDAuNSwgLWhlaWdodCAqIDAuNSwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICBtYXNrLmVuZEZpbGwoKTtcblxuXG4gICAgICAgICAgICAvLyB3aGVlbFxuICAgICAgICAgICAgbGV0IHdoZWVsID0gbmV3IHZpZXcuV2hlZWxWaWV3KHNob3BzKTtcbiAgICAgICAgICAgIHdoZWVsLm1hc2sgPSBtYXNrO1xuICAgICAgICAgICAgd2hlZWwuc2V0SWRzKHRoaXMudGVtcElkcyk7XG4gICAgICAgICAgICB0aGlzLndoZWVsID0gd2hlZWw7XG5cblxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh3aGVlbCwgbWFzaywgdGhpcy5mcmFtZSk7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2hvcCh0aGlzLnRlbXBJZHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdXBkYXRlU2hvcChzaG9wSWQ6IG51bWJlcltdKSB7XG4gICAgICAgICAgICB0aGlzLndoZWVsLnNldElkcyhzaG9wSWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgb25TcGluKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BpbmluZykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3BpbmluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIGxldCBkYW1waW5nU3RhcnRTZWMgPSAwLjU7XG4gICAgICAgICAgICBUd2Vlbk1heC50byh0aGlzLndoZWVsLnBvc2l0aW9uLCBkYW1waW5nU3RhcnRTZWMsIHsgeTogLTQwLCB5b3lvOiB0cnVlLCByZXBlYXQ6IDEgfSk7XG4gICAgICAgICAgICBUd2Vlbk1heC5mcm9tVG8odGhpcy53aGVlbC5wb3NpdGlvbiwgMC4yLCB7IHk6IDAgfSwgeyBkZWxheTogZGFtcGluZ1N0YXJ0U2VjICogMiwgeTogQXBwLkNvbnN0YW50cy5TWU1CT0xfSEVJR0hULCByZXBlYXQ6IDEwLCBlYXNlOiBMaW5lYXIuZWFzZU5vbmUsIG9uUmVwZWF0OiB0aGlzLnN3YXBJZCwgb25SZXBlYXRTY29wZTogdGhpcywgb25Db21wbGV0ZTogdGhpcy5vblNwaW5Db21wbGV0ZSwgb25Db21wbGV0ZVNjb3BlOiB0aGlzIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICByYW5kb21JZCgpOiBudW1iZXIge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuc2hvcHMubGVuZ3RoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3YXBJZCgpIHtcbiAgICAgICAgICAgIHRoaXMudGVtcElkcy51bnNoaWZ0KHRoaXMucmFuZG9tSWQoKSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNob3AodGhpcy50ZW1wSWRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9uU3BpbkNvbXBsZXRlKCkge1xuXG4gICAgICAgICAgICB0aGlzLnNwaW5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMudGVtcElkcy51bnNoaWZ0KHRoaXMucmFuZG9tSWQoKSk7XG4gICAgICAgICAgICB0aGlzLnRlbXBJZHMudW5zaGlmdCh0aGlzLnJhbmRvbUlkKCkpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTaG9wKHRoaXMudGVtcElkcyk7XG5cbiAgICAgICAgICAgIFR3ZWVuTGl0ZS5mcm9tVG8odGhpcy53aGVlbC5wb3NpdGlvbiwgMSwgeyB5OiAtQXBwLkNvbnN0YW50cy5TWU1CT0xfSEVJR0hUIH0sIHsgeTogMCwgZWFzZTogQmFjay5lYXNlT3V0IH0pO1xuICAgICAgICB9XG4gICAgfVxufSIsIm1vZHVsZSB2aWV3IHtcbiAgICBleHBvcnQgY2xhc3MgV2hlZWxWaWV3IGV4dGVuZHMgUElYSS5TcHJpdGUge1xuXG4gICAgICAgIHByaXZhdGUgc2hvcHM6IHN0cmluZ1tdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHNob3BzOiBzdHJpbmdbXSkge1xuICAgICAgICAgICAgc3VwZXIoUElYSS5UZXh0dXJlLkVNUFRZKTtcbiAgICAgICAgICAgIHRoaXMuc2hvcHMgPSBzaG9wcztcblxuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBzeW1ib2xUZXh0ID0gbmV3IFBJWEkuVGV4dChcIlwiLCB7IGZpbGw6IFwiMHgwMDAwMDBcIiB9KTtcbiAgICAgICAgICAgICAgICBzeW1ib2xUZXh0LmFuY2hvci5zZXQoMC41KTtcblxuICAgICAgICAgICAgICAgIGxldCBiZyA9IG5ldyBQSVhJLlNwcml0ZShQSVhJLlRleHR1cmUuV0hJVEUpO1xuICAgICAgICAgICAgICAgIGJnLndpZHRoID0gQXBwLkNvbnN0YW50cy5TWU1CT0xfV0lEVEg7XG4gICAgICAgICAgICAgICAgYmcuaGVpZ2h0ID0gQXBwLkNvbnN0YW50cy5TWU1CT0xfSEVJR0hUO1xuICAgICAgICAgICAgICAgIGJnLmFuY2hvci5zZXQoMC41KTtcblxuICAgICAgICAgICAgICAgIGxldCBjb250YWluZXIgPSBuZXcgUElYSS5Db250YWluZXIoKTtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuYWRkQ2hpbGQoYmcsIHN5bWJvbFRleHQpO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci55ID0gKGkgLSAxKSAqIEFwcC5Db25zdGFudHMuU1lNQk9MX0hFSUdIVDtcblxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNldElkcyhpZHM6IG51bWJlcltdKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBQSVhJLkNvbnRhaW5lciwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0ZXh0VmlldyA9IGNoaWxkLmdldENoaWxkQXQoMSkgYXMgUElYSS5UZXh0O1xuICAgICAgICAgICAgICAgIHRleHRWaWV3LnRleHQgPSB0aGlzLnNob3BzW2lkc1tpXV07XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICB9XG59IiwibW9kdWxlIHZve1xuICAgIGV4cG9ydCBjbGFzcyBTaG9wc1ZPe1xuICAgICAgICBwdWJsaWMgbm9ybWFsOnN0cmluZ1tdO1xuICAgICAgICBwdWJsaWMgZ29vZDpzdHJpbmdbXTtcbiAgICB9XG59Il19
