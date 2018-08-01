const fs = require('fs');
const path = require('path');
const h = require('handlebars');


var tplCss = fs.readFileSync('spritesmithtemplate.css.handlebars', 'utf-8');

var tpl = h.compile(tplCss);
/*var context = {sprites:[
    {
        name: 'Name 1',
        escaped_image: 'img_name',
        px:{
            offset_x: 0,
            offset_y: 0,
            width: 100,
            height: 100
        }
    }
]};*/


let fileIn = '';
let fileOut = '';
let cssOut = ''

if (process.argv.length >= 6) {
    let params = process.argv.slice(2)
    console.log(params);
    params.forEach((param, idx, all) => {
        switch (param) {
            case '-f':
                if (all[idx + 1]) {
                    fileIn = all[idx + 1];
                }
                break;
            case '-o':
                if (all[idx + 1]) {
                    fileOut = all[idx + 1];
                }
                break;
            case '-c':
            if (all[idx + 1]) {
                cssOut = all[idx + 1];
            }
            break;
        }
    })
} else {
    console.log(`
        Help
        command -f fileIn -o fileOut -c cssOut
    `);
    return;
}


const out = {
    frames: {}
};
const outCssData = {
    sprites: {}
};

let fileInPath = path.join(__dirname, fileIn);
fs.readFile(fileInPath, 'utf-8', function (err, contants) {
    if (err) {
        console.log(err);
        return;
    }
    let data = JSON.parse(contants);
    var frames = Object.entries(data.frames).reduce((acc, el) => {
        let = frame = el[1];
        let key = el[0];
        const obj = {
            frame: {
                x: frame.x,
                y: frame.y,
                w: frame.w,
                h: frame.h
            },
            spriteSourceSize: {
                x: frame.offX,
                y: frame.offY,
                w: frame.sourceW,
                h: frame.sourceH
            },
            sourceSize: {
                w: frame.w,
                h: frame.h
            },
            rotation: false,
            trimmed: false
        };

        acc.frames[key] = obj;
        objCss = {
            name: key,
            escaped_image: data.file,
            px: {
                offset_x: frame.x,
                offset_y: frame.y,
                width: frame.w,
                height: frame.h
            }
        }
        acc.sprites.push(objCss);
        return acc
    }, {frames: {}, sprites: []});

    out.frames = frames.frames;
    out.meta = {
        image: data.file,
        scale: 1
    }

    outCssData.sprites = frames.sprites;
    console.log(out)

    if (fileOut != '') {
        let fileOutPath = path.join(__dirname, fileOut);
        fs.writeFile(fileOutPath, JSON.stringify(out,false,2), err => console.log(err));
    }
    if (cssOut != '') {
        let outCssString = tpl(outCssData);
        let cssOutPath = path.join(__dirname, cssOut);
        fs.writeFile(cssOutPath, outCssString, err => console.log(err));
    }



})



return;
const data = {
    "file": "g2.png",
    "frames": {
        "glass_out": {
            "x": 0,
            "y": 0,
            "w": 265,
            "h": 459,
            "offX": 110,
            "offY": 18,
            "sourceW": 500,
            "sourceH": 500
        },
        "glass5": {
            "x": 267,
            "y": 0,
            "w": 152,
            "h": 185,
            "offX": 0,
            "offY": 0,
            "sourceW": 153,
            "sourceH": 185
        }
    }
};










console.log(out);