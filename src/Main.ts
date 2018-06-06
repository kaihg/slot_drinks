module App {
    export class Main {

        private app: PIXI.Application;

        private reelView : view.ReelView;

        constructor() {

            this.initPIXI();
            this.startLoading();

        }

        private initPIXI() {
            this.app = new PIXI.Application(window.innerWidth, window.innerHeight, { backgroundColor: 0x1099bb });
            document.body.appendChild(this.app.view);
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

        initReelView(shops : string[]){
            console.log(shops);
            let reel = new view.ReelView(shops);
            reel.x = this.app.screen.width / 2;
            reel.y = this.app.screen.height / 2;
            reel.updateShop([0,0,0]);


            this.app.stage.addChild(reel);

            this.reelView = reel;
        }

        initSpinButton(){
            let btn = new PIXI.Text("開始");
            btn.x = this.app.screen.width - 64;
            btn.y = this.app.screen.height - 48;
            btn.interactive=  true;
            btn.on('pointerup',this.spin.bind(this));

            this.app.stage.addChild(btn);
            
        }

        spin(){            
            this.reelView.onSpin();
        }


    }
}
