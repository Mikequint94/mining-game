class Block {
    constructor(ctx, x, y, type) {
        this.ctx = ctx;
        this.width = 40;
        this.height = 40;
        this.x = x;
        this.y = y;
        this.type = type;
        this.diamond  = document.getElementById("diamond");
        this.dirt  = document.getElementById("dirt");
        this.gem  = document.getElementById("gem");
        this.supergem  = document.getElementById("supergem");
    }

    draw(depth) {
      if (this.type === 'diamond') {
        this.ctx.drawImage(this.diamond, this.x, this.y-depth, 40, 40);
      } else if (this.type === 'dirt') {
        this.ctx.drawImage(this.dirt, this.x, this.y-depth, 40, 40);
      } else if (this.type === 'gem') {
        this.ctx.drawImage(this.gem, this.x, this.y-depth, 40, 40);
      } else if (this.type === 'supergem') {
        this.ctx.drawImage(this.supergem, this.x, this.y-depth, 40, 40);
      }
    }
}