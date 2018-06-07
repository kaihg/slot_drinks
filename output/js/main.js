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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Db25zdGFudHMudHMiLCJzcmMvTWFpbi50cyIsInNyYy9lZmZlY3QvQnV0dG9uSG92ZXJFZmZlY3QudHMiLCJzcmMvdmlldy9CdXR0b24udHMiLCJzcmMvdmlldy9Mb2FkaW5nVmlldy50cyIsInNyYy92aWV3L1JlZWxWaWV3LnRzIiwic3JjL3ZpZXcvV2hlZWxWaWV3LnRzIiwic3JjL3ZvL1Nob3BzVk8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQU8sR0FBRyxDQUtUO0FBTEQsV0FBTyxHQUFHO0lBQ047UUFBQTtRQUdBLENBQUM7UUFGaUIsc0JBQVksR0FBRyxHQUFHLENBQUM7UUFDbkIsdUJBQWEsR0FBRyxHQUFHLENBQUM7UUFDdEMsZ0JBQUM7S0FIRCxBQUdDLElBQUE7SUFIWSxhQUFTLFlBR3JCLENBQUE7QUFDTCxDQUFDLEVBTE0sR0FBRyxLQUFILEdBQUcsUUFLVDtBQ0xELElBQU8sR0FBRyxDQTRKVDtBQTVKRCxXQUFPLEdBQUc7SUFDTjtRQVNJO1lBRUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUV4QixDQUFDO1FBRU8sdUJBQVEsR0FBaEI7WUFDSSwrSUFBK0k7WUFDL0ksSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRyxNQUFNLENBQUMsV0FBVyxFQUFHLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUN6SCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztZQUNuQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUVwQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pDLElBQUksTUFBTSxDQUFDLGdCQUFnQixFQUFFO2dCQUN6QixNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ3JFO1FBQ0wsQ0FBQztRQUVELHVCQUFRLEdBQVI7WUFDSSx5R0FBeUc7WUFDekcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBRSxDQUFDO1lBRWxFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRTtnQkFDMUQsS0FBSztnQkFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFFbkQsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDaEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzthQUNwRDtpQkFBTTtnQkFDSCxLQUFLO2dCQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUNsRCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUU3QyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFDdEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzthQUNwRDtZQUVELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7UUFDdkUsQ0FBQztRQUVELDJCQUFZLEdBQVo7WUFBQSxpQkFlQztZQWRHLElBQUksV0FBVyxHQUFHLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3pDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUMxQyxXQUFXLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFFM0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRXJDLElBQUksQ0FBQyxNQUFNO2lCQUNOLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBQyxNQUEyQixFQUFFLFFBQStCLElBQU8sV0FBVyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUM7aUJBQ2pJLEdBQUcsQ0FBQyxPQUFPLEVBQUUscUJBQXFCLENBQUM7aUJBQ25DLElBQUksQ0FBQztnQkFDRixXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDNUMsS0FBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxDQUFDO1FBRVgsQ0FBQztRQUVELHVCQUFRLEdBQVI7WUFDSSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBR3BCLENBQUM7UUFFRCwyQkFBWSxHQUFaLFVBQWEsS0FBaUI7WUFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuQixJQUFJLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTNDLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUMvQixLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QixLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVyQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFFckIsTUFBTTtZQUNOLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQzlCLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDZCxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXRCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUM5QixDQUFDO1FBRUQsNkJBQWMsR0FBZDtZQUNJLElBQUksR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNwQixHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7WUFDdEQsR0FBRyxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztZQUM3QyxHQUFHLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztZQUN0QixzQ0FBc0M7WUFDdEMsdUNBQXVDO1lBQ3ZDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLEdBQUcsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFMUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7WUFFbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRzdCLG1DQUFtQztZQUNuQyxvREFBb0Q7WUFDcEQsNkJBQTZCO1lBQzdCLHVCQUF1QjtZQUV2QiwrQkFBK0I7WUFDL0IsZ0VBQWdFO1lBQ2hFLG9DQUFvQztRQUN4QyxDQUFDO1FBRUQsbUJBQUksR0FBSjtZQUNJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUUzQixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDN0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBRWpDLG9GQUFvRjtZQUNwRixJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3JFLElBQUksQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDO1lBRTVCLElBQUksR0FBRyxHQUFHLEVBQUUsS0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3JCLFNBQVMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixFQUFFLGNBQWMsRUFBRSxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUUvSyxDQUFDO1FBRUQsa0NBQW1CLEdBQW5CLFVBQW9CLEdBQW9CLEVBQUUsTUFBTTtZQUM1QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFHLENBQUEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVwQyxJQUFJLEtBQUssRUFBRTtnQkFDUCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQzthQUNwQztpQkFBTTtnQkFDSCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQzthQUN0QztRQUNMLENBQUM7UUFDTCxXQUFDO0lBQUQsQ0ExSkEsQUEwSkMsSUFBQTtJQTFKWSxRQUFJLE9BMEpoQixDQUFBO0FBQ0wsQ0FBQyxFQTVKTSxHQUFHLEtBQUgsR0FBRyxRQTRKVDtBQzVKRCxJQUFPLElBQUksQ0FnQ1Y7QUFoQ0QsV0FBTyxJQUFJO0lBQ1AsSUFBWSxTQUVYO0lBRkQsV0FBWSxTQUFTO1FBQ2pCLDJDQUFLLENBQUE7SUFDVCxDQUFDLEVBRlcsU0FBUyxHQUFULGNBQVMsS0FBVCxjQUFTLFFBRXBCO0lBRUQ7UUFBQTtRQTBCQSxDQUFDO1FBeEJpQix5QkFBTyxHQUFyQixVQUFzQixJQUFlLEVBQUUsUUFBNEIsRUFBRSxRQUFpQjtZQUVsRixRQUFRLElBQUksRUFBRTtnQkFDVixLQUFLLFNBQVMsQ0FBQyxLQUFLO29CQUNoQixpQkFBaUIsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUNuRCxNQUFNO2FBRWI7UUFFTCxDQUFDO1FBR2MsOEJBQVksR0FBM0IsVUFBNEIsUUFBNEIsRUFBRSxRQUFpQjtZQUN2RSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFDZCxTQUFTLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRWpDLElBQUksUUFBUSxFQUFFO2dCQUNWLFNBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQzdDO2lCQUFNO2dCQUNILFNBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLGNBQVEsUUFBUSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQzdGO1FBRUwsQ0FBQztRQUVMLHdCQUFDO0lBQUQsQ0ExQkEsQUEwQkMsSUFBQTtJQTFCWSxzQkFBaUIsb0JBMEI3QixDQUFBO0FBQ0wsQ0FBQyxFQWhDTSxJQUFJLEtBQUosSUFBSSxRQWdDVjtBQ2hDRCxJQUFPLElBQUksQ0E4R1Y7QUE5R0QsV0FBTyxJQUFJO0lBRVA7UUFBNEIsMEJBQVc7UUFpQm5DLGdCQUFZLElBQWU7WUFBZixxQkFBQSxFQUFBLGVBQWU7WUFBM0IsWUFDSSxpQkFBTyxTQXVCVjtZQXZDRCxlQUFTLEdBQWMsS0FBQSxTQUFTLENBQUMsS0FBSyxDQUFDO1lBR3ZDLGdCQUFVLEdBQUcsUUFBUSxDQUFDO1lBQ3RCLGFBQU8sR0FBRyxRQUFRLENBQUM7WUFDbkIsb0JBQWMsR0FBRyxRQUFRLENBQUM7WUFhdEIsS0FBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUVsQyxLQUFJLENBQUMsTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xELEtBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QixLQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDNUIsS0FBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBRXRCLEtBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxLQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztZQUM1RCxLQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFM0IsS0FBSSxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsTUFBTSxFQUFFLEtBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXBELEtBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUV2QixrQkFBa0I7WUFDbEIsS0FBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDeEIsS0FBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsS0FBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsS0FBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzFDLEtBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLEtBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN4QyxLQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBQyxjQUFLLEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLEtBQUksQ0FBQyxjQUFjLENBQUEsQ0FBQSxDQUFDLENBQUMsQ0FBQztZQUNwRSxLQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBQyxjQUFLLEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUEsQ0FBQSxDQUFDLENBQUMsQ0FBQzs7UUFDbEUsQ0FBQztRQUVELGdDQUFlLEdBQWY7WUFDSSwwQkFBMEI7WUFDMUIsNEJBQTRCO1lBQzVCLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNqQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztZQUM1RCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztZQUUvRCw4QkFBOEI7WUFDOUIsOEJBQThCO1lBQzlCLElBQUksTUFBTSxHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUMxQixJQUFJLE1BQU0sR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFFM0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUN4QixLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDZCxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM5Qiw4Q0FBOEM7WUFDOUMsbUJBQW1CO1lBRW5CLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUVwQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM3QixLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDckMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxFQUFFLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQztZQUM5QyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUM7WUFDdEMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFN0IsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBR3BCLENBQUM7UUFFRCxzQkFBSSwrQkFBVztpQkFBZixVQUFnQixLQUFhO2dCQUN6QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3RELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNsQixDQUFDOzs7V0FBQTtRQUVELHNCQUFJLGdDQUFZO2lCQUFoQixVQUFpQixNQUFjO2dCQUMzQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3pELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNsQixDQUFDOzs7V0FBQTtRQUVELHVCQUFNLEdBQU47WUFDSSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDM0IsQ0FBQztRQUVELDZCQUFZLEdBQVo7WUFDSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7WUFFeEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7WUFHbkMsS0FBQSxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBQyxJQUFJLENBQUMsTUFBTSxFQUFDLElBQUksQ0FBQyxDQUFDO1lBRTNELElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3pDLENBQUM7UUFFRCw0QkFBVyxHQUFYO1lBRUksS0FBQSxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBQyxJQUFJLENBQUMsTUFBTSxFQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTVELElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQzVDLENBQUM7UUFDTCxhQUFDO0lBQUQsQ0EzR0EsQUEyR0MsQ0EzRzJCLElBQUksQ0FBQyxNQUFNLEdBMkd0QztJQTNHWSxXQUFNLFNBMkdsQixDQUFBO0FBQ0wsQ0FBQyxFQTlHTSxJQUFJLEtBQUosSUFBSSxRQThHVjtBQzlHRCxJQUFPLElBQUksQ0FzQlY7QUF0QkQsV0FBTyxJQUFJO0lBQ1A7UUFBaUMsK0JBQWE7UUFLMUM7WUFBQSxZQUNJLGlCQUFPLFNBQ1Y7WUFMTyxjQUFRLEdBQVcsQ0FBQyxDQUFDO1lBQzdCLFdBQUssR0FBVyxRQUFRLENBQUE7O1FBSXhCLENBQUM7UUFFTSxvQ0FBYyxHQUFyQixVQUFzQixDQUFTO1lBQzNCLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztZQUNoQixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUV4QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0IsZ0RBQWdEO1lBQ2hELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQixDQUFDO1FBRUwsa0JBQUM7SUFBRCxDQXBCQSxBQW9CQyxDQXBCZ0MsSUFBSSxDQUFDLFFBQVEsR0FvQjdDO0lBcEJZLGdCQUFXLGNBb0J2QixDQUFBO0FBQ0wsQ0FBQyxFQXRCTSxJQUFJLEtBQUosSUFBSSxRQXNCVjtBQ3RCRCxJQUFPLElBQUksQ0E2RVY7QUE3RUQsV0FBTyxJQUFJO0lBQ1A7UUFBOEIsNEJBQVc7UUFRckMscUNBQXFDO1FBRXJDLGtCQUFZLEtBQWU7WUFBM0IsWUFDSSxpQkFBTyxTQTRCVjtZQWpDTyxhQUFPLEdBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBTWxDLEtBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBRW5CLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDO1lBQ3ZDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO1lBRXpDLEtBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDakMsS0FBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ25DLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2hFLEtBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFckIsT0FBTztZQUNQLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQy9CLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMxRCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFHZixRQUFRO1lBQ1IsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzNCLEtBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBR25CLEtBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFdkMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7O1FBQ2xDLENBQUM7UUFFRCw2QkFBVSxHQUFWLFVBQVcsTUFBZ0I7WUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUVELHlCQUFNLEdBQU47WUFDSSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2QsT0FBTzthQUNWO1lBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFFcEIsSUFBSSxlQUFlLEdBQUcsR0FBRyxDQUFDO1lBQzFCLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDckYsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsZUFBZSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRS9QLENBQUM7UUFFRCwyQkFBUSxHQUFSO1lBQ0ksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFFRCx5QkFBTSxHQUFOO1lBQ0ksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUVELGlDQUFjLEdBQWQ7WUFFSSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUU5QixTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUNoSCxDQUFDO1FBQ0wsZUFBQztJQUFELENBM0VBLEFBMkVDLENBM0U2QixJQUFJLENBQUMsTUFBTSxHQTJFeEM7SUEzRVksYUFBUSxXQTJFcEIsQ0FBQTtBQUNMLENBQUMsRUE3RU0sSUFBSSxLQUFKLElBQUksUUE2RVY7QUM3RUQsSUFBTyxJQUFJLENBbUNWO0FBbkNELFdBQU8sSUFBSTtJQUNQO1FBQStCLDZCQUFXO1FBSXRDLG1CQUFZLEtBQWU7WUFBM0IsWUFDSSxrQkFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQW1CNUI7WUFsQkcsS0FBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFHbkIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDeEIsSUFBSSxVQUFVLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO2dCQUN6RCxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFFM0IsSUFBSSxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzdDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUM7Z0JBQ3RDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7Z0JBQ3hDLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUVuQixJQUFJLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDckMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQ25DLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUM7Z0JBRXBELEtBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDNUI7O1FBQ0wsQ0FBQztRQUVELDBCQUFNLEdBQU4sVUFBTyxHQUFhO1lBQXBCLGlCQUtDO1lBSkcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFxQixFQUFFLENBQUM7Z0JBQzNDLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFjLENBQUM7Z0JBQ2hELFFBQVEsQ0FBQyxJQUFJLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUM7UUFFTCxnQkFBQztJQUFELENBakNBLEFBaUNDLENBakM4QixJQUFJLENBQUMsTUFBTSxHQWlDekM7SUFqQ1ksY0FBUyxZQWlDckIsQ0FBQTtBQUNMLENBQUMsRUFuQ00sSUFBSSxLQUFKLElBQUksUUFtQ1Y7QUNuQ0QsSUFBTyxFQUFFLENBS1I7QUFMRCxXQUFPLEVBQUU7SUFDTDtRQUFBO1FBR0EsQ0FBQztRQUFELGNBQUM7SUFBRCxDQUhBLEFBR0MsSUFBQTtJQUhZLFVBQU8sVUFHbkIsQ0FBQTtBQUNMLENBQUMsRUFMTSxFQUFFLEtBQUYsRUFBRSxRQUtSIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgQXBwIHtcbiAgICBleHBvcnQgY2xhc3MgQ29uc3RhbnRzIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyBTWU1CT0xfV0lEVEggPSAyMDA7XG4gICAgICAgIHB1YmxpYyBzdGF0aWMgU1lNQk9MX0hFSUdIVCA9IDEwMDtcbiAgICB9XG59IiwibW9kdWxlIEFwcCB7XG4gICAgZXhwb3J0IGNsYXNzIE1haW4ge1xuXG4gICAgICAgIHByaXZhdGUgYXBwOiBQSVhJLkFwcGxpY2F0aW9uO1xuXG4gICAgICAgIHByaXZhdGUgcmVlbFZpZXc6IHZpZXcuUmVlbFZpZXc7XG4gICAgICAgIHByaXZhdGUgZ29vZFJlZWxWaWV3OiB2aWV3LlJlZWxWaWV3O1xuICAgICAgICBwcml2YXRlIHNwaW5CdG46IFBJWEkuRGlzcGxheU9iamVjdDtcbiAgICAgICAgZmlsdGVyOiBQSVhJLkZpbHRlcltdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgICAgICB0aGlzLmluaXRQSVhJKCk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0TG9hZGluZygpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGluaXRQSVhJKCkge1xuICAgICAgICAgICAgLy8gdGhpcy5hcHAgPSBuZXcgUElYSS5BcHBsaWNhdGlvbih3aW5kb3cuaW5uZXJXaWR0aCAqIGRldmljZVBpeGVsUmF0aW8sIHdpbmRvdy5pbm5lckhlaWdodCAqIGRldmljZVBpeGVsUmF0aW8sIHsgYmFja2dyb3VuZENvbG9yOiAweDEwOTliYiB9KTtcbiAgICAgICAgICAgIHRoaXMuYXBwID0gbmV3IFBJWEkuQXBwbGljYXRpb24od2luZG93LmlubmVyV2lkdGggLCB3aW5kb3cuaW5uZXJIZWlnaHQgLCB7IGJhY2tncm91bmRDb2xvcjogMHgxMDk5YmIsIGF1dG9SZXNpemU6dHJ1ZSB9KTtcbiAgICAgICAgICAgIHRoaXMuYXBwLnZpZXcuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgICAgICAgIHRoaXMuYXBwLnZpZXcuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5hcHAudmlldyk7XG4gICAgICAgICAgICBpZiAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLm9uUmVzaXplLmJpbmQodGhpcyksIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgb25SZXNpemUoKSB7XG4gICAgICAgICAgICAvLyB0aGlzLmFwcC5yZW5kZXJlci5yZXNpemUod2luZG93LmlubmVyV2lkdGggKiBkZXZpY2VQaXhlbFJhdGlvLCB3aW5kb3cuaW5uZXJIZWlnaHQgKiBkZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgICAgICAgIHRoaXMuYXBwLnJlbmRlcmVyLnJlc2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCAsIHdpbmRvdy5pbm5lckhlaWdodCApO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5hcHAuc2NyZWVuLndpZHRoIDwgMi41ICogQXBwLkNvbnN0YW50cy5TWU1CT0xfV0lEVEgpIHtcbiAgICAgICAgICAgICAgICAvLyDliIfnm7RcbiAgICAgICAgICAgICAgICB0aGlzLnJlZWxWaWV3LnggPSB0aGlzLmFwcC5zY3JlZW4ud2lkdGggLyAyO1xuICAgICAgICAgICAgICAgIHRoaXMucmVlbFZpZXcueSA9IHRoaXMuYXBwLnNjcmVlbi5oZWlnaHQgLyAyIC0gMjAwO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcueCA9IHRoaXMuYXBwLnNjcmVlbi53aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcueSA9IHRoaXMuYXBwLnNjcmVlbi5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyDliIfmqatcbiAgICAgICAgICAgICAgICB0aGlzLnJlZWxWaWV3LnggPSB0aGlzLmFwcC5zY3JlZW4ud2lkdGggLyAyIC0gMTI1O1xuICAgICAgICAgICAgICAgIHRoaXMucmVlbFZpZXcueSA9IHRoaXMuYXBwLnNjcmVlbi5oZWlnaHQgLyAyO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcueCA9IHRoaXMuYXBwLnNjcmVlbi53aWR0aCAvIDIgKyAxMjU7XG4gICAgICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcueSA9IHRoaXMuYXBwLnNjcmVlbi5oZWlnaHQgLyAyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNwaW5CdG4ueCA9IHRoaXMuYXBwLnNjcmVlbi53aWR0aCAvIDI7XG4gICAgICAgICAgICB0aGlzLnNwaW5CdG4ueSA9IHRoaXMuZ29vZFJlZWxWaWV3LnkgKyBBcHAuQ29uc3RhbnRzLlNZTUJPTF9IRUlHSFQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdGFydExvYWRpbmcoKTogYW55IHtcbiAgICAgICAgICAgIGxldCBsb2FkaW5nVmlldyA9IG5ldyB2aWV3LkxvYWRpbmdWaWV3KCk7XG4gICAgICAgICAgICBsb2FkaW5nVmlldy54ID0gdGhpcy5hcHAuc2NyZWVuLndpZHRoIC8gMjtcbiAgICAgICAgICAgIGxvYWRpbmdWaWV3LnkgPSB0aGlzLmFwcC5zY3JlZW4uaGVpZ2h0IC8gMjtcblxuICAgICAgICAgICAgdGhpcy5hcHAuc3RhZ2UuYWRkQ2hpbGQobG9hZGluZ1ZpZXcpO1xuXG4gICAgICAgICAgICBQSVhJLmxvYWRlclxuICAgICAgICAgICAgICAgIC5vbihcInByb2dyZXNzXCIsIChsb2FkZXI6IFBJWEkubG9hZGVycy5Mb2FkZXIsIHJlc291cmNlOiBQSVhJLmxvYWRlcnMuUmVzb3VyY2UpID0+IHsgbG9hZGluZ1ZpZXcudXBkYXRlUHJvZ3Jlc3MobG9hZGVyLnByb2dyZXNzKSB9KVxuICAgICAgICAgICAgICAgIC5hZGQoXCJzaG9wc1wiLCBcInJlc291cmNlL3Nob3BzLmpzb25cIilcbiAgICAgICAgICAgICAgICAubG9hZCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRpbmdWaWV3LnBhcmVudC5yZW1vdmVDaGlsZChsb2FkaW5nVmlldyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Mb2FkZWQoKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgb25Mb2FkZWQoKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRSZWVsVmlldyhQSVhJLmxvYWRlci5yZXNvdXJjZXMuc2hvcHMuZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmluaXRTcGluQnV0dG9uKCk7XG4gICAgICAgICAgICB0aGlzLm9uUmVzaXplKCk7XG5cbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgaW5pdFJlZWxWaWV3KHNob3BzOiB2by5TaG9wc1ZPKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzaG9wcyk7XG4gICAgICAgICAgICBsZXQgcmVlbCA9IG5ldyB2aWV3LlJlZWxWaWV3KHNob3BzLm5vcm1hbCk7XG5cbiAgICAgICAgICAgIGxldCB0ZXh0MSA9IG5ldyBQSVhJLlRleHQoXCLmma7pgJpcIilcbiAgICAgICAgICAgIHRleHQxLmFuY2hvci5zZXQoMC41KTtcbiAgICAgICAgICAgIHRleHQxLnkgPSAtNzU7XG4gICAgICAgICAgICByZWVsLmFkZENoaWxkKHRleHQxKTtcblxuICAgICAgICAgICAgdGhpcy5hcHAuc3RhZ2UuYWRkQ2hpbGQocmVlbCk7XG4gICAgICAgICAgICB0aGlzLnJlZWxWaWV3ID0gcmVlbDtcblxuICAgICAgICAgICAgLy8g6ICB6ZeG55qEXG4gICAgICAgICAgICBsZXQgcmVlbDIgPSBuZXcgdmlldy5SZWVsVmlldyhzaG9wcy5nb29kKTtcbiAgICAgICAgICAgIGxldCB0ZXh0MiA9IG5ldyBQSVhJLlRleHQoXCLniL1cIilcbiAgICAgICAgICAgIHRleHQyLmFuY2hvci5zZXQoMC41KTtcbiAgICAgICAgICAgIHRleHQyLnkgPSAtNzU7XG4gICAgICAgICAgICByZWVsMi5hZGRDaGlsZCh0ZXh0Mik7XG5cbiAgICAgICAgICAgIHRoaXMuYXBwLnN0YWdlLmFkZENoaWxkKHJlZWwyKTtcbiAgICAgICAgICAgIHRoaXMuZ29vZFJlZWxWaWV3ID0gcmVlbDI7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0U3BpbkJ1dHRvbigpIHtcbiAgICAgICAgICAgIGxldCBidG4gPSBuZXcgdmlldy5CdXR0b24oXCLplovlp4tcIik7XG4gICAgICAgICAgICBidG4uYW5jaG9yLnNldCgwLjUpO1xuICAgICAgICAgICAgYnRuLnggPSB0aGlzLnJlZWxWaWV3Lng7XG4gICAgICAgICAgICBidG4ueSA9IHRoaXMucmVlbFZpZXcueSArIEFwcC5Db25zdGFudHMuU1lNQk9MX0hFSUdIVDtcbiAgICAgICAgICAgIGJ0bi5idXR0b25XaWR0aCA9IEFwcC5Db25zdGFudHMuU1lNQk9MX1dJRFRIO1xuICAgICAgICAgICAgYnRuLmJ1dHRvbkhlaWdodCA9IDU1O1xuICAgICAgICAgICAgLy8gYnRuLnggPSB0aGlzLmFwcC5zY3JlZW4ud2lkdGggLSA2NDtcbiAgICAgICAgICAgIC8vIGJ0bi55ID0gdGhpcy5hcHAuc2NyZWVuLmhlaWdodCAtIDQ4O1xuICAgICAgICAgICAgYnRuLmludGVyYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIGJ0bi5vbigncG9pbnRlcnVwJywgdGhpcy5zcGluLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICB0aGlzLnNwaW5CdG4gPSBidG47XG5cbiAgICAgICAgICAgIHRoaXMuYXBwLnN0YWdlLmFkZENoaWxkKGJ0bik7XG5cblxuICAgICAgICAgICAgLy8gbGV0IHRlc3RCdG4gPSBuZXcgdmlldy5CdXR0b24oKTtcbiAgICAgICAgICAgIC8vIHRlc3RCdG4uYnV0dG9uV2lkdGggPSBBcHAuQ29uc3RhbnRzLlNZTUJPTF9XSURUSDtcbiAgICAgICAgICAgIC8vIHRlc3RCdG4uYnV0dG9uSGVpZ2h0ID0gNzU7XG4gICAgICAgICAgICAvLyAvLyB0ZXN0QnRuLnJlZHJhdygpO1xuXG4gICAgICAgICAgICAvLyB0ZXN0QnRuLnggPSB0aGlzLnJlZWxWaWV3Lng7XG4gICAgICAgICAgICAvLyB0ZXN0QnRuLnkgPSB0aGlzLnJlZWxWaWV3LnkgKyBBcHAuQ29uc3RhbnRzLlNZTUJPTF9IRUlHSFQgKjI7XG4gICAgICAgICAgICAvLyB0aGlzLmFwcC5zdGFnZS5hZGRDaGlsZCh0ZXN0QnRuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNwaW4oKSB7XG4gICAgICAgICAgICB0aGlzLnJlZWxWaWV3Lm9uU3BpbigpO1xuICAgICAgICAgICAgdGhpcy5nb29kUmVlbFZpZXcub25TcGluKCk7XG5cbiAgICAgICAgICAgIHRoaXMucmVlbFZpZXcuZmlsdGVycyA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmdvb2RSZWVsVmlldy5maWx0ZXJzID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gbGV0IG91dGxpbmVGaWx0ZXIgPSBbdGhpcy5maWx0ZXIgfHwgbmV3IFBJWEkuZmlsdGVycy5PdXRsaW5lRmlsdGVyKDUsIDB4ZmYwMDAwKV07XG4gICAgICAgICAgICBsZXQgb3V0bGluZUZpbHRlciA9IHRoaXMuZmlsdGVyIHx8IFtuZXcgUElYSS5maWx0ZXJzLkdsb3dGaWx0ZXIoMTUpXTtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyID0gb3V0bGluZUZpbHRlcjtcblxuICAgICAgICAgICAgbGV0IG9iaiA9IHsgdmFyOiAwIH07XG4gICAgICAgICAgICBUd2VlbkxpdGUudG8ob2JqLCA1LCB7IHZhcjogTWF0aC5yYW5kb20oKSAqIDIgKyAxNSwgb25VcGRhdGU6IHRoaXMuY2hhbmdlT3V0bGluZUZpbHRlciwgb25VcGRhdGVQYXJhbXM6IFtvYmosIG91dGxpbmVGaWx0ZXJdLCBvblVwZGF0ZVNjb3BlOiB0aGlzLCBlYXNlOiBRdWFkLmVhc2VJbk91dCB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgY2hhbmdlT3V0bGluZUZpbHRlcihvYmo6IHsgdmFyOiBudW1iZXIgfSwgZmlsdGVyKSB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSBNYXRoLnJvdW5kKG9iai52YXIpICUgMjtcblxuICAgICAgICAgICAgaWYgKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWVsVmlldy5maWx0ZXJzID0gZmlsdGVyO1xuICAgICAgICAgICAgICAgIHRoaXMuZ29vZFJlZWxWaWV3LmZpbHRlcnMgPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlZWxWaWV3LmZpbHRlcnMgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuZ29vZFJlZWxWaWV3LmZpbHRlcnMgPSBmaWx0ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgdmlldyB7XG4gICAgZXhwb3J0IGVudW0gSG92ZXJUeXBlIHtcbiAgICAgICAgdHlwZTFcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgQnV0dG9uSG92ZXJFZmZlY3Qge1xuXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgb25Ib3Zlcih0eXBlOiBIb3ZlclR5cGUsIHR3ZWVuT2JqOiBQSVhJLkRpc3BsYXlPYmplY3QsIGlzT3ZlckluOiBib29sZWFuKSB7XG5cbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgSG92ZXJUeXBlLnR5cGUxOlxuICAgICAgICAgICAgICAgICAgICBCdXR0b25Ib3ZlckVmZmVjdC5hbHBoYVZpc2libGUodHdlZW5PYmosIGlzT3ZlckluKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuICAgICAgICBwcml2YXRlIHN0YXRpYyBhbHBoYVZpc2libGUodHdlZW5PYmo6IFBJWEkuRGlzcGxheU9iamVjdCwgaXNPdmVySW46IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIGxldCBzZWMgPSAwLjU7XG4gICAgICAgICAgICBUd2VlbkxpdGUua2lsbFR3ZWVuc09mKHR3ZWVuT2JqKTtcblxuICAgICAgICAgICAgaWYgKGlzT3ZlckluKSB7XG4gICAgICAgICAgICAgICAgVHdlZW5MaXRlLnRvKHR3ZWVuT2JqLCBzZWMsIHsgYWxwaGE6IDEgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFR3ZWVuTGl0ZS50byh0d2Vlbk9iaiwgc2VjLCB7IGFscGhhOiAwLCBvbkNvbXBsZXRlOiAoKSA9PiB7IHR3ZWVuT2JqLnZpc2libGUgPSBmYWxzZSB9IH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH1cbn0iLCJtb2R1bGUgdmlldyB7XG5cbiAgICBleHBvcnQgY2xhc3MgQnV0dG9uIGV4dGVuZHMgUElYSS5TcHJpdGUge1xuXG4gICAgICAgIGhvdmVyVHlwZTogSG92ZXJUeXBlID0gSG92ZXJUeXBlLnR5cGUxO1xuXG5cbiAgICAgICAgZnJhbWVDb2xvciA9IDB4ZmZmZmZmO1xuICAgICAgICBiZ0NvbG9yID0gMHgwMDExZmY7XG4gICAgICAgIGJnQ29sb3JPbkNsaWNrID0gMHgzM2FhYWE7XG5cbiAgICAgICAgbGFiZWw6IFBJWEkuVGV4dDtcbiAgICAgICAgcHJpdmF0ZSBiZ1ZpZXc6IFBJWEkuR3JhcGhpY3M7XG5cbiAgICAgICAgcHJpdmF0ZSBfYnV0dG9uV2lkdGg6IG51bWJlcjtcbiAgICAgICAgcHJpdmF0ZSBfYnV0dG9uSGVpZ2h0OiBudW1iZXI7XG5cbiAgICAgICAgcHJpdmF0ZSBlZmZlY3Q6IFBJWEkuU3ByaXRlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKHRleHQgPSBcIkJ1dHRvblwiKSB7XG4gICAgICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgICAgICB0aGlzLmJnVmlldyA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG5cbiAgICAgICAgICAgIHRoaXMuZWZmZWN0ID0gbmV3IFBJWEkuU3ByaXRlKFBJWEkuVGV4dHVyZS5XSElURSk7XG4gICAgICAgICAgICB0aGlzLmVmZmVjdC5hbmNob3Iuc2V0KDAuNSk7XG4gICAgICAgICAgICB0aGlzLmVmZmVjdC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmVmZmVjdC5hbHBoYSA9IDA7XG5cbiAgICAgICAgICAgIHRoaXMubGFiZWwgPSBuZXcgUElYSS5UZXh0KHRleHQsIHsgZmlsbDogdGhpcy5mcmFtZUNvbG9yIH0pO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5hbmNob3Iuc2V0KDAuNSk7XG5cbiAgICAgICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5iZ1ZpZXcsIHRoaXMuZWZmZWN0LCB0aGlzLmxhYmVsKTtcblxuICAgICAgICAgICAgdGhpcy5kcmF3Tm9ybWFsU3l0bGUoKTtcblxuICAgICAgICAgICAgLy8gc2V0IGludGVyYWN0aXZlXG4gICAgICAgICAgICB0aGlzLmludGVyYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uTW9kZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm9uKFwicG9pbnRlcm92ZXJcIiwgdGhpcy5vbkJ1dHRvbk92ZXIpO1xuICAgICAgICAgICAgdGhpcy5vbihcInBvaW50ZXJvdXRcIiwgdGhpcy5vbkJ1dHRvbk91dCk7XG4gICAgICAgICAgICB0aGlzLm9uKFwicG9pbnRlcmRvd25cIiwoKT0+e3RoaXMuZWZmZWN0LnRpbnQgPSB0aGlzLmJnQ29sb3JPbkNsaWNrfSk7XG4gICAgICAgICAgICB0aGlzLm9uKFwicG9pbnRlcnVwXCIsKCk9Pnt0aGlzLmVmZmVjdC50aW50ID0gdGhpcy5mcmFtZUNvbG9yfSk7XG4gICAgICAgIH1cblxuICAgICAgICBkcmF3Tm9ybWFsU3l0bGUoKSB7XG4gICAgICAgICAgICAvLyBsZXQgd2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICAgICAgLy8gbGV0IGhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgbGV0IHBhZGRpbmcgPSAxMDtcbiAgICAgICAgICAgIGxldCB3aWR0aCA9IHRoaXMuX2J1dHRvbldpZHRoIHx8IHRoaXMubGFiZWwud2lkdGggKyBwYWRkaW5nO1xuICAgICAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMuX2J1dHRvbkhlaWdodCB8fCB0aGlzLmxhYmVsLmhlaWdodCArIHBhZGRpbmc7XG5cbiAgICAgICAgICAgIC8vIGxldCBzdGFydFggPSAgLXdpZHRoICogMC41O1xuICAgICAgICAgICAgLy8gbGV0IHN0YXJ0WSA9IC1oZWlnaHQgKiAwLjU7XG4gICAgICAgICAgICBsZXQgc3RhcnRYID0gLXdpZHRoICogMC41O1xuICAgICAgICAgICAgbGV0IHN0YXJ0WSA9IC1oZWlnaHQgKiAwLjU7XG5cbiAgICAgICAgICAgIGxldCBncmFwaCA9IHRoaXMuYmdWaWV3O1xuICAgICAgICAgICAgZ3JhcGguY2xlYXIoKTtcbiAgICAgICAgICAgIGdyYXBoLmJlZ2luRmlsbCh0aGlzLmJnQ29sb3IpO1xuICAgICAgICAgICAgLy8gZ3JhcGguZHJhd1JlY3Qoc3RhcnRYLHN0YXJ0WSx3aWR0aCxoZWlnaHQpO1xuICAgICAgICAgICAgLy8gZ3JhcGguZW5kRmlsbCgpO1xuXG4gICAgICAgICAgICBncmFwaC5saW5lU3R5bGUoNSwgdGhpcy5mcmFtZUNvbG9yKTtcblxuICAgICAgICAgICAgZ3JhcGgubW92ZVRvKHN0YXJ0WCwgc3RhcnRZKTtcbiAgICAgICAgICAgIGdyYXBoLmxpbmVUbyhzdGFydFggKyB3aWR0aCwgc3RhcnRZKTtcbiAgICAgICAgICAgIGdyYXBoLmxpbmVUbyhzdGFydFggKyB3aWR0aCwgc3RhcnRZICsgaGVpZ2h0KTtcbiAgICAgICAgICAgIGdyYXBoLmxpbmVUbyhzdGFydFgsIHN0YXJ0WSArIGhlaWdodCk7XG4gICAgICAgICAgICBncmFwaC5saW5lVG8oc3RhcnRYLCBzdGFydFkpO1xuXG4gICAgICAgICAgICBncmFwaC5lbmRGaWxsKCk7XG5cblxuICAgICAgICB9XG5cbiAgICAgICAgc2V0IGJ1dHRvbldpZHRoKHdpZHRoOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2J1dHRvbldpZHRoID0gTWF0aC5tYXgod2lkdGgsIHRoaXMubGFiZWwud2lkdGgpO1xuICAgICAgICAgICAgdGhpcy5yZWRyYXcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCBidXR0b25IZWlnaHQoaGVpZ2h0OiBudW1iZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2J1dHRvbkhlaWdodCA9IE1hdGgubWF4KGhlaWdodCwgdGhpcy5sYWJlbC5oZWlnaHQpO1xuICAgICAgICAgICAgdGhpcy5yZWRyYXcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlZHJhdygpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd05vcm1hbFN5dGxlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBvbkJ1dHRvbk92ZXIoKSB7XG4gICAgICAgICAgICB0aGlzLmVmZmVjdC53aWR0aCA9IHRoaXMuX2J1dHRvbldpZHRoO1xuICAgICAgICAgICAgdGhpcy5lZmZlY3QuaGVpZ2h0ID0gdGhpcy5fYnV0dG9uSGVpZ2h0O1xuXG4gICAgICAgICAgICB0aGlzLmVmZmVjdC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZWZmZWN0LnRpbnQgPSB0aGlzLmZyYW1lQ29sb3I7XG5cblxuICAgICAgICAgICAgQnV0dG9uSG92ZXJFZmZlY3Qub25Ib3Zlcih0aGlzLmhvdmVyVHlwZSx0aGlzLmVmZmVjdCx0cnVlKTtcblxuICAgICAgICAgICAgdGhpcy5sYWJlbC5zdHlsZS5maWxsID0gdGhpcy5iZ0NvbG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgb25CdXR0b25PdXQoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEJ1dHRvbkhvdmVyRWZmZWN0Lm9uSG92ZXIodGhpcy5ob3ZlclR5cGUsdGhpcy5lZmZlY3QsZmFsc2UpO1xuXG4gICAgICAgICAgICB0aGlzLmxhYmVsLnN0eWxlLmZpbGwgPSB0aGlzLmZyYW1lQ29sb3I7XG4gICAgICAgIH1cbiAgICB9XG59IiwibW9kdWxlIHZpZXcge1xuICAgIGV4cG9ydCBjbGFzcyBMb2FkaW5nVmlldyBleHRlbmRzIFBJWEkuR3JhcGhpY3Mge1xuXG4gICAgICAgIHByaXZhdGUgcHJvZ3Jlc3M6IG51bWJlciA9IDA7XG4gICAgICAgIGNvbG9yOiBudW1iZXIgPSAweGFhYmMxM1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB1cGRhdGVQcm9ncmVzcyhwOiBudW1iZXIpIHtcbiAgICAgICAgICAgIGxldCBwZXJjZW50ID0gcDtcbiAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSBwZXJjZW50O1xuXG4gICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgICAgICB0aGlzLmxpbmVTdHlsZSgxMCwgdGhpcy5jb2xvcik7XG4gICAgICAgICAgICAvLyB0aGlzLmRyYXdDaXJjbGUoMCwgMCwgMiAqIE1hdGguUEkgKiBwZXJjZW50KTtcbiAgICAgICAgICAgIHRoaXMuYXJjKDAsIDAsIDUwLCAwLCAyICogTWF0aC5QSSAqIHBlcmNlbnQpO1xuICAgICAgICAgICAgdGhpcy5lbmRGaWxsKCk7XG4gICAgICAgIH1cblxuICAgIH1cbn1cbiIsIm1vZHVsZSB2aWV3IHtcbiAgICBleHBvcnQgY2xhc3MgUmVlbFZpZXcgZXh0ZW5kcyBQSVhJLlNwcml0ZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBmcmFtZTogUElYSS5HcmFwaGljcztcbiAgICAgICAgcHJpdmF0ZSB3aGVlbDogdmlldy5XaGVlbFZpZXc7XG4gICAgICAgIHByaXZhdGUgc2hvcHM6IHN0cmluZ1tdO1xuXG4gICAgICAgIHByaXZhdGUgdGVtcElkczogbnVtYmVyW10gPSBbMCwgMSwgMl07XG4gICAgICAgIHNwaW5pbmc6IGJvb2xlYW47XG4gICAgICAgIC8vIHByaXZhdGUgX21hc2s6IFBJWEkuRGlzcGxheU9iamVjdDtcblxuICAgICAgICBjb25zdHJ1Y3RvcihzaG9wczogc3RyaW5nW10pIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICB0aGlzLnNob3BzID0gc2hvcHM7XG5cbiAgICAgICAgICAgIGxldCB3aWR0aCA9IEFwcC5Db25zdGFudHMuU1lNQk9MX1dJRFRIO1xuICAgICAgICAgICAgbGV0IGhlaWdodCA9IEFwcC5Db25zdGFudHMuU1lNQk9MX0hFSUdIVDtcblxuICAgICAgICAgICAgdGhpcy5mcmFtZSA9IG5ldyBQSVhJLkdyYXBoaWNzKCk7XG4gICAgICAgICAgICB0aGlzLmZyYW1lLmxpbmVTdHlsZSgxMCwgMHgwMDAwMDApO1xuICAgICAgICAgICAgdGhpcy5mcmFtZS5kcmF3UmVjdCgtd2lkdGggKiAwLjUsIC1oZWlnaHQgKiAwLjUsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgICAgdGhpcy5mcmFtZS5lbmRGaWxsKCk7XG5cbiAgICAgICAgICAgIC8vIG1hc2tcbiAgICAgICAgICAgIGxldCBtYXNrID0gbmV3IFBJWEkuR3JhcGhpY3MoKTtcbiAgICAgICAgICAgIG1hc2suYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICAgICAgICAgIG1hc2suZHJhd1JlY3QoLXdpZHRoICogMC41LCAtaGVpZ2h0ICogMC41LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICAgIG1hc2suZW5kRmlsbCgpO1xuXG5cbiAgICAgICAgICAgIC8vIHdoZWVsXG4gICAgICAgICAgICBsZXQgd2hlZWwgPSBuZXcgdmlldy5XaGVlbFZpZXcoc2hvcHMpO1xuICAgICAgICAgICAgd2hlZWwubWFzayA9IG1hc2s7XG4gICAgICAgICAgICB3aGVlbC5zZXRJZHModGhpcy50ZW1wSWRzKTtcbiAgICAgICAgICAgIHRoaXMud2hlZWwgPSB3aGVlbDtcblxuXG4gICAgICAgICAgICB0aGlzLmFkZENoaWxkKHdoZWVsLCBtYXNrLCB0aGlzLmZyYW1lKTtcblxuICAgICAgICAgICAgdGhpcy51cGRhdGVTaG9wKHRoaXMudGVtcElkcyk7XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGVTaG9wKHNob3BJZDogbnVtYmVyW10pIHtcbiAgICAgICAgICAgIHRoaXMud2hlZWwuc2V0SWRzKHNob3BJZCk7XG4gICAgICAgIH1cblxuICAgICAgICBvblNwaW4oKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zcGluaW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zcGluaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgbGV0IGRhbXBpbmdTdGFydFNlYyA9IDAuNTtcbiAgICAgICAgICAgIFR3ZWVuTWF4LnRvKHRoaXMud2hlZWwucG9zaXRpb24sIGRhbXBpbmdTdGFydFNlYywgeyB5OiAtNDAsIHlveW86IHRydWUsIHJlcGVhdDogMSB9KTtcbiAgICAgICAgICAgIFR3ZWVuTWF4LmZyb21Ubyh0aGlzLndoZWVsLnBvc2l0aW9uLCAwLjIsIHsgeTogMCB9LCB7IGRlbGF5OiBkYW1waW5nU3RhcnRTZWMgKiAyLCB5OiBBcHAuQ29uc3RhbnRzLlNZTUJPTF9IRUlHSFQsIHJlcGVhdDogMTAsIGVhc2U6IExpbmVhci5lYXNlTm9uZSwgb25SZXBlYXQ6IHRoaXMuc3dhcElkLCBvblJlcGVhdFNjb3BlOiB0aGlzLCBvbkNvbXBsZXRlOiB0aGlzLm9uU3BpbkNvbXBsZXRlLCBvbkNvbXBsZXRlU2NvcGU6IHRoaXMgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJhbmRvbUlkKCk6IG51bWJlciB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5zaG9wcy5sZW5ndGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dhcElkKCkge1xuICAgICAgICAgICAgdGhpcy50ZW1wSWRzLnVuc2hpZnQodGhpcy5yYW5kb21JZCgpKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2hvcCh0aGlzLnRlbXBJZHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgb25TcGluQ29tcGxldGUoKSB7XG5cbiAgICAgICAgICAgIHRoaXMuc3BpbmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy50ZW1wSWRzLnVuc2hpZnQodGhpcy5yYW5kb21JZCgpKTtcbiAgICAgICAgICAgIHRoaXMudGVtcElkcy51bnNoaWZ0KHRoaXMucmFuZG9tSWQoKSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNob3AodGhpcy50ZW1wSWRzKTtcblxuICAgICAgICAgICAgVHdlZW5MaXRlLmZyb21Ubyh0aGlzLndoZWVsLnBvc2l0aW9uLCAxLCB7IHk6IC1BcHAuQ29uc3RhbnRzLlNZTUJPTF9IRUlHSFQgfSwgeyB5OiAwLCBlYXNlOiBCYWNrLmVhc2VPdXQgfSk7XG4gICAgICAgIH1cbiAgICB9XG59IiwibW9kdWxlIHZpZXcge1xuICAgIGV4cG9ydCBjbGFzcyBXaGVlbFZpZXcgZXh0ZW5kcyBQSVhJLlNwcml0ZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBzaG9wczogc3RyaW5nW107XG5cbiAgICAgICAgY29uc3RydWN0b3Ioc2hvcHM6IHN0cmluZ1tdKSB7XG4gICAgICAgICAgICBzdXBlcihQSVhJLlRleHR1cmUuRU1QVFkpO1xuICAgICAgICAgICAgdGhpcy5zaG9wcyA9IHNob3BzO1xuXG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN5bWJvbFRleHQgPSBuZXcgUElYSS5UZXh0KFwiXCIsIHsgZmlsbDogXCIweDAwMDAwMFwiIH0pO1xuICAgICAgICAgICAgICAgIHN5bWJvbFRleHQuYW5jaG9yLnNldCgwLjUpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGJnID0gbmV3IFBJWEkuU3ByaXRlKFBJWEkuVGV4dHVyZS5XSElURSk7XG4gICAgICAgICAgICAgICAgYmcud2lkdGggPSBBcHAuQ29uc3RhbnRzLlNZTUJPTF9XSURUSDtcbiAgICAgICAgICAgICAgICBiZy5oZWlnaHQgPSBBcHAuQ29uc3RhbnRzLlNZTUJPTF9IRUlHSFQ7XG4gICAgICAgICAgICAgICAgYmcuYW5jaG9yLnNldCgwLjUpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRhaW5lciA9IG5ldyBQSVhJLkNvbnRhaW5lcigpO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hZGRDaGlsZChiZywgc3ltYm9sVGV4dCk7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnkgPSAoaSAtIDEpICogQXBwLkNvbnN0YW50cy5TWU1CT0xfSEVJR0hUO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChjb250YWluZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2V0SWRzKGlkczogbnVtYmVyW10pIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IFBJWEkuQ29udGFpbmVyLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHRleHRWaWV3ID0gY2hpbGQuZ2V0Q2hpbGRBdCgxKSBhcyBQSVhJLlRleHQ7XG4gICAgICAgICAgICAgICAgdGV4dFZpZXcudGV4dCA9IHRoaXMuc2hvcHNbaWRzW2ldXTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgIH1cbn0iLCJtb2R1bGUgdm97XG4gICAgZXhwb3J0IGNsYXNzIFNob3BzVk97XG4gICAgICAgIHB1YmxpYyBub3JtYWw6c3RyaW5nW107XG4gICAgICAgIHB1YmxpYyBnb29kOnN0cmluZ1tdO1xuICAgIH1cbn0iXX0=
