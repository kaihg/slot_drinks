module view{
    export class ReelView extends PIXI.Sprite{

        private frame : PIXI.Graphics;
        private wheel : PIXI.Sprite;

        constructor(){
            super();

            let width = App.Constants.SYMBOL_WIDTH;
            let height = App.Constants.SYMBOL_HEIGHT;

            this.frame = new PIXI.Graphics();
            this.frame.lineStyle(10,0x000000);
            this.frame.drawRect(-width*0.5,-height*0.5,width,height);
            this.frame.endFill();

            this.addChild(this.frame);
        }
    }
}