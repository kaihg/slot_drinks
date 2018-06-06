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
        this.app.stage.addChild(loadingView);

        PIXI.loader
            .on("progress", (loader: PIXI.loaders.Loader, resource: PIXI.loaders.Resource) => { loadingView.updateProgress(loader.progress) })
            .add("shops", "resource/shops.json")
            .load(()=>{
                this.onLoaded();
            });

    }

    onLoaded(){
        console.log("load done")
    }
}