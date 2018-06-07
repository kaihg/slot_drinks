module view {
    export class ReelView extends PIXI.Sprite {

        private frame: PIXI.Graphics;
        private wheel: view.WheelView;
        private shops: string[];

        private tempIds: number[] = [0, 1, 2];
        spining: boolean;
        // private _mask: PIXI.DisplayObject;

        constructor(shops: string[]) {
            super();
            this.shops = shops;

            let width = App.Constants.SYMBOL_WIDTH;
            let height = App.Constants.SYMBOL_HEIGHT;

            this.frame = new PIXI.Graphics();
            this.frame.lineStyle(10, 0x000000);
            this.frame.drawRect(-width * 0.5, -height * 0.5, width, height);
            this.frame.endFill();

            // mask
            let mask = new PIXI.Graphics();
            mask.beginFill(0xFFFFFF);
            mask.drawRect(-width * 0.5, -height * 0.5, width, height);
            mask.endFill();


            // wheel
            let wheel = new view.WheelView(shops);
            wheel.mask = mask;
            wheel.setIds(this.tempIds);
            this.wheel = wheel;


            this.addChild(wheel, mask, this.frame);

            this.updateShop(this.tempIds);
        }

        updateShop(shopId: number[]) {
            this.wheel.setIds(shopId);
        }

        onSpin() {
            if (this.spining) {
                return;
            }
            this.spining = true;
            TweenMax.fromTo(this.wheel.position, 0.2, { y: 0 }, { y: App.Constants.SYMBOL_HEIGHT, repeat: 10, ease: Linear.easeNone, onRepeat: this.swapId, onRepeatScope: this, onComplete: this.onSpinComplete, onCompleteScope: this });

        }

        randomId(): number {
            return Math.floor(Math.random() * this.shops.length);
        }

        swapId() {
            this.tempIds.unshift(this.randomId());
            this.updateShop(this.tempIds);
        }

        onSpinComplete() {

            this.spining = false;
            this.tempIds.unshift(this.randomId());
            this.tempIds.unshift(this.randomId());
            this.updateShop(this.tempIds);

            TweenLite.fromTo(this.wheel.position, 1, { y: -App.Constants.SYMBOL_HEIGHT }, { y: 0, ease:Back.easeOut });
        }
    }
}