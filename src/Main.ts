
module App {
    export class Main {

        private app: PIXI.Application;

        constructor() {

            this.initPIXI();
            this.startLoading();

        }

        private initPIXI() {
            this.app = new PIXI.Application(800, 600, { backgroundColor: 0x1099bb });
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
                    
                    this.onLoaded();
                });

        }

        onLoaded() {
            this.initReelView(PIXI.loader.resources.shops.data);
        }

        initReelView(shops : string[]){
            console.log(shops);
            let reel = new view.ReelView();
            reel.x = this.app.screen.width / 2;
            reel.y = this.app.screen.height / 2;
            this.app.stage.addChild(reel);
        }
    }
}
