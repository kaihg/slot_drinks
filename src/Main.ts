module App {
    export class Main {

        private app: PIXI.Application;

        private reelView: view.ReelView;
        private goodReelView: view.ReelView;
        private spinBtn: PIXI.DisplayObject;

        constructor() {

            this.initPIXI();
            this.startLoading();

        }

        private initPIXI() {
            this.app = new PIXI.Application(window.innerWidth, window.innerHeight, { backgroundColor: 0x1099bb });
            document.body.appendChild(this.app.view);
            if (window.addEventListener) {
                window.addEventListener("resize", this.onResize.bind(this), true);
            }
        }

        onResize() {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);

            if (window.innerWidth < 2.5 * App.Constants.SYMBOL_WIDTH) {
                // 切直
                this.reelView.x = this.app.screen.width / 2;
                this.reelView.y = this.app.screen.height / 2 - 200;

                this.goodReelView.x = this.app.screen.width / 2;
                this.goodReelView.y = this.app.screen.height / 2;
            } else {
                // 切橫
                this.reelView.x = this.app.screen.width / 2 - 125;
                this.reelView.y = this.app.screen.height / 2;

                this.goodReelView.x = this.app.screen.width / 2 + 125;
                this.goodReelView.y = this.app.screen.height / 2;
            }

            this.spinBtn.x = this.app.screen.width / 2;
            this.spinBtn.y = this.goodReelView.y + App.Constants.SYMBOL_HEIGHT;
        }

        startLoading(): any {
            let loadingView = new view.LoadingView();
            loadingView.x = this.app.screen.width / 2;
            loadingView.y = this.app.screen.height / 2;

            this.app.stage.addChild(loadingView);

            PIXI.loader
                .on("progress", (loader: PIXI.loaders.Loader, resource: PIXI.loaders.Resource) => { loadingView.updateProgress(loader.progress) })
                .add("shops", "resource/shops.json")
                .load(() => {
                    loadingView.parent.removeChild(loadingView);
                    this.onLoaded();
                });

        }

        onLoaded() {
            this.initReelView(PIXI.loader.resources.shops.data);
            this.initSpinButton();
            this.onResize();
        }

        initReelView(shops: vo.ShopsVO) {
            console.log(shops);
            let reel = new view.ReelView(shops.normal);

            let text1 = new PIXI.Text("普通")
            text1.anchor.set(0.5);
            text1.y = -75;
            reel.addChild(text1);

            this.app.stage.addChild(reel);

            this.reelView = reel;


            // 老闆的
            let reel2 = new view.ReelView(shops.good);
            let text2 = new PIXI.Text("爽")
            text2.anchor.set(0.5);
            text2.y = -75;
            reel2.addChild(text2);

            this.app.stage.addChild(reel2);

            this.goodReelView = reel2;
        }

        initSpinButton() {
            let btn = new view.Button("開始");
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
        }

        spin() {
            this.reelView.onSpin();
            this.goodReelView.onSpin();
        }


    }
}
