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


/* Engine.js
* 这个文件提供了游戏循环玩耍的功能（更新敌人和渲染）
 * 在屏幕上画出初始的游戏面板，然后调用玩家和敌人对象的 update / render 函数（在 app.js 中定义的）
 *
 * 一个游戏引擎的工作过程就是不停的绘制整个游戏屏幕，和小时候你们做的 flipbook 有点像。当
 * 玩家在屏幕上移动的时候，看上去就是图片在移动或者被重绘。但这都是表面现象。实际上是整个屏幕
 * 被重绘导致这样的动画产生的假象

 * 这个引擎使画布的上下文(CTX)对象全局可用，从而使编写app.js更加简单。
 */

var Engine = (function(global) {
    /* 实现定义我们会在这个作用于用到的变量
     * 创建 canvas 元素，拿到对应的 2D 上下文
     * 设置 canvas 元素的高/宽 然后添加到dom中
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* 这个函数是整个游戏的主入口，负责适当的调用 update / render 函数 */
    function main() {
        /* 如果你想要更平滑的动画过度就需要获取时间间隙。因为每个人的电脑处理指令的
         * 速度是不一样的，我们需要一个对每个人都一样的常数（而不管他们的电脑有多快）
         * 就问你屌不屌！
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* 调用我们的 update / render 函数， 传递事件间隙给 update 函数因为这样
         * 可以使动画更加顺畅。
         */
        update(dt);
        render();

        /* 设置我们的 lastTime 变量，它会被用来决定 main 函数下次被调用的事件。 */
        lastTime = now;

        /* 在浏览准备好调用重绘下一个帧的时候，用浏览器的 requestAnimationFrame 函数
         * 来调用这个函数
         */
        win.requestAnimationFrame(main);
    }

    /* 这个函数调用一些初始化工作，特别是设置游戏必须的 lastTime 变量，这些工作只用
     * 做一次就够了
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* 这个函数被 main 函数（我们的游戏主循环）调用，它本身调用所有的需要更新游戏角色
     * 数据的函数，取决于你怎样实现碰撞检测（意思是如何检测两个角色占据了同一个位置，
     * 比如你的角色死的时候），你可能需要在这里调用一个额外的函数。现在我们已经把这里
     * 注释了，你可以在这里实现，也可以在 app.js 对应的角色类里面实现。
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /* 这个函数会遍历在 app.js 定义的存放所有敌人实例的数组，并且调用他们的 update()
     * 函数，然后，它会调用玩家对象的 update 方法，最后这个函数被 update 函数调用。
     * 这些更新函数应该只聚焦于更新和对象相关的数据/属性。把重绘的工作交给 render 函数。
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }
    //player于enemy碰撞后重置player位置
    function checkCollisions() {
        allEnemies.forEach((function (enemy) {
            //console.log(enemy.y + 12);
            if(enemy.y - 12 === player.y && enemy.x + 50 >= player.x && player.x + 30 >= enemy.x){
                reset();
            }
        }))
    }

    /* 这个函数做了一些游戏的初始渲染，然后调用 renderEntities 函数。记住，这个函数
     * 在每个游戏的时间间隙都会被调用一次（或者说游戏引擎的每个循环），因为这就是游戏
     * 怎么工作的，他们就像是那种每一页上都画着不同画儿的书，快速翻动的时候就会出现是
     * 动画的幻觉，但是实际上，他们只是不停的在重绘整个屏幕。
     */
    function render() {
        /* 这个数组保存着游戏关卡的特有的行对应的图片相对路径。 */
        var rowImages = [
                'images/water-block.png',   // 这一行是河。
                'images/stone-block.png',   // 第一行石头
                'images/stone-block.png',   // 第二行石头
                'images/stone-block.png',   // 第三行石头
                'images/grass-block.png',   // 第一行草地
                'images/grass-block.png'    // 第二行草地
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* 便利我们上面定义的行和列，用 rowImages 数组，在各自的各个位置绘制正确的图片 */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* 这个 canvas 上下文的 drawImage 函数需要三个参数，第一个是需要绘制的图片
                 * 第二个和第三个分别是起始点的x和y坐标。我们用我们事先写好的资源管理工具来获取
                 * 我们需要的图片，这样我们可以享受缓存图片的好处，因为我们会反复的用到这些图片
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* 这个函数会在每个时间间隙被 render 函数调用。他的目的是分别调用你在 enemy 和 player
     * 对象中定义的 render 方法。
     */
    function renderEntities() {
        /* 遍历在 allEnemies 数组中存放的作于对象然后调用你事先定义的 render 函数 */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* 这个函数现在没干任何事，但是这会是一个好地方让你来处理游戏重置的逻辑。可能是一个
     * 从新开始游戏的按钮，也可以是一个游戏结束的画面，或者其它类似的设计。它只会被 init()
     * 函数调用一次。
     */
    function reset() {
       player.x = 203;
       player.y = 380;
    }

    /* 紧接着我们来加载我们知道的需要来绘制我们游戏关卡的图片。然后把 init 方法设置为回调函数。
     * 那么党这些图片都已经加载完毕的时候游戏就会开始。
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);

    /* 把 canvas 上下文对象绑定在 global 全局变量上（在浏览器运行的时候就是 window
     * 对象。从而开发者就可以在他们的app.js文件里面更容易的使用它。
     */
    global.ctx = ctx;
})(this);

/* Resources.js
 * 这是一个简单的图片加载工具。他简化了图片加载的过程从而这些图片可以在你的游戏里面使用。
 * 这个工具还包含一个缓存层从而当你试图加载同一张图片多次的时候可以重复使用缓存的图片
 */

(function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    /* 这是公开访问的图片加载函数, 它接受一个指向图片文件的字符串的数组或者是单个图片的
     * 路径字符串。然后再调用我们私有的图片加载函数。
     */
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            /* 如果开发者传进来一个图片数组，循环访问每个值，然后调用我们的图片加载器 */
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        } else {
            /* 如果开发者传进来的不是一个数组，那么就可以认为参数值是一个字符串，
             * 然后立即调用我们的图片加载器即可。
             */
            _load(urlOrArr);
        }
    }

    /* 这是我们私有的图片加载函数， 它会被公有的图片加载函数调用 */
    function _load(url) {
        if(resourceCache[url]) {
            /* 如果这个 URL 之前已经被加载了，那么它会被放进我们的资源缓存数组里面，
             * 然后直接返回那张图片即可。
             */
            return resourceCache[url];
        } else {
            /* 否则， 这个 URL 之前没被加载过而且在缓存里面不存在，那么我们得加载这张图片
             */
            var img = new Image();
            img.onload = function() {
                /* 一旦我们的图片已经被加载了，就把它放进我们的缓存，然后我们在开发者试图
                 * 在未来再次加载这个图片的时候我们就可以简单的返回即可。
                 */
                resourceCache[url] = img;
                /* 一旦我们的图片已经被加载和缓存，调用所有我们已经定义的回调函数。
                 */
                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };

            /* 将一开始的缓存值设置成 false 。在图片的 onload 事件回调被调用的时候会
             * 改变这个值。最后，将图片的 src 属性值设置成传进来的 URl 。
             */
            resourceCache[url] = false;
            img.src = url;
        }
    }

    /* 这个函数用来让开发者拿到他们已经加载的图片的引用。如果这个图片被缓存了，
     * 这个函数的作用和在那个 URL 上调用 load() 函数的作用一样。
     */
    function get(url) {
        return resourceCache[url];
    }

    /* 这个函数是否检查所有被请求加载的图片都已经被加载了。
     */
    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    /* 这个函数会在被请求的函数都被加载了这个事件的回调函数栈里面增加一个函数。*/
    function onReady(func) {
        readyCallbacks.push(func);
    }

    /* 这个对象通过创造一个公共的资源对象来定义公有的开发者可以访问的函数。*/
    window.Resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();
