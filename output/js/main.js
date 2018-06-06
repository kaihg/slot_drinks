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
            this.drawCircle(0, 0, 2 * Math.PI * percent);
            this.endFill();
        };
        return LoadingView;
    }(PIXI.Graphics));
    view.LoadingView = LoadingView;
})(view || (view = {}));
var App;
(function (App) {
    var Main = /** @class */ (function () {
        function Main() {
            this.initPIXI();
            this.startLoading();
        }
        Main.prototype.initPIXI = function () {
            this.app = new PIXI.Application(800, 600, { backgroundColor: 0x1099bb });
            document.body.appendChild(this.app.view);
        };
        Main.prototype.startLoading = function () {
            var _this = this;
            var loadingView = new view.LoadingView();
            this.app.stage.addChild(loadingView);
            PIXI.loader
                .on("progress", function (loader, resource) { loadingView.updateProgress(loader.progress); })
                .add("shops", "resource/shops.json")
                .load(function () {
                _this.onLoaded();
            });
        };
        Main.prototype.onLoaded = function () {
            console.log("load done");
        };
        return Main;
    }());
    App.Main = Main;
})(App || (App = {}));
