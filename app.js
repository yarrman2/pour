var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
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
var glassWaterHeight = 0;
var glassWaterHeightMin = 734;
var glassWaterHeightMax = 495;
var waterX = 248;
var waterMaskX = 115;
var waterMaskY = 250;
var waterMaskWidth = 260;
var waterMaskHeight = 236
var speed = 100;
var leftMax = 0;
var rightMax = 0;
var sideSpeed = 20;
var sideDirection = -1;
var sideLeftX = 0;
var sideRightX = 0;


var glassAngleMin = 0.3;
var glassAngleMax = 1.77;
var glassAnchorX = 1;
var glassAnchorY = 0;
var glassX = 620;
var glassY = 200;


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


var ingame = function (game) {}
ingame.prototype = {
    preload: function () {
        this.game.load.image('glass_back', 'images/glass_back.png');
        this.game.load.image('glass_mask', 'images/glass_mask.png');
        this.game.load.image('glass_cover', 'images/glass_cover.png');
        this.game.load.image('water', 'images/water.png');
        this.game.load.image('flow1', 'images/flow1.png');
        this.game.load.image('bottle', 'images/bottle.png');
        this.game.load.image('flow2', 'images/flow2.png');
        this.game.load.image('rect_glass_back', 'images/rect_glass_back.png');
        this.game.load.image('triang_glass_out', 'images/triangOut.png');
        this.game.load.image('rect_glass_cover', 'images/rect_glass_cover.png');
        this.game.load.image('line', 'images/dotted_line.png');
    },
    create: function () {
        this.scoreText = this.game.add.text(50, 20, "Scores: " + scores, {
            align: 'left',
            fontSize: '25px',
            fill: 'white',
        });
        this.graphics = null;
        this.glassGroup = this.game.add.group();
        this.glass = this.game.add.sprite(0, 0, 'glass_back');
        this.glass.scale.set(0.30);
        this.glass.anchor.y = 1;
        this.glass.x = 100;
        this.glass.y = 580;

        this.water = this.game.add.sprite(0, 0, 'water');
        this.water.scale.set(0.35, 0.19)
        this.water.anchor.x = 0.5;
        this.water.anchor.y = 1;
        this.water.y = glassWaterHeightMin;
        this.water.x = waterX;
        this.waterMask = this.game.add.graphics(0, 0);
        this.waterMask.beginFill(0xffffff);
        this.waterMask.drawRect(0, 0, waterMaskWidth, waterMaskHeight);
        this.waterMask.x = waterMaskX;
        this.waterMask.y = waterMaskY;


        this.flow = this.game.add.sprite(0, 0, 'flow1');
        this.flow.x = 190;
        this.flow.y = 120;
        this.flow.scale.y = 0.7;

        this.bottle = this.game.add.sprite(0, 0, 'bottle');
        window.bottle = this.bottle;
        this.bottle.x = 235;
        this.bottle.y = 145;
        this.bottle.rotation = 2.5;
        this.bottle.anchor.set(0.5, 0);
        this.bottle.scale.set(0.25);

        this.flow1 = this.game.add.group();
        this.flow1.addChild(this.flow);
        this.flow1.addChild(this.bottle);
        this.flow1.visible = false;

        this.flow2 = this.game.add.sprite(0, 0, 'flow2');
        this.flow2.x = 520;
        this.flow2.y = 140;
        this.flow2.scale.y = 0.7;
        this.flow2.visible = false;

        /*    this.waterMaskMove = this.game.add.graphics(0, 0);
           this.waterMaskMove.beginFill(0xffffff);
           this.waterMaskMove.drawRect(0, 0, waterMaskWidth, waterMaskHeight);
           this.waterMaskMove.x = waterMaskX;
           this.waterMaskMove.y = waterMaskY; */

        //this.water.mask = this.waterGlassMask;
        this.water.mask = this.waterMask;

        this.glassGroup.addChild(this.water);
        this.glassGroup.addChild(this.glass);


        maxHeight = this.glass.height;

        this.tankWater = this.game.add.sprite(0, 0, 'water');
        window.tankWater = this.tankWater;
        this.tankWater.scale.set(0.2, 0.19)
        this.tankWater.anchor.x = 0.5;
        this.tankWater.anchor.y = 0;
        this.tankWater.x = 650;
        this.g = null;

        this.line = this.game.add.sprite(655, 0, 'line');
        this.line.anchor.set(0.5);
        this.line.scale.set(0.5);
        window.line = this.line;

        this.tanks = [];
        this.initTanks();
        this.changeTank();
        this.game.input.onDown.add(function () {
            switch (state) {
                case states.idle:
                    state = states.pressing;
                    leftMax = (Math.random() * 20) >> 0;
                    rightMax = (Math.random() * 20) >> 0;
                    sideSpeed = (Math.random() * 20) >> 0;
                    sideLeftX = waterX - leftMax;
                    sideRightX = waterX + rightMax;
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
            var fill = 1 - (glassWaterHeight - glassWaterHeightMax) / (glassWaterHeightMin - glassWaterHeightMax);

            var result = this[this.tank.maskProps.func](this.tank.maskProps, fill);
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

            this.glass.rotation = Phaser.Math.linear(glassAngleMin, glassAngleMax, 1 - fill);
            //this.drawPolygon(this.glass.rotation);

            var t = this.game.add.tween(this.glass).to({
                rotation: glassAngleMax,
            }, 3000 * fill, "Linear");
            t.onUpdateCallback(function (tween, value, tweenData) {
                this.drawPolygon(tween.target.rotation);
            }, this);
            t.onComplete.add(function () {
                this.drawPolygon(Math.min(glassAngleMax, glassAngleMax * fill), true);
                this.flow2.visible = false;
                this.flow1.visible = false;
                if (result.result === 0) {
                    state = states.released;
                } else {
                    state = states.menu;
                }


            }, this);
            t.start();

            this.tankWater.y = tankWaterMin;
            //            var yMax = Math.max(600, tankWaterMax * fill)

            var yMax = Phaser.Math.clamp((1 - result.fill) * (tankWaterMin - tankWaterMax) + tankWaterMax, tankWaterMax, tankWaterMin);
            var t2 = this.game.add.tween(this.tankWater).to({
                y: yMax
            }, 3000 * fill, "Linear");
            t2.onUpdateCallback(function (tween, value, tweenData) {
                var y = tween.target.y;
            }, this);
            t2.onComplete.add(function () {

            }, this);
            t2.start();

        } else if (state == states.released) {
            state = states.scores;
        } else if (state == states.scores) {
            this.glass.anchor.set(0, 1);
            this.glass.x = 100;
            this.glass.y = 580;
            this.glass.rotation = 0;
            this.tankWater.y = tankWaterMin;
            state = states.idle;
            this.scoreText.text = 'Scores: ' + scores;
            this.changeTank();
        } else if (state == states.menu) {
            this.game.state.start('menu');
        }
    },
    render: function () {
        // lines.forEach(line => game.debug.geom(line));
    },
    getCurrentLine: function () {
        var props = this.tank.maskProps;
        var max = props.minWater - props.height;
        var minL = (max + props.height * 0.3) >> 0;
        var maxL = (max + props.height * 0.7) >> 0;
        lineCurrent = Phaser.Math.between(minL, maxL);
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
        /**
         * props1
         */

        var props1 = {
            x: 622,
            y: 405,
            width: 76,
            height: 185,
            minWater: 527,
            scaleX: 0.3,
            scaleY: 0.4,
            points: [],
            name: 'rect_glass_back',
            func: 'rectResult',
        };
        props1.points = [
            props1.x + props1.width, props1.minWater,
            props1.x + props1.width - props1.width, props1.minWater,
            props1.x + props1.width - props1.width, props1.minWater - props1.height,
            props1.x + props1.width, props1.minWater - props1.height,
        ];

        var tank1 = this.createTank(props1);
        this.tanks.push(tank1);

        /**
         * props1
         */

        var props2 = {
            x: 610,
            y: 405,
            width: 101,
            height: 185,
            minWater: 527,
            scaleX: 0.4,
            scaleY: 0.4,
            points: [],
            name: 'rect_glass_back',
            func: 'rectResult',
        };
        props2.points = [
            props2.x + props2.width, props2.minWater,
            props2.x + props2.width - props2.width, props2.minWater,
            props2.x + props2.width - props2.width, props2.minWater - props2.height,
            props2.x + props2.width, props2.minWater - props2.height,
        ];

        var tank2 = this.createTank(props2);
        this.tanks.push(tank2);
        /**
         * props3
         */

        var props3 = {
            x: 597,
            y: 405,
            width: 126,
            height: 185,
            minWater: 527,
            scaleX: 0.5,
            scaleY: 0.4,
            points: [],
            name: 'rect_glass_back',
            func: 'rectResult',
        };
        props3.points = [
            props3.x + props3.width, props3.minWater,
            props3.x + props3.width - props3.width, props3.minWater,
            props3.x + props3.width - props3.width, props3.minWater - props3.height,
            props3.x + props3.width, props3.minWater - props3.height,
        ];

        var tank3 = this.createTank(props3);
        this.tanks.push(tank3);

        /**
         * props4
         */

        var props4 = {
            x: 610,
            y: 435,
            posY: 610,
            width: 351 * 0.3,
            height: 634 * 0.3 ,//634,
            widthTop: 698 * 0.3,
            minWater: 540,
            scaleX: 0.3,
            scaleY: 0.3,
            points: [],
            name: 'triang_glass_out',
            func: 'triangOutResult',

        };
        props4.points = [
            props4.x + props4.width, props4.minWater,
            props4.x, props4.minWater,
            props4.x - (props4.widthTop - props4.width) / 2, props4.minWater - props4.height,
            props4.x + (props4.widthTop - (props4.width / 2)), props4.minWater - props4.height,
        ];

        var tank4 = this.createTank(props4);
        this.tanks.push(tank4);
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
        if (!idx) {
            idx = (Math.random() * this.tanks.length) >> 0;
        }
        console.log(idx);
        this.tanks.forEach(t => t.visible = false);
        this.tank = this.tanks[idx];
        this.tank.visible = true;
        this.drawMask(this.tank.points);
        this.drawSetMask(this.tank.maskProps);

        this.tankWater.mask = this.g;

        this.getCurrentLine();
        this.line.y = lineCurrent;
    },
    drawPolygon: function (a, end) {
        poly = new Phaser.Polygon();
        lines = [];
        var g = this.glass;
        a = a || 0.3
        g.rotation = a;
        var line0 = new Phaser.Line().fromAngle(g.x, g.y, g.rotation + Math.PI, 10);
        var line1 = new Phaser.Line().fromAngle(line0.end.x, line0.end.y, g.rotation + Math.PI / 2, waterMaskHeight);
        var line2 = new Phaser.Line().fromAngle(line1.end.x, line1.end.y, g.rotation + Math.PI, waterMaskWidth);
        var line4 = new Phaser.Line().fromAngle(line0.end.x, line0.end.y, g.rotation + Math.PI, 50);

        var line3Pre1 = new Phaser.Line().fromAngle(line2.end.x, line2.end.y, g.rotation - Math.PI / 2, 1000);
        var line3Pre2 = new Phaser.Line().fromAngle(line4.end.x, line4.end.y, Math.PI, 1000);
        var points3 = line3Pre1.intersects(line3Pre2);
        if (!points3) {
            points3 = line2.intersects(line3Pre2);
        }
        var triang = false;
        if (!points3) {
            points3 = line1.intersects(line3Pre2);
            triang = true;
        }
        var line3 = new Phaser.Line(line2.end.x, line2.end.y, points3.x, points3.y);
        var line5 = new Phaser.Line(points3.x, points3.y, line4.end.x, line4.end.y);

        //lines.push(line0);
        lines.push(line1);
        lines.push(line2);
        lines.push(line4);
        lines.push(line3Pre1);
        lines.push(line3Pre2);
        lines.push(line5);
        lines.push(line3);

        if (triang) {
            poly.setTo([
                new Phaser.Point(line1.start.x, line1.start.y),
                new Phaser.Point(line2.start.x, line2.start.y),
                new Phaser.Point(points3.x, points3.y),
            ]);
            console.log(poly.points);
        } else {
            poly.setTo([
                new Phaser.Point(line1.start.x, line1.start.y),
                new Phaser.Point(line2.start.x, line2.start.y),
                new Phaser.Point(line3.start.x, line3.start.y),
                new Phaser.Point(line5.start.x, line5.start.y),
                new Phaser.Point(line5.end.x, line5.end.y)
            ]);
        }
        this.graphics = this.graphics || this.game.add.graphics(0, 0);
        this.graphics.clear();
        if (!end) {
            this.graphics.beginFill(0x3bade2);
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

var testGraph = function (game) {}
testGraph.prototype = {
    create: function () {
        var group = this.add.group();
        var g1 = this.game.add.graphics();
        var poly = new Phaser.Polygon();
        g1.beginFill(0xFFFFFF, 1);
        group.addChild(g1);
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

game.state.add('menu', menu);
game.state.add('ingame', ingame);
game.state.add('testGraph', testGraph);
game.state.start('menu');