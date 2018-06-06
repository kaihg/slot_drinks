module view{
    export class LoadingView extends PIXI.Graphics {

        private progress: number = 0;
        color: number = 0xaabc13
    
        constructor() {
            super();
        }
    
        public updateProgress(p: number) {
            let percent = p;
            this.progress = percent;
    
            this.clear();
            this.lineStyle(10, this.color);
            this.drawCircle(0, 0, 2 * Math.PI * percent);
            this.endFill();
        }
    
    }
}
