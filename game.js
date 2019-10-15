class Game {
  constructor(canvas, width, height) {
        canvas.width = width;
        canvas.height = height;
        this.width = width;
        this.height = height;
        this.fuel = 10.9;
        this.fuelTankSize = 10.9;
        this.money = 0;
        this.ctx = canvas.getContext('2d'); // store context to draw something
        this.player = new Player(this.ctx, 40, 40, this.mine.bind(this)); // create a simple player
        this.blocks = {};
        this.depth = 0;
        this.timeout = '';
        this.pause = false;
        this.isMobile = true;
        this.bagSize = 10;
        this.inventoryFillColor = 'lime';
        this.gemValueMapper = {
          'diamond': 20,
          'gem': 100,
          'supergem': 250,
        }
    }
    
    play() {
        this.clear(); // clear the whole canvas to draw something new
        this.drawBackground();
        this.drawBlocks(); 
        this.drawInfoBar();
        this.drawFuel(); 
        this.drawMoney(); 
        this.fuel -= 0.002;
        const groundBlockY = Math.floor((this.player.y+this.depth + 40)/5) * 5;
        const isFalling = !this.blocks[[this.player.x, groundBlockY]];
        this.player.draw(isFalling); // update player on each tick
        if (this.player.y > 320) {
          const oldY = this.player.y;
          this.player.y = 320;
          this.depth += oldY-320;
        }
        if (!isFalling) {
          this.depth = Math.floor(this.depth / 40) * 40;
        }
        this.mineBlock();
        if (this.fuel <= 0) {
          this.gameOver()
        } 
        if (!this.pause) {
          requestAnimationFrame(this.play.bind(this)); // run play again ~60 times per sec
        } else {
          if (this.pause === 'shop') { this.drawJewelShop(); }
          if (this.pause === 'fuel') { this.drawGasShop(); }
          if (this.pause === 'upgrade') { this.drawUpgradeShop(); }
        }
    }

    drawRect(color, x, y, width, height) {
      this.ctx.beginPath();
      this.ctx.rect(x, y, width, height);
      this.ctx.fillStyle = color;
      this.ctx.fill();
    }

    drawText(font, color, text, x, y) {
      this.ctx.font = font;
      this.ctx.fillStyle = color;
      this.ctx.fillText(text, x, y);
    }
    
    gameOver() {
      this.player.kill();
      this.pause = 'gameOver';
      this.drawRect('#221E22', 100, 100, this.width-200, this.height-200);
      this.drawText('62px Impact', '#ECA72C', 'GAME OVER', 255, 230);
      this.drawText('40px Impact', '#393A10', 'You ran out of fuel', 237, 280);
      this.fuel = 10.9;
      this.fuelTankSize = 10.9;
      this.blocks = {};
      this.depth = 0;
      this.money = 0;
      this.timeout = '';
      this.isMobile = true;
      setTimeout(() => {
        this.pause = false;
        game.createBlockMap() // generate random block map
        game.play();
      }, 3000);
    }
    mine(direction) {
      if (!this.isMobile || this.pause) { return; }
      if (direction === 'left') {
        if ((this.blocks[[this.player.x-40, Math.floor((this.player.y+this.depth+30)/40)*40]] || this.blocks[[this.player.x-40, Math.floor((this.player.y+this.depth)/40)*40]] ) && this.player.gravity !== 0) {
            return;
        }
        this.isMobile = false;
        this.timeout = setTimeout(() => {
          this.isMobile = true;
          this.player.x -= this.player.speed;
          this.player.y = Math.floor((this.player.y+30)/40)*40;
        }, 50);
      } else if (direction === 'right') {
        if ((this.blocks[[this.player.x+40, Math.floor((this.player.y+this.depth+30)/40)*40]] || this.blocks[[this.player.x+40, Math.floor((this.player.y+this.depth)/40)*40]] ) && this.player.gravity !== 0) {
            return;
        }
        this.isMobile = false;
        this.timeout = setTimeout(() => {
          this.isMobile = true;
          this.player.x += this.player.speed;
          this.player.y = Math.floor((this.player.y+30)/40)*40;
        }, 50);
      } else if (direction === 'up') {
        if (this.blocks[[this.player.x, Math.floor((this.player.y+this.depth-40)/40)*40]]) {
          this.player.y = Math.floor((this.player.y)/40)*40;
          this.player.gravity = 0.05;
          return;
        }
        if (this.player.y <200 && this.depth > 5) {
          this.depth -= 40;
        } else if (this.player.y > 0){
          this.player.y -= this.player.speed;
        }
        this.fuel -= 0.02;
        this.player.gravity = 0.05;
      } else if (direction === 'down') {
        this.isMobile = false;
        this.timeout = setTimeout(() => {
          this.isMobile = true;
          if (this.player.gravity > 0) {
            this.player.gravity = Math.max(6, this.player.gravity);
            return;
          }
          if (this.player.y > 280) {
            this.depth += 40;
          } else {
            this.player.y += this.player.speed;
          }
        }, 50);
      }
    }
    mineBlock() {
      if (this.blocks[[this.player.x, this.player.y+this.depth]]) {
        this.player.addItem(this.blocks[[this.player.x,this.player.y+this.depth]].type);
        this.fuel -= 0.1;
        this.blocks[[this.player.x, this.player.y+this.depth]] = null;
      }
    }

    drawFuel() {
      this.drawText('26px Impact', 'lime', `Fuel: ${Math.floor(this.fuel)}L`, 10, 30);
    }

    drawInventory() {
      this.drawText('26px Impact', this.inventoryFillColor, `Inventory: ${this.player.itemCount*(100/this.bagSize)}%`, 300, 30);
    }
    flashFullInventory() {
        this.inventoryFillColor = 'red';
        setTimeout(() => {
          this.inventoryFillColor = 'lime';
        }, 1200);
    }

    drawMoney() {
      this.drawText('26px Impact', 'lime', `Money: ${Math.floor(this.money)}`, 660, 30);
    }

    drawBackground() {
        this.drawRect('darkslategray', 0, Math.max(200 - this.depth, 0), this.width, this.height);
        this.drawRect('aquamarine', 0, 0, this.width, 200 - this.depth);
        // Jewel Shop
        this.drawRect('purple', 380, 110 - this.depth, 80, 90);
        this.drawText('21px Impact', 'black', `Sell`, 403, 145 - this.depth);
        // Fuel Shop
        this.drawRect('green', 540, 110 - this.depth, 80, 90);
        this.drawText('21px Impact', 'black', `Gas`, 564, 145 - this.depth);
        // Upgrade Shop
        this.drawRect('maroon', 700, 110 - this.depth, 80, 90);
        this.drawText('21px Impact', 'black', `Shop`, 719, 145 - this.depth);
      }
      
    drawJewelShop() {
      this.drawRect('#221E22', 100, 100, this.width-200, this.height-200);
      this.drawText('26px Impact', '#ECA72C', `Welcome to the shop!`, 130, 130);
      let numGemTypes = Object.keys(this.player.inventory).length;
      this.inventoryTotal = 0;
      if (numGemTypes > 0) {
        this.drawText('18px Impact', '#ECA72C', `Want to sell the following items from your bag?  ( hit 'enter' )`, 130, 165);
        Object.entries(this.player.inventory).forEach((item, idx) => {
          let itemValue = this.gemValueMapper[item[0]]*item[1];
          this.inventoryTotal += itemValue;
          this.drawText('20px Impact', '#EE5622', `${item[0]}    X    ${item[1]}    =   $${itemValue}`, 130, 195 + 30*idx);
        })
        this.drawRect('#EE5622', 130, 180 + 30*numGemTypes, 400, 5);
        this.drawText('20px Impact', '#EE5622', `Total:       $${this.inventoryTotal}`, 130, 214 + 30*numGemTypes);
      } else {
        this.drawText('18px Impact', '#EE5622', `You have no mined jewels in your bag!`, 130, 165);
        this.drawText('18px Impact', '#EE5622', `Go out and mine then come back to sell your items!`, 130, 195);
      }
    }
    
    drawUpgradeShop() {
      this.drawRect('maroon', 100, 100, this.width-200, this.height-200);
      this.ctx.textAlign = 'center';
      this.drawText('26px Impact', 'black', `Welcome to the Upgrade Shop!`, 400, 145);
      this.drawRect('orange', 130, 170, 250, 200);
      this.drawText('26px Impact', 'black', `Fuel Tank Size: ${Math.floor(this.fuelTankSize)}L`, 255, 200);
      this.drawText('26px Impact', 'black', `Double for ${Math.floor(this.fuelTankSize)*100}$?`, 255, 240);
      this.drawText('26px Impact', 'black', `( hit '1' )`, 255, 270);
      this.drawRect('orange', 420, 170, 250, 200);
      this.drawText('26px Impact', 'black', `Bag Size: ${this.bagSize}`, 545, 200);
      this.drawText('26px Impact', 'black', `Double for ${this.bagSize*150}$?`, 545, 240);
      this.drawText('26px Impact', 'black', `( hit '2' )`, 545, 270);
      this.ctx.textAlign = 'left';
    }
    attemptUpgradeFuel() {
      this.ctx.textAlign = 'center';
      if (this.money >= Math.floor(this.fuelTankSize)*100) {
        this.money -= Math.floor(this.fuelTankSize)*100;
        this.fuelTankSize = Math.floor(this.fuelTankSize)*2+0.9;
        this.fuel = this.fuelTankSize;
        this.drawText('26px Impact', 'green', `Upgraded!`, 255, 320);
        this.ctx.textAlign = 'left';
        this.drawInfoBar();
      } else {
        this.drawText('26px Impact', 'red', `You can't afford that!`, 255, 320);
        this.ctx.textAlign = 'left';
      }
    }
    attemptUpgradeBag() {
      this.ctx.textAlign = 'center';
      if (this.money >= this.bagSize*150) {
        this.money -= this.bagSize*150;
        this.bagSize *= 2; 
        this.drawText('26px Impact', 'green', `Upgraded!`, 545, 320);
        this.ctx.textAlign = 'left';
        this.drawInfoBar();
      } else {
        this.drawText('26px Impact', 'red', `You can't afford that!`, 545, 320);
        this.ctx.textAlign = 'left';
      }
    }
    drawGasShop() {
      this.drawRect('#89BD9E', 100, 100, this.width-200, this.height-200);
      this.drawText('26px Impact', '#8B1E3F', `Welcome to the Gas Station!`, 120, 130);
      let fuelUsed = (this.fuelTankSize - this.fuel).toFixed(1);
      this.drawText('20px Impact', '#221E22', `You require ${fuelUsed}L which will cost you $${((fuelUsed)*50).toFixed()}`, 130, 195);
      this.drawText('20px Impact', '#221E22', `Want to refuel?  ( hit 'enter' )`, 130, 165);
    }
    
    sellJewels() {
      if (this.inventoryTotal > 0) {
        this.money += this.inventoryTotal;
        this.inventoryTotal = 0;
        this.player.inventory = {};
        this.player.itemCount = 0;
        this.drawRect('#221E22', 100, 170, this.width-200, this.height-340);
        this.drawText('30px Impact', 'lime', `$ Sold! $`, 130, 230);
        this.drawInfoBar();
      }
    }
    
    refuel() {
      let fuelCost = +((this.fuelTankSize - this.fuel).toFixed(1)*50).toFixed();
      if (this.money >= fuelCost) {
        this.money -= fuelCost;
        this.fuel = this.fuelTankSize;
        this.drawText('30px Impact', '#393A10', `~ Refueled! ~`, 130, 230);
      } else if (this.money >= 10){
        console.log((this.money/100).toFixed(1));
        this.fuel += +(this.money/100).toFixed(1);
        this.ctx.font = '30px Impact';
        this.ctx.fillStyle = '#8B1E3F';
        this.drawText('30px Impact', '#8B1E3F', `~ You can't afford a full refill right now! ~`, 130, 230);
        this.drawText('30px Impact', '#8B1E3F', `~ Here's ${(this.money/100).toFixed(1)}L for all your money ~`, 130, 260);
        this.money = 0;
      } else {
        this.ctx.font = '30px Impact';
        this.ctx.fillStyle = '#8B1E3F';
        this.drawText('30px Impact', '#8B1E3F', `~ You can't afford anything right now! ~`, 130, 230);
        this.drawText('30px Impact', '#8B1E3F', `~ Byeee ~`, 130, 260);
      }
      this.drawInfoBar();
    }

    drawInfoBar() {
      this.drawRect('black', 0, 0, this.width, 40);
      this.drawFuel(); 
      this.drawInventory(); 
      this.drawMoney(); 
    }
    
    drawBlocks() {
      for (let x = 0; x < this.width; x += 40) {
        for (let y = 200; y < this.height+this.depth; y += 40) {
          if (this.blocks[[x, y]]) {
            this.blocks[[x, y]].draw(this.depth);
          }
        }
      }
    }
    
    createBlockMap() {
      for (let x = 0; x < this.width; x += 40) {
        for (let y = 200; y < this.height+5000; y += 40) {
        const randomType = Math.floor(Math.random()*100);
        let type = 'dirt';
        if (randomType < 1) {
          type = 'supergem';
        } else if (randomType < 4) {
          type = 'gem'
        } else if (randomType < 12) {
          type = 'diamond'
        }
        let block = new Block(this.ctx, x, y, type);
        this.blocks[[x, y]] = block;
        }
      }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height); // just clear the whole game area
    }
}

const game = new Game(document.getElementsByTagName('canvas')[0], 800, 520); // create an instance of the game
game.createBlockMap(); // generate random block map
game.player.sendGame(game); // generate random block map
game.play(); // start it