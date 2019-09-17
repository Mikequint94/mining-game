class Block {
    constructor(ctx, x, y, type) {
        this._ctx = ctx;
        this._width = 40;
        this._height = 40;
        this._x = x;
        this._y = y;
        this._type = type;
        const diamond  = document.getElementById("diamond");
        const dirt  = document.getElementById("dirt");
        const gem  = document.getElementById("gem");
        const supergem  = document.getElementById("supergem");
    }

    draw(depth) {
      if (this._type === 'diamond') {
        this._ctx.drawImage(diamond, this._x, this._y-depth, 40, 40);
      } else if (this._type === 'dirt') {
        this._ctx.drawImage(dirt, this._x, this._y-depth, 40, 40);
      } else if (this._type === 'gem') {
        this._ctx.drawImage(gem, this._x, this._y-depth, 40, 40);
      } else if (this._type === 'supergem') {
        this._ctx.drawImage(supergem, this._x, this._y-depth, 40, 40);
      }
    }
}