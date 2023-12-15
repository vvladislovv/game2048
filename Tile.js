export class Tile {
    constructor(gridElement) {
        this.tileElement = document.createElement("div");
        this.tileElement.classList.add("tile");
        this.SetValue(Math.random() > 0.5 ? 2 : 4);
        gridElement.append(this.tileElement);
    }

    SetXY(x,y) {
        this.x = x;
        this.y = y;
        this.tileElement.style.setProperty("--x", x);
        this.tileElement.style.setProperty("--y", y);
    }

    SetValue(value) {
        this.value = value;
        this.tileElement.textContent = value;
        const bgLihtness = 100 - Math.log2(value) * 9; 
        this.tileElement.style.setProperty("--bg-lightness", `${bgLihtness}%`);
        this.tileElement.style.setProperty("--text-lightness", `${bgLihtness < 50 ? 90 : 10}%`)
    }

    removeFromDOM() {
        this.tileElement.remove();
    }

    waitForTransitionEnd() {
        return new Promise(resolve => {
            this.tileElement.addEventListener("transitionend", resolve, {once: true});
        });
    }


    waitForAnimationEnd() {
        return new Promise(resolve => {
                    this.tileElement.addEventListener("animationend", resolve, {once: true});
                });
            }
    
}