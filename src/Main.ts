module App {
    export class Main {

        private app: PIXI.Application;

        private reelView: view.ReelView;
        private goodReelView: view.ReelView;
        private spinBtn: PIXI.DisplayObject;
        filter: any[];

        constructor() {

            this.initPIXI();
            this.startLoading();

        }

        private initPIXI() {
            // this.app = new PIXI.Application(window.innerWidth , window.innerHeight , { backgroundColor: 0x1099bb, autoResize:true ,resolution:devicePixelRatio});
            // this.app.view.style.width = `100%`;
            // this.app.view.style.height = `100%`;
            this.app = new PIXI.Application(window.innerWidth , window.innerHeight , { backgroundColor: 0x1099bb, autoResize:true ,resolution:devicePixelRatio});
            this.app.view.style.width = `${window.innerWidth}px`;
            this.app.view.style.height = `${window.innerHeight}px`;

            document.body.appendChild(this.app.view);
            if (window.addEventListener) {
                window.addEventListener("resize", this.onResize.bind(this), true);
            }
        }

        onResize() {
            this.app.renderer.resize(window.innerWidth , window.innerHeight );
            this.app.view.style.width = `${window.innerWidth}px`;
            this.app.view.style.height = `${window.innerHeight}px`;

            if (this.app.screen.width < 2.5 * App.Constants.SYMBOL_WIDTH) {
                // 切直
                this.reelView.x = this.app.screen.width / 2;
                this.reelView.y = this.app.screen.height / 2 - 100;

                this.goodReelView.x = this.app.screen.width / 2;
                this.goodReelView.y = this.app.screen.height / 2+100;
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
            this.initKeyboardEvent();

            this.onResize();

            
        }

        initReelView(shops: vo.ShopsVO) {
            PIXI.settings.RESOLUTION = devicePixelRatio;
            // console.log(shops);
            let style = new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontSize: 36,
                fontStyle: 'italic',
                fontWeight: 'bold',
                fill: ['#ffffff', '#00ff99'], // gradient
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


            let reel = new view.ReelView(shops.normal);

            let text1 = new PIXI.Text("普通",style)
            
            // text1.resolution = devicePixelRatio;
            text1.dirty = true;

            console.log(`text resolution = ${text1.resolution}, but window is ${devicePixelRatio}, setting is ${PIXI.settings.RESOLUTION}`)
            text1.anchor.set(0.5);
            text1.y = -75;
            reel.addChild(text1);

            this.app.stage.addChild(reel);
            this.reelView = reel;

            // 老闆的
            let reel2 = new view.ReelView(shops.good);
            let text2 = new PIXI.Text("爽",style)
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

            this.reelView.filters = null;
            this.goodReelView.filters = null;

            // let outlineFilter = [this.filter || new PIXI.filters.OutlineFilter(5, 0xff0000)];
            let outlineFilter = this.filter || [new PIXI.filters.GlowFilter(15)];
            // let outlineFilter = this.filter || [new PIXI.filters.TwistFilter(15)];
            this.filter = outlineFilter;

            let obj = { var: 0 };
            TweenLite.to(obj, 5, { var: Math.random() * 2 + 15, onUpdate: this.changeOutlineFilter, onUpdateParams: [obj, outlineFilter], onUpdateScope: this, ease: Quad.easeInOut });


            // this.app.stage.filters = [new PIXI.filters.TwistFilter(500,4)];
        }

        initKeyboardEvent(){
            let space = this.keyboard(32);
            space.press = this.spin.bind(this);

            let enter = this.keyboard(13);
            enter.press = this.spin.bind(this);
        }

        changeOutlineFilter(obj: { var: number }, filter) {
            let index = Math.round(obj.var) % 2;

            if (index) {
                this.reelView.filters = filter;
                this.goodReelView.filters = null;
            } else {
                this.reelView.filters = null;
                this.goodReelView.filters = filter;
            }
        }

        keyboard(keyCode) {
            let key :any = {};
            key.code = keyCode;
            key.isDown = false;
            key.isUp = true;
            key.press = undefined;
            key.release = undefined;
            //The `downHandler`
            key.downHandler = event => {
              if (event.keyCode === key.code) {
                if (key.isUp && key.press) key.press();
                key.isDown = true;
                key.isUp = false;
              }
              event.preventDefault();
            };
          
            //The `upHandler`
            key.upHandler = event => {
              if (event.keyCode === key.code) {
                if (key.isDown && key.release) key.release();
                key.isDown = false;
                key.isUp = true;
              }
              event.preventDefault();
            };
          
            //Attach event listeners
            window.addEventListener(
              "keydown", key.downHandler.bind(key), false
            );
            window.addEventListener(
              "keyup", key.upHandler.bind(key), false
            );
            return key;
          }
    }
}
