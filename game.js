class Game {
    constructor(canvas, width, height) {
        canvas.width = width;
        canvas.height = height;
        this._width = width;
        this._height = height;
        this._ctx = canvas.getContext('2d'); // store context to draw something
        this._player = new Player(this._ctx, 40, 40, this._mineBlock.bind(this), this._changeDepth.bind(this)); // create a simple player
        this._blocks = {};
        this._depth = 0;
    }

    play() {
        this._clear(); // clear the whole canvas to draw something new
        this._drawBackground();
        this._drawBlocks(); 
        this._player.draw(); // update player on each tick

        requestAnimationFrame(this.play.bind(this)); // run play again ~60 times per sec
    }
    _mineBlock(x, y) {
      if (this._blocks[[x, y+this._depth]]) {
        this._player.addItem(this._blocks[[x,y+this._depth]]._type);
        this._blocks[[x, y+this._depth]] = null;
      }
    }
    _changeDepth(change) {
      this._depth += change;
      // console.log(this._depth)
    }

    // _playLose() {
    //     this._ctx.beginPath();
    //     this._ctx.font = '48px serif';
    //     this._ctx.fillStyle = 'red';
    //     this._ctx.fillText("You lose!", this._width / 2, this._height / 2);
    // }

    _drawBackground() {
        this._ctx.beginPath();
        this._ctx.rect(0, 0, this._width, this._height);
        this._ctx.stroke();
        this._ctx.beginPath();
        this._ctx.rect(0, Math.max(200 - this._depth, 0), this._width, this._height);
        this._ctx.fillStyle = 'black';
        this._ctx.fill();
        this._ctx.beginPath();
        this._ctx.rect(0, 0, this._width, 200 - this._depth);
        this._ctx.fillStyle = 'aquamarine';
        this._ctx.fill();
    }
    
    _drawBlocks() {
      for (let x = 0; x < this._width; x += 40) {
        for (let y = 200; y < this._height+this._depth; y += 40) {
          if (this._blocks[[x, y]]) {
            this._blocks[[x, y]].draw(this._depth);
          }
        }
      }
    }
    
    _createBlockMap() {
      for (let x = 0; x < this._width; x += 40) {
        for (let y = 200; y < this._height+5000; y += 40) {
        const randomType = Math.floor(Math.random()*100);
        let type = 'dirt';
        if (randomType < 1) {
          type = 'supergem';
        } else if (randomType < 5) {
          type = 'gem'
        } else if (randomType < 15) {
          type = 'diamond'
        }
        let block = new Block(this._ctx, x, y, type);
        this._blocks[[x, y]] = block;
        }
      }
    }

    _clear() {
        this._ctx.clearRect(0, 0, this._width, this._height); // just clear the whole game area
    }
}

const game = new Game(document.getElementsByTagName('canvas')[0], 800, 520); // create an instance of the game
game._createBlockMap() // generate random block map
game.play(); // start it
