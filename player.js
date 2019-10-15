const ARROW_MAP = {
    37: 'left',
    40: 'down',
    39: 'right',
    38: 'up',
    32: 'space',
    13: 'enter',
    49: '1',
    50: '2',
};

class Player {
    constructor(ctx, width, height, mine) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.x = 160;
        this.y = 160;
        this.mine = mine;
        this.gravity = 0;
        this.game = null;
        this.inventory = {};
        this.itemCount = 0;
        this.speed = 40; //set default player speed
        document.addEventListener('keydown', this.keydown.bind(this));
        this.ship  = document.getElementById("ship");
    }
    
    kill() {
      this.x = 160;
      this.y = 160;
      this.gravity = 0;
      this.inventory = {};
      this.itemCount = 0;
    }
    
    sendGame(game) {
      this.game = game;
    }

    draw(falling) {
      if (falling) {
        this.y += this.gravity;
        if (this.gravity < 9) {
          this.gravity += .05;
        }
      } else {
        this.gravity = 0;
        this.y = Math.floor((this.y) / 10) * 10;
      }
      
      this.ctx.drawImage(this.ship, this.x, this.y, this.width, this.height);
    }
    
    addItem(item) {
      if (item === 'dirt') {return};
      if (this.itemCount >= this.game.bagSize) {
        this.game.flashFullInventory();
        return;
      };
      this.inventory[`${item}`] = this.inventory[`${item}`] ? this.inventory[`${item}`] + 1 : 1;
      this.itemCount += 1;
    }

    keydown(e) {
        let arrow = ARROW_MAP[e.keyCode];
        if (this.game.pause && arrow && !['enter', '1', '2'].includes(arrow) && this.game.depth === 0 && [400, 560, 720].includes(this.x) && this.y > 105 && this.y < 171) {
          this.game.pause = false;
          this.game.play();
        }

        if (arrow === 'left' && this.x > 0) {
          // console.log(this.x)
          this.mine('left');
        } else if (arrow === 'right' && this.x < 760) {
          this.mine('right');
        } else if (arrow === 'up') {
          this.mine('up');
        } else if (arrow === 'down') {
          this.mine('down');
        } else if (arrow === 'space') {
          console.log(this.inventory)
          console.log('gravity: ',this.gravity)
          console.log('depth: ',this.game.depth)
          console.log('this: ',this)
        } else if (arrow === 'enter' && this.game.depth === 0 && this.y > 115 && this.y < 161) {
          if (this.x === 400) {
            if (this.game.pause) {
              this.game.sellJewels();
            } else {
              this.game.pause = 'shop';
            }
          }
          if (this.x === 560) {
            if (this.game.pause) {
              this.game.refuel();
            } else {
              this.game.pause = 'fuel';
            }
          }
          if (this.x === 720) {
            if (!this.game.pause) {
              this.game.pause = 'upgrade';
            }
          }
        } else if (arrow === '1' && this.game.pause === 'upgrade') {
          this.game.attemptUpgradeFuel();
        } else if (arrow === '2' && this.game.pause === 'upgrade') {
          this.game.attemptUpgradeBag();
        }
    }
}