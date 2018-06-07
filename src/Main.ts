module App {
    export class Main {

        private app: PIXI.Application;

        private reelView: view.ReelView;
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

            this.reelView.x = this.app.screen.width / 2;
            this.reelView.y = this.app.screen.height / 2;

            this.spinBtn.x = this.reelView.x;
            this.spinBtn.y = this.reelView.y + App.Constants.SYMBOL_HEIGHT;
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
        }

        initReelView(shops: string[]) {
            console.log(shops);
            let reel = new view.ReelView(shops);
            reel.x = this.app.screen.width / 2;
            reel.y = this.app.screen.height / 2;

            this.app.stage.addChild(reel);

            this.reelView = reel;
        }

        initSpinButton() {
            let btn = new PIXI.Text("開始");
            btn.anchor.set(0.5);
            btn.x = this.reelView.x;
            btn.y = this.reelView.y + App.Constants.SYMBOL_HEIGHT;
            // btn.x = this.app.screen.width - 64;
            // btn.y = this.app.screen.height - 48;
            btn.interactive = true;
            btn.on('pointerup', this.spin.bind(this));

            this.spinBtn = btn;

            this.app.stage.addChild(btn);


            let testBtn = new view.Button();
            testBtn.buttonWidth = App.Constants.SYMBOL_WIDTH;
            testBtn.buttonHeight = 75;
            // testBtn.redraw();

            testBtn.x = this.reelView.x;
            testBtn.y = this.reelView.y + App.Constants.SYMBOL_HEIGHT *2;
            this.app.stage.addChild(testBtn);
        }

        spin() {
            this.reelView.onSpin();
        }


    }
}
