// 这是我们的玩家要躲避的敌人
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    this.x = -Math.round(Math.random() * 100) - 120;
    this.y = 60;
    this.speed = Math.ceil(Math.random() * 2) * 100;
    // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
    };

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
    Enemy.prototype.update = function(dt) {
        // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
        // 都是以同样的速度运行的
        if(this.x < 505){
            this.x += this.speed * dt;
        }else {
            this.x = -Math.round(Math.random() * 900) - 95;
            this.speed = Math.ceil(Math.random() * 7) * 100;
        }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function() {
    this.x = 203;
    this.y = 380;
    this.sprite = 'images/char-boy.png';
}

Player.prototype.update = function() {
    if(this.y === -35){
        setTimeout(function () {
            ale();
        },0)
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    const TILE_WIDTH = 101;
    const TILE_HEIGHT = 83;
    if(key === 'up' && this.y - TILE_HEIGHT >= -35){
        this.y -= TILE_HEIGHT;
    }else if(key === 'down' && this.y + TILE_HEIGHT <= 380) {
        this.y += TILE_HEIGHT;
    }else if(key === 'left' && this.x - TILE_WIDTH >= 1){
        this.x -= TILE_WIDTH;
    }else if(key === 'right' && this.x + TILE_WIDTH <= 405){
        this.x += TILE_WIDTH;
    }
    ctx.clearRect(0,0, 505, 606);  //清空画布
}

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面
let player = new Player();
let enemyA = new Enemy();
let enemyB = new Enemy();
let enemyC = new Enemy();
let enemyD = new Enemy();
let enemyE = new Enemy();
let enemyF = new Enemy();
enemyB.y = enemyE.y = 143;
enemyC.y = enemyF.y = 226;
const allEnemies = [enemyA,enemyB,enemyC];
const enemyArry = [enemyD,enemyE,enemyF];

//开始游戏后3s加入另外三个enemy
function waitCreatEnemy(){
    return new Promise(function (resolve) {
        window.setTimeout(function(){
            resolve();
        },3000)
    })
}

function addEnemy(){
    enemyArry.forEach(function (enemy) {
        allEnemies.push(enemy);
    })
}
waitCreatEnemy().then(addEnemy);

//通过游戏，弹窗
function ale() {
    alert("恭喜通过游戏！");
    player.x = 203;
    player.y = 380;
    ctx.clearRect(0,0, 505, 606);  //清空画布
}

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Player.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

