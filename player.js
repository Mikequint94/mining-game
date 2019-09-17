const ARROW_MAP = {
    37: 'left',
    40: 'down',
    39: 'right',
    38: 'up',
    32: 'space',
};

class Player {
    constructor(ctx, width, height, _mineBlock, _changeDepth) {
        this._ctx = ctx;
        this._width = width;
        this._height = height;
        this._x = 160;
        this._y = 160;
        this.mineBlock = _mineBlock;
        this.changeDepth = _changeDepth;
        this._depth = 0;
        this._inventory = [];
        this._speed = 40; //set default player speed
        document.addEventListener('keydown', this.keydown.bind(this))
        const ship  = document.getElementById("ship");
    }

    draw() {
        this._ctx.drawImage(ship, this._x, this._y, this._width, this._height);

    }
    
    addItem(item) {
      if (item === 'dirt') {return};
      this._inventory.push(item);
    }

    keydown(e) {
        let arrow = ARROW_MAP[e.keyCode];

        if (arrow === 'left' && this._x > 0) {
            this._x -= this._speed;
            this.mineBlock(this._x, this._y);
        }
        if (arrow === 'right' && this._x < 760) {
            this._x += this._speed;
            this.mineBlock(this._x, this._y);
        }
        if (arrow === 'up') {
            if (this._y <200 && this._depth > 0) {
              this.changeDepth(-40);
              this._depth -= 40;
            } else if (this._y > 0){
              this._y -= this._speed;
            }
            this.mineBlock(this._x, this._y);
        }
        if (arrow === 'down') {
          if (this._y > 280) {
            this.changeDepth(40);
            this._depth += 40;
          } else {
            this._y += this._speed;
          }
            this.mineBlock(this._x, this._y);
        }
        if (arrow === 'space') {
            console.log(this._inventory)
        }
    }
}