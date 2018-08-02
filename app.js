var game = new Phaser.Game(800, 546, Phaser.AUTO, '', {
    canvas: 'gameContent'
});


var scores = 0;
var isFirst = true;
var state;
var menu = function (game) {};
menu.prototype = {
    preload: function () {
        this.game.load.spritesheet('button', 'images/button.png', 140, 50);
    },
    create: function () {
        var scoreText = this.game.add.text(50, 20, "Scores: " + scores, {
            align: 'left',
            fontSize: '25px',
            fill: 'white',
        });
        var button = this.game.add.button(game.world.centerX, game.world.centerY, 'button', clickHandler, this, 0, 1, 2);
        button.anchor.set(0.5);
        var buttonText = this.game.add.text(game.world.centerX, game.world.centerY, isFirst ? 'Play' : 'Replay', {
            align: 'center',
            fontSize: '25px',
            fill: 'white',
        });
        buttonText.anchor.set(0.5);

        function clickHandler() {
            console.log('click');
            state = states.idle;
            isFirst = false;
            scores = 0;
            this.game.state.start('ingame');
        }
    }
}


var states = {
    menu: 'menu',
    replay: 'replay',
    idle: 'idle',
    press: 'press',
    pressing: 'pressing',
    release: 'release',
    releasing: 'releasing',
    released: 'released',
    replay: 'replay',
    result: 'result',
    scores: 'scores',
    exit: 'exit',
}

var maxHeight;
var waterX = 248;
var waterMaskWidth = 150;
var waterMaskHeight;
var waterMaskY;
var waterMaskX = 422;

var glassWaterHeight = 0;
var glassWaterHeightMin = 455;
var glassWaterHeightMax =  232;

var speed = 100;
var leftMax = 0;
var rightMax = 0;
var sideSpeed = 20;
var sideDirection = - 1;
var sideLeftX = 0;
var sideRightX = 0;


var glassAngleMin = 0.3;
var glassAngleMax = 1.5;
var glassAnchorX = 0.95;
var glassAnchorY = 0;
var glassX = 685 - 12;
var glassY = 173;
var glassY1 = 186;

var mainMaskX = 422;
var mainMaskY = 232;

var tankWaterMin = 540;
var tankWaterMax = 540;

var lineMax = 430;
var lineCurrent = 0;
var heightCurrent = 0;
var lineMin = 510;

var lines = [];

function Tank() {
    var tank;
    return tank;
}
var boot = function (game) {}
boot.prototype = {
    preload: function () {
        this.game.load.image('bar', 'images/preloadBar.png');
    },
    create: function () {
        game.state.start('preloader');
    }
}


var preloader = function (game) {}
preloader.prototype = {
    preload: function () {
        var bgmd = this.game.make.bitmapData(game.widh, 15);
        bgmd.context.fillStyle = '#ffa00f';
        bgmd.context.fillRect(0, 0, game.width, 15);
        this.bg = this.game.add.sprite(0, this.game.height - 15, bgmd);

        this.load.setPreloadSprite(this.bg);

        this.game.load.image('london', 'images/london.png');
        this.game.load.image('london_bg', 'images/bg_london.png');
        this.game.load.image('mainMask', 'images/glassMainMask.png');
        this.game.load.image('mask1', 'images/glass1mask.png');
        this.game.load.atlas('glasses', 'images/glasses.png', 'images/glassesOut.json');
        this.game.load.image('glass_back', 'images/glassMain.png');
        this.game.load.image('glass_mask', 'images/glassMainMask.png');
        this.game.load.image('glass_cover', 'images/glass_cover.png');
        this.game.load.image('water', 'images/water.png');
        this.game.load.image('flow1', 'images/flow1.png');
        this.game.load.image('bottle', 'images/bottle.png');
        this.game.load.image('flow2', 'images/flow2.png');
        this.game.load.image('rect_glass_back', 'images/rect_glass_back.png');
        this.game.load.image('triang_glass_out', 'images/triangOut.png');
        this.game.load.image('rect_glass_cover', 'images/rect_glass_cover.png');
        this.game.load.image('line', 'images/dotted_line.png');
        this.game.load.image('bubble', 'images/bubble.png');

        this.game.load.json('grad');

        this.game.load.onLoadComplete.add(function (progress, file, success, t, t1) {
            game.state.start('menu');
        })
    },
}

var ingame = function (game) {}
ingame.prototype = {
    preload: function () {
        if (!state) {
            state = states.idle;
        }
    },
    create: function () {
        window.self = this;
        this.game.stage.backgroundColor = 25000
        this.grad = this.game.cache.getJSON('grad');
        this.back = this.game.add.sprite(0,0, 'london');
        this.back.x = 0;
        this.back.y = 0;

        //this.back.visible = false;

        this.scoreText = this.game.add.text(50, 20, "Scores: " + scores, {
            align: 'left',
            fontSize: '25px',
            fill: 'white',
        });
        this.graphics = null;
        this.glassGroup = this.game.add.group();
        this.glass = this.game.add.sprite(0, 0, 'glass_back');

        //this.glass.scale.set(0.30);
        this.glass.anchor.y = 1;
        this.glass.x = 420;
        this.glass.y = 500;


        this.water = this.game.add.graphics(0, 0);
        this.water.beginFill(0xffbf00);
        this.water.drawRect(0, 0, waterMaskWidth, this.grad.mainMask.grad.length);
        this.water.endFill();
        this.water.x = waterMaskX;
        this.water.y = glassWaterHeightMin;
        this.water.parent.setChildIndex(this.water, 1);

        this.bottle = this.game.add.sprite(0, 0, 'bottle');
        window.bottle = this.bottle;
        this.bottle.x = 0;
        this.bottle.y = -80;

        this.flow1 = this.game.add.group();
        this.flow1.addChild(this.bottle);
        this.flow1.visible = false;

        this.flow2 = this.game.add.sprite(0, 0, 'flow2');
        this.flow2.x = 658;
        this.flow2.y = 170;
        this.flow2.visible = false;

        /*    this.waterMaskMove = this.game.add.graphics(0, 0);
           this.waterMaskMove.beginFill(0xffffff);
           this.waterMaskMove.drawRect(0, 0, waterMaskWidth, waterMaskHeight);
           this.waterMaskMove.x = waterMaskX;
           this.waterMaskMove.y = waterMaskY; */

        //this.water.mask = this.waterGlassMask;
        this.glassGroup.addChild(this.glass);


        maxHeight = this.glass.height;


        this.tankWater = this.game.add.graphics(0, 0);
        this.tankWater.beginFill(0xffbf00);
        this.tankWater.drawRect(0, 0, 155, 220);
        this.tankWater.endFill();
        this.tankWater.x = 600;
        this.tankWater.y = 600;
        this.tankWater.parent.setChildIndex(this.tankWater, 2);



        this.line = this.game.add.sprite(678, 0, 'line');
        this.line.anchor.set(0.5);
        this.line.scale.set(0.5);
        this.line;

        this.emitter = this.game.add.emitter(150,150, 150);
        this.emitter.gravity = 50;
        this.emitter.makeParticles('bubble');


        this.tanksProps = [];
        this.tank = this.game.add.image(680, 500, 'glasses', 'glass1');
        this.tank.anchor.setTo(0.5, 1);
        //this.tankMask = this.game.add.image(680, 500, 'glasses', 'glass1mask');
        this.initTanks();
        this.changeTank();
        this.game.input.onDown.add(function () {
            switch (state) {
                case states.idle:
                    state = states.pressing;
                    leftMax = (Math.random() * 20) >> 0;
                    rightMax = (Math.random() * 20) >> 0;
                    sideSpeed = (Math.random() * 20) >> 0;

                    glassWaterHeight = glassWaterHeightMin;
                    this.flow1.visible = true;
                    break;
                default:
                    return;
            }
        }, this);
        this.game.input.onUp.add(function () {
            switch (state) {
                case states.pressing:
                    state = states.release;
                    this.flow1.visible = false;
                    break;
                default:
                    return;
            }
        }, this);


        //heightCurrent = Math.floor(Math.random() * (lineMin - lineMax));
        //lineCurrent = heightCurrent + lineMax;


    },
    update: function () {
        if (state == states.pressing) {
            var dt = this.game.time.elapsedMS;
            glassWaterHeight -= dt * speed / 1000;
            if (glassWaterHeight >= glassWaterHeightMax) {
                this.water.y = glassWaterHeight;
            } else {
                state = states.release;
                this.flow1.visible = false;
            }
        } else if (state === states.release) {
            state = states.releasing;
        //    var fill = Phaser.Math.clamp( 1 - (glassWaterHeight - glassWaterHeightMax) / (glassWaterHeightMin - glassWaterHeightMax), 0.1, 1);
            var fill = Phaser.Math.clamp(glassWaterHeightMin - glassWaterHeight, 0, glassWaterHeightMin - glassWaterHeightMax - 1) >> 0;
            var sfill = this.grad.mainMask.grad[fill][2];
            var fillProc = this.grad.mainMask.grad[fill][3];
            var result = this.calcResult(sfill);
            //this.tank.resultH(fill);

            if (result.result === 0) {
                scores++;
            }
            console.log(result);
            console.log(fill);

            this.water.y = glassWaterHeightMin;
            this.glass.anchor.set(glassAnchorX, glassAnchorY);
            this.glass.x = glassX;
            this.glass.y = glassY;
            this.flow2.visible = true;

            this.glass.rotation = Phaser.Math.linear(glassAngleMin, glassAngleMax, 1 - fillProc);
            //this.drawPolygon(this.glass.rotation);


            var t = this.game.add.tween(this.glass).to({
                rotation: glassAngleMax,
                y: glassY1
            }, 3000 * fillProc, "Linear");
            t.onUpdateCallback(function (tween, value, tweenData) {
                this.drawPolygon(tween.target.rotation);
            }, this);
            t.onComplete.add(function () {
                this.drawPolygon(Math.min(glassAngleMax, glassAngleMax * fillProc), true);
                this.flow2.visible = false;
                this.flow1.visible = false;
                if (result.result === 0) {
                    state = states.released;
                } else {
                    state = states.menu;
                    this.glass.visible = false;
                }


            }, this);
            t.start();

            var tankY = this.tanksProps[this.tankIdx].y;
            var tankX = this.tanksProps[this.tankIdx].x;
            var tankHeight = this.tanksProps[this.tankIdx].height
            this.tankWater.y = tankY + tankHeight;
                        //            var yMax = Math.max(600, tankWaterMax * fill)

            //var yMax = Phaser.Math.clamp((1 - result.fill) * (tankWaterMin - tankWaterMax) + tankWaterMax, tankWaterMax, tankWaterMin);
            yMax = this.tankWater.y - result.fill;
            var time = result.result == 1 ? 2000 * fillProc / result.fillProc : 3000 * fillProc;
            var t2 = this.game.add.tween(this.tankWater).to({
                y: yMax
            }, time, "Linear");
            t2.onUpdateCallback(function (tween, value, tweenData) {
                var y = tween.target.y;
            }, this);
            t2.onComplete.add(function () {
                if (result.result == 1) {
                    this.startEmit(tankX + 70, tankY - 5, 80);
                }
            }, this);
            t2.start();

        } else if (state == states.released) {
            state = states.scores;
        } else if (state == states.scores) {
            this.glass.anchor.set(0, 1);
            //this.glass.anchor.y = 1;
            this.glass.x = 420;
            this.glass.y = 500;
            this.glass.rotation = 0;
            this.glass.visible = true;
            this.tankWater.y = tankWaterMin;
            state = states.idle;
            this.scoreText.text = 'Scores: ' + scores;
            this.changeTank();
        } else if (state == states.menu) {
            state = states.menuAnimation
            var self =  this;
            setTimeout(function(){
                self.drawBg();
                this.game.state.start('menu');
            }, 1000)
        }
    },
    render: function () {
        //lines.forEach(line => game.debug.geom(line));
    },
    getCurrentLine: function () {
        var props = this.tanksProps[this.tankIdx];
        lineCurrent = Phaser.Math.linear(0.6 * props.height, 0.85 * props.height, Math.random());
    },
    calcResult: function (S) {
       var _frameName = this.tank.frameName;
       var gradName = 'mask' + _frameName.replace('glass', '');
       var grad = this.grad[gradName]; // [0 - полщадь в слоеб 1 - площадо слоя/ общая площадь, 2 - суммарная площадь на текущем слое, 3 - площадь до высоты / общую площадь]
       var h = 0;
       var proc = 0;
       var res = -1;
       if (grad.S < S) {
           h = grad.grad.length;
           proc = S / grad.S;
           res = 1;
       } else {
           for(var i = 0; grad.grad.length; i++) {
              if (grad.grad[i][2] < S) {
                continue;
              } else {
                  h = i;
                  proc = grad.grad[i][3];
                  break;
              }
           }
       }

      if (h >= lineCurrent && h < grad.grad.length) {
          res = 0;
      }

       return {
           fill: h,
           fillProc: proc,
           result: res,
       };
    },
    rectResult: function (props, fill) {
        var s = props.width;
        var S0 = waterMaskWidth;
        var fillRes = fill * S0 / s;
        var h = props.height;
        var y = props.minWater
        var bottom = y;
        var d = (bottom - lineCurrent) / h;
        var result = {
            fill: fillRes
        }
        if (fillRes < d) {
            result.result = -1;
        } else if (fillRes >= d && fillRes <= 1) {
            result.result = 0;
        } else {
            result.result = 1;
        }
        return result;
    },
    triangOutResult: function (props, fill) {
        var St = props.height * (props.width + props.widthTop);
        var S = waterMaskWidth * waterMaskHeight;
        var ft = S * fill / St;
        var tg = Math.abs(props.width + props.widthTop) / (2 * props.height);
        var S1 = St * ft;
        var xs = solverSqrt(tg, props.width, -S1);

        var fillRes = xs[0] / props.height;
        var h = props.height;
        var y = props.minWater
        var bottom = y;
        var d = (bottom - lineCurrent) / h;
        var result = {
            fill: fillRes
        }
        if (fillRes < d) {
            result.result = -1;
        } else if (fillRes >= d && fillRes <= 1) {
            result.result = 0;
        } else {
            result.result = 1;
        }
        return result;
    },

    initTanks: function () {
        this.tanksProps = [];
        var props1 = {
            height: this.grad['mask1'].grad.length,
            y: 237,
            x: 610,
            minWater: 527,
            grad: this.grad['mask1'],
            name: 'glass1',
            bmd: 'bmd1',
        };
        this.tanksProps.push(props1);
        var props2 = {
            height: this.grad['mask2'].grad.length,
            y: 245,
            x: 607,
            minWater: 527,
            grad: this.grad['mask2'],
            name: 'glass2',
            bmd: 'bmd2',
        };
        this.tanksProps.push(props2);
        var props3 = {
            height: this.grad['mask3'].grad.length,
            y: 254,
            x: 614,
            minWater: 527,
            grad: this.grad['mask3'],
            name: 'glass3',
            bmd: 'bmd3',
        };
        this.tanksProps.push(props3);
        var props4 = {
            height: this.grad['mask4'].grad.length,
            y: 317,
            x: 610,
            minWater: 527,
            grad: this.grad['mask4'],
            name: 'glass4',
            bmd: 'bmd4',
        };
        this.tanksProps.push(props4);


        var bmdMask1 = this.game.make.bitmapData(this.game.width, this.game.height);
        bmdMask1.context.fillStyle = '#ffffff'
        bmdMask1.context.fillRect(0,0,game.width, game.height);

        var props = this.tanksProps[0];
        var x = props.x;
        var y = props.y;
        var alpha = new Phaser.Image(this.game, 0,0, 'glasses', 'glass1mask')
        var london = new Phaser.Image(this.game, 0,0, 'london');
        var mainMask = new Phaser.Image(this.game, 0, 0, 'mainMask');

        bmdMask1.copyRect(london, new Phaser.Rectangle(0,0, london.width, london.height), 0,0);
        bmdMask1.copyRect(mainMask, new Phaser.Rectangle(0, 0, mainMask.width, mainMask.height), mainMaskX, mainMaskY, 1, 'xor');
        bmdMask1.copyRect(alpha, new Phaser.Rectangle(0, 0, alpha.width, alpha.height), x, y, 1 , 'xor') ;

        this.game.cache.addBitmapData('bmd1', bmdMask1);

        var bmdMask2 = this.game.make.bitmapData(this.game.width, this.game.height);
        bmdMask2.context.fillStyle = '#ffffff'
        bmdMask2.context.fillRect(0,0,game.width, game.height);

        var props = this.tanksProps[1];
        var x = props.x;
        var y = props.y;
        var alpha = new Phaser.Image(this.game, 0,0, 'glasses', 'glass2mask')
        var london = new Phaser.Image(this.game, 0,0, 'london');
        var mainMask = new Phaser.Image(this.game, 0, 0, 'mainMask');

        bmdMask2.copyRect(london, new Phaser.Rectangle(0,0, london.width, london.height), 0,0);
        bmdMask2.copyRect(mainMask, new Phaser.Rectangle(0, 0, mainMask.width, mainMask.height), mainMaskX, mainMaskY, 1, 'xor') ;
        bmdMask2.copyRect(alpha, new Phaser.Rectangle(0, 0, alpha.width, alpha.height), x, y, 1 , 'xor') ;

        this.game.cache.addBitmapData('bmd2', bmdMask2);

        var bmdMask3 = this.game.make.bitmapData(this.game.width, this.game.height);
        bmdMask3.context.fillStyle = '#ffffff'
        bmdMask3.context.fillRect(0,0,game.width, game.height);

        var props = this.tanksProps[2];
        var x = props.x;
        var y = props.y;
        var alpha = new Phaser.Image(this.game, 0,0, 'glasses', 'glass3mask')
        var london = new Phaser.Image(this.game, 0,0, 'london');
        var mainMask = new Phaser.Image(this.game, 0, 0, 'mainMask');

        bmdMask3.copyRect(london, new Phaser.Rectangle(0,0, london.width, london.height), 0,0);
        bmdMask3.copyRect(mainMask, new Phaser.Rectangle(0, 0, mainMask.width, mainMask.height), mainMaskX, mainMaskY, 1, 'xor') ;
        bmdMask3.copyRect(alpha, new Phaser.Rectangle(0, 0, alpha.width, alpha.height), x, y, 1 , 'xor') ;

        this.game.cache.addBitmapData('bmd3', bmdMask3);

        var bmdMask4 = this.game.make.bitmapData(this.game.width, this.game.height);
        bmdMask4.context.fillStyle = '#ffffff'
        bmdMask4.context.fillRect(0,0,game.width, game.height);

        var props = this.tanksProps[3];
        var x = props.x;
        var y = props.y;
        var alpha = new Phaser.Image(this.game, 0,0, 'glasses', 'glass4mask')
        var london = new Phaser.Image(this.game, 0,0, 'london');
        var mainMask = new Phaser.Image(this.game, 0, 0, 'mainMask');

        bmdMask4.copyRect(london, new Phaser.Rectangle(0,0, london.width, london.height), 0,0);
        bmdMask4.copyRect(mainMask, new Phaser.Rectangle(0, 0, mainMask.width, mainMask.height), mainMaskX, mainMaskY, 1, 'xor') ;
        bmdMask4.copyRect(alpha, new Phaser.Rectangle(0, 0, alpha.width, alpha.height), x, y, 1 , 'xor') ;

        this.game.cache.addBitmapData('bmd4', bmdMask4);


    },
    startEmit: function (x, y, speed) {
        this.emitter.x = x;
        this.emitter.y = y;
        this.emitter.setXSpeed(-speed, speed)
        this.emitter.setYSpeed(15, -35);
        //this.emitter.particleDrag.set(-speed/10, -speed/15)

        this.emitter.start(false, 1000, 1, 1000)
//        this.emitter1.start(false, 1000, null, 1000)
    },
    drawMask: function (points) {
        if (!points) {
            return;
        }
        this.g = this.g || this.game.add.graphics(0, 0);
        var poly = new Phaser.Polygon(points);
        this.g.clear();
        this.g.beginFill(0xffffff);
        this.g.drawPolygon(poly.points);
        this.g.endFill();
    },
    drawSetMask: function (props) {
        tankWaterMin = props.minWater;
        tankWaterMax = tankWaterMin - props.height;
        this.tankWater.y = tankWaterMin;
    },
    changeTank: function (idx) {
        if (idx == undefined) {
            idx = (Math.random() * this.tanksProps.length) >> 0;
        }
        console.log(idx);
        this.tankIdx = idx;
        this.tank.frameName = "glass" + (idx + 1);
        var props = this.tanksProps[idx]
        this.drawBg(props);
        this.getCurrentLine();
        this.line.y = props.y + props.height - lineCurrent;
     },
     drawBg: function (props) {

        if (this.bg) {
            this.bg.parent.removeChild(this.bg);
        }
        if (!props) {
            this.bg = null;
            return;
        }
        var bmd = game.cache.getBitmapData(props.bmd);
        this.bg = this.game.add.sprite(0, 0, bmd);
        this.bg.parent.setChildIndex(this.bg, 3);

    },
    drawPolygon: function (a, end) {
        console.log(a);
        poly = new Phaser.Polygon();
        lines = [];
        this.glass.anchor.set(glassAnchorX, glassAnchorY);
        this.glass.x = glassX;
        //this.glass.y = glassY;
        var g = this.glass;
        a = a || 0.3
        g.rotation = a;

        var wt = 140;
        var wb = 104;
        var h = 219;
        var dw = (wt - wb) / 2 + 3;
        var gx = g.x - 3;
        var gy = g.y + 3;

        var line0 = new Phaser.Line().fromAngle(gx + 5, gy, g.rotation + Math.PI, 15);

        var line1_pre = new Phaser.Line(gx,gy, gx - dw + 5, gy + h);
        var angle1 = line1_pre.angle + a;
        var line1 = new Phaser.Line().fromAngle(gx, gy, angle1, line1_pre.length);

        var line2_pre = new Phaser.Line(gx, gy, gx - wb - 16, gy + h);
        var angle2 = line2_pre.angle + a;
        var line2_pre2 = new Phaser.Line().fromAngle(gx, gy, angle2, line2_pre.length);
        var line2 = new Phaser.Line(line1.end.x, line1.end.y, line2_pre2.end.x, line2_pre2.end.y);

        var line3_pre = new Phaser.Line().fromAngle(gx, gy, g.rotation + Math.PI, wt - 8);
        var line3_pre2 = new Phaser.Line(line2.end.x, line2.end.y, line3_pre.end.x, line3_pre.end.y);
        var line3_pre3 = new Phaser.Line().fromAngle(line0.end.x, line0.end.y, Math.PI, 500);

        var line3;
        var line4;
        var intersects = line3_pre3.intersects(line3_pre2);
        console.log(intersects);
        var isTriang = false;
        if (!intersects) {
            isTriang = true;
            intersects = line3_pre3.intersects(line2);
        }

        line3 = new Phaser.Line(line0.end.x, line0.end.y, intersects.x, intersects.y);
        line4 = new Phaser.Line(line2.end.x, line2.end.y, intersects.x, intersects.y);

        lines.push(line0); // верхний смещение влево
        lines.push(line1); // правый вниз
        lines.push(line2); // низ влево

        //lines.push(line3_pre3); // горизонтальный влево для пересечения
        lines.push(line3); // горизонтальный влево
        lines.push(line4); // левый вверх до пересечения

        if (isTriang) {
            poly.setTo([
                line0.start.x, line0.start.y,
                line1.end.x, line1.end.y,
                intersects.x, intersects.y,
                line0.end.x, line0.end.y
            ]);
        } else {
            poly.setTo([
                line0.start.x, line0.start.y,
                line1.end.x, line1.end.y,
                line2.end.x, line2.end.y,
                intersects.x, intersects.y,
                line0.end.x, line0.end.y
            ]);
        }

        this.graphics = this.graphics || this.game.add.graphics(0, 0);
        this.graphics.clear();
        if (!end) {
            this.graphics.beginFill(0xffbf00);
            this.graphics.drawPolygon(poly.points);
            this.graphics.endFill();
        }
    },
    createTank: function (props) {
        var tank = this.game.add.sprite(0, 0, props.name);
        tank.scale.set(props.scaleX, props.scaleY);
        tank.anchor.y = 1;
        tank.anchor.x = 0.5;
        tank.x = 660;
        tank.y = props.posY || 580;
        tank.maskProps = props;
        tank.points = props.points;

        return tank;
    }
}

var testGraph2 = function (game) {}
testGraph2.prototype = {
    preload: function () {
        this.game.load.image('bubble', 'images/bubble.png');
    },
    create: function () {
        window.self  = this;

        this.emitter = this.game.add.emitter(150,150, 150);
        this.emitter.gravity = 50;
        this.emitter.makeParticles('bubble');
        /* this.emitter.minAngle = Math.PI;
        this.emitter.maxAngle = 0;
        this.emitter.minSpeed = -50
        this.emitter.masSpeed = 50
 */

        this.emitter1 = this.game.add.emitter(150,150, 50);
        this.emitter1.gravity = -10;
        this.emitter1.makeParticles('bubble');
        this.emitter1.minAngle = Math.PI;
        this.emitter1.maxAngle = 0;
        this.emitter1.minSpeed = -50
        this.emitter1.masSpeed = 50



        /*this.emitter1 = this.game.add.emitter(150,150, 50);
        this.emitter1.gravity = 10;
        this.emitter1.makeParticles('bubble');

        this.minAngle = 0;
        this.maxAngle = 0;
        this.maxSpeed = 50;
        //this.emitter.setRotation(0, 0);
        /*this.emitter.setAlpha(0.1, 1, 1000);
        this.emitter.setScale(0.1, 1, 0.1, 1, 1000, Phaser.Easing.Sinusoidal.Out);
        this.emitter.start(false, 5000, 50);
        this.emitter.emitX = 300;*/
    },
    startEmit: function (x, y, speed) {
        this.emitter.x = x;
        this.emitter.y = y;
        this.emitter.setXSpeed(-speed, speed)
        this.emitter.setYSpeed(-5, -55);
        //this.emitter.particleDrag.set(-speed/10, -speed/15)

        this.emitter1.x = x;
        this.emitter1.y = y - 10;
        this.emitter1.minSpeed = -speed/4;
        this.emitter1.masSpeed = speed/4;
        //this.emitter1.particleDrag.set(-speed/10, -speed/15)

        this.emitter.start(false, 1000, 1, 1000)
//        this.emitter1.start(false, 1000, null, 1000)
    }
}

var testGraph = function (game) {}
testGraph.prototype = {
    preload: function () {
        this.game.load.image('mask1', 'prepareimage/glass1mask.png');
        this.game.load.image('mask2', 'prepareimage/glass2mask.png');
        this.game.load.image('mask3', 'prepareimage/glass3mask.png');
        this.game.load.image('mask4', 'prepareimage/glass4mask.png');
        this.game.load.image('mainMask', 'images/glassMainMask.png');
        this.game.load.image('london', 'images/bg_london.png');

        this.game.load.json('grad');
        this.game.load.atlas('alpha', 'images/glasses.png', 'images/glassesOut.json');
    },
    create: function () {
        window.self = this;
        var el = game.cache._cache.image["mainMask"].data;
        game.context.drawImage(el, 0,0, el.width, el.height);
        window.image = game.context.getImageData(0,0,el.width, el.height);
        var data = image.data;
        var Sfull = el.width * el.height;
        var S = 0;
        var Sgrad = [];
        for(let row = 0; row < el.height; row++) {
            Sgrad[row] = [0, 0];
            for(let col = 0; col < el.width; col++) {
                var idx = row * el.height + col;
                var px = [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
                var colorSum = px[0] + px[1] + px[2];
                if (colorSum > 0) {
                    S++;
                    Sgrad[row][0]++;
                }
            }
        }

        Sgrad = Sgrad.map(g => {
            g[1] = g[0] / S;
            return g;
        });
        let proc  = 0;
        let sum = 0;
        for(let i = 0; i < Sgrad.length; i++) {
            var gr = Sgrad[i];
            gr[2] = gr[0] + sum;
            sum = gr[2];
            gr[3] = gr[1] + proc;
            proc = gr[3];
        }
        console.log(S, Sfull, Sgrad);
        window.grad = {
            S: S,
            grad: Sgrad
        }
        window.sgrad = JSON.stringify(grad);
    }
}



function solverSqrt(a, b, c) {
    var D = b * b - 4 * a * c;
    if (D < 0) {
        console.log('D < 0');
        return false;
    }
    var x1 = (-b + Math.sqrt(D)) / (2 * a);
    var x2 = (-b - Math.sqrt(D)) / (2 * a);
    console.log(x1, x2);
    return [x1, x2];
}

function getSeg(R, h) {
    var a = 2 * Math.acos( (R-h) / R );
    var S = (R * R / 2) * (a - Math.sin(a));
    console.log(S, a) ;
    return  S;
}
function getElipseSegment(a, b, h) {
    var x0 = b - h;
    var y0 = (b / a) * Math.sqrt(2 * a * h - h * h);
    var S = a * b * Math.acos(x0 / a) - x0 * y0;
    console.log(S);
    return S;
}


game.state.add('boot', boot);
game.state.add('preloader', preloader);
game.state.add('menu', menu);
game.state.add('ingame', ingame);
game.state.add('testGraph', testGraph);
game.state.add('testGraph2', testGraph2);
game.state.start('boot');