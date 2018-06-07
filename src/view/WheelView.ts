module view {
    export class WheelView extends PIXI.Sprite {

        private shops: string[];

        constructor(shops: string[]) {
            super(PIXI.Texture.EMPTY);
            this.shops = shops;


            for (let i = 0; i < 3; i++) {
                let symbolText = new PIXI.Text("", { fill: "0x000000" });
                symbolText.anchor.set(0.5);

                let bg = new PIXI.Sprite(PIXI.Texture.WHITE);
                bg.width = App.Constants.SYMBOL_WIDTH;
                bg.height = App.Constants.SYMBOL_HEIGHT;
                bg.anchor.set(0.5);

                let container = new PIXI.Container();
                container.addChild(bg, symbolText);
                container.y = (i - 1) * App.Constants.SYMBOL_HEIGHT;

                this.addChild(container);
            }
        }

        setIds(ids: number[]) {
            this.children.forEach((child: PIXI.Container, i) => {
                let textView = child.getChildAt(1) as PIXI.Text;
                textView.text = this.shops[ids[i]];
            })
        }

    }
}