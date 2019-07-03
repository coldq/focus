const { createCanvas, loadImage, Image } = require('canvas');
const QRCode = require('qrcode');

function type(any) {
    const typeStr = Object.prototype.toString.call(any);
    return typeStr.match(/^\[object (\S+)\]$/)[1];
}

/**
 * @param { Object } options setting
 * @param { Number } options.width   width
 * @param { Number } options.height  height
 * @param { Number } options.actions actions
 * @param { Object } options.output outputSetting
 */
class Painter {
    constructor(options) {
        const { width, height, actions = [], background } = options;
        this.validate(options);
        this.options = options;

        const canvas = createCanvas(width, height);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.exector = Promise.resolve();
        if (background) {
            actions.unshift({
                type: 'fill',
                x: 0,
                y: 0,
                w: width,
                h: height,
                background,
                index: -1
            });
        }
        this.startPaint(actions);
    }
    validate(options) {
        const { width, height, actions = [] } = options;
        if (!width || !height) {
            throw new Error('Cannot find "width" or "height" to draw');
        }
        if (type(width) !== 'Number') {
            throw new TypeError('width is not a number!');
        }
        if (type(height) !== 'Number') {
            throw new TypeError('height is not a number!');
        }
        if (type(actions) !== 'Array') {
            throw new TypeError('actions is not a Array!');
        }
        if (!actions.length) {
            throw new Error('No action to draw.');
        }
    }
    startPaint(actions) {
        const indexAry = [];
        const cache = {};
        // separate actions by index, index default 0
        actions.forEach(action => {
            if (type(action.index) !== 'Number') {
                action.index = 0;
            }
            if (cache[action.index]) {
                cache[action.index].push(action);
            } else {
                cache[action.index] = [action];
                indexAry.push(action.index);
            }
        });

        if (indexAry.length > 1) {
            indexAry.sort((a, b) => a - b);
        }
        indexAry.forEach(index => {
            this.exector = this.exector.then(() =>
                this.execQueue(cache[index])
            );
        });
    }
    execQueue(queue) {
        const asyncQueue = [],
            syncQueue = [];
        for (let i = 0; i < queue.length; i++) {
            if (queue[i].type === 'image' || queue[i].type === 'qrcode') {
                asyncQueue.push(this.execAsyncAction(queue[i]));
            } else {
                syncQueue.push(queue[i]);
            }
        }
        return Promise.all(asyncQueue).then(() => {
            syncQueue.forEach(this.execSyncAction.bind(this));
        });
    }
    /**
     * @param {String} action.type image qrcode
     */
    execAsyncAction(action) {
        if (action.type === 'image') {
            return this.drawImage(action);
        } else if (action.type === 'qrcode') {
            return this.drawQrcode(action);
        }
        throw new Error(
            `Invalid type '${action.type}', action is ${JSON.stringify(action)}`
        );
    }
    /**
     * @param {String} action.type text fill line
     */
    execSyncAction(action) {
        if (action.type === 'text') {
            return this.text(action);
        } else if (action.type === 'fill') {
            return this.fill(action);
        } else if (action.type === 'line') {
            return this.line(action);
        }
        throw new Error(
            `Invalid type '${action.type}', action is ${JSON.stringify(action)}`
        );
    }
    drawImage(image) {
        return loadImage(image.url).then(img => {
            const { x, y, w, h, clipSize } = image;
            const { ctx } = this;
            if (clipSize) {
                ctx.save();
                ctx.arc(
                    x + clipSize / 2,
                    y + clipSize / 2,
                    clipSize / 2,
                    0,
                    2 * Math.PI,
                    false
                ); //画一个圆形裁剪区域
                ctx.clip();
                ctx.drawImage(img, x, y, w, h);
                ctx.restore();
            } else {
                ctx.drawImage(img, x, y, w, h);
            }
        });
    }
    /**
     * @param { String } errorCorrectionLevel L M Q H
     * @param { Number } margin Default: 4. Define how much wide the quiet zone should be.
     * @param { Number } scale Default: 4. Scale factor. A value of 1 means 1px per modules (black dots).
     * @param { Number } width Forces a specific width for the output image.
     * If width is too small to contain the qr symbol, this option will be ignored.
     * Takes precedence over scale.
     * @param { String } color.dark Default: #000000ff. Color of dark module. Value must be in hex format (RGBA).
     * @param { String } color.light Default: #ffffffff. Color of light module. Value must be in hex format (RGBA).
     */
    drawQrcode(action) {
        const ctx = this.ctx;
        const {
            text,
            errorCorrectionLevel = 'M',
            x = 0,
            y = 0,
            w,
            h,
            scale = 4,
            margin = 1,
            color
        } = action;
        if (!text || !w || !h) return Promise.resolve();
        const config = {
            errorCorrectionLevel,
            width: w,
            scale,
            margin
        };
        if (color) config.color = color;
        return new Promise((res, rej) => {
            QRCode.toDataURL(text, config, function(err, url) {
                if (err) return rej(err);
                return res(url);
            });
        }).then(url => {
            const img = new Image();
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    resolve(ctx.drawImage(img, x, y, w, h));
                };
                img.onerror = err => {
                    reject(err);
                };
                img.src = url;
            });
        });
    }
    line(line) {
        const { points, width, color, fillColor } = line;
        const ctx = this.ctx;
        ctx.save(); //保存当前的绘图上下文。
        ctx.beginPath();
        if (width) {
            ctx.lineWidth = width;
        }
        if (color) {
            ctx.strokeStyle = color;
        }
        for (let i = 0; i < points.length; i++) {
            let [x, y] = points[i].split(' ').map(Number);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        if (!fillColor) {
            ctx.stroke();
        }
        ctx.closePath();
        if (!!fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }
        ctx.restore(); //恢复之前保存的绘图上下文
    }
    // eslint-disable-next-line complexity
    fill(action) {
        const ctx = this.ctx;
        let { lineHeight = 1.3, w, h } = action;
        const {
            x,
            y,
            text = '',
            textAlign = 'center', // left right center
            verticalAlign = 'middle', // top middle bottom
            color,
            fontFamily = 'sans-serif',
            fontSize = 22,
            needLine,
            isBold,
            background,
            radius,
            borderColor
        } = action;
        if (fontSize) {
            ctx.font = `${fontSize}px ${fontFamily}`;
        }
        if (lineHeight < 1) lineHeight = 1;
        const textWidth = ctx.measureText(text).width;
        if (text && !w) {
            w = textWidth;
        }
        const computeH = Math.ceil(textWidth / w) * fontSize * lineHeight;
        if (text && w && (computeH > h || !h)) {
            h = computeH;
        }
        console.log(textWidth, computeH, w,h);
        this.roundRect(ctx, x, y, w, h, radius, background, borderColor);
        if (text) {
            let wordHeader = 0,
                wordTail = Math.min(text.length, Math.floor(w / fontSize)),
                lineNum = h / fontSize / lineHeight;
            let currentY,
                currentX = x;
            if (verticalAlign === 'top') {
                currentY = y + ((lineHeight + 0.8) / 2) * fontSize;
            } else if (verticalAlign === 'bottom') {
                currentY =
                    y + (h - computeH) + ((lineHeight + 0.8) / 2) * fontSize;
            } else {
                currentY =
                    y +
                    (h - computeH) / 2 +
                    ((lineHeight + 0.8) / 2) * fontSize;
            }
            for (let i = 0; i < lineNum && wordHeader <= text.length; i++) {
                // 寻找一行能容纳最大字数的位置
                while (wordTail <= text.length) {
                    let subStrMin = text.slice(wordHeader, wordTail),
                        subStrMax = text.slice(wordHeader, wordTail + 1);
                    let widthMix = ctx.measureText(subStrMin).width,
                        widthMax = ctx.measureText(subStrMax).width;
                    if (widthMix <= w && widthMax >= w) {
                        break;
                    } else if (widthMix > w) {
                        wordTail--;
                    } else {
                        wordTail++;
                    }
                }
                const finalStr = text.slice(wordHeader, wordTail);
                const strW = ctx.measureText(finalStr).width;
                if (textAlign === 'right') {
                    currentX = x + w - strW;
                } else if (textAlign === 'center') {
                    currentX = x + (w - strW) / 2;
                }
                this.text({
                    x: currentX,
                    y: currentY,
                    isBold,
                    needLine,
                    color,
                    fontSize: null,
                    text: finalStr
                });
                currentY += fontSize * lineHeight;
                const tmp = wordTail - wordHeader;
                wordHeader = wordTail;
                wordTail = wordTail + tmp;
            }
        }
    }
    /**
     * 画弧形
     * @param { Number } x
     * @param { Number } y
     * @param { Number } width
     * @param { Number } height
     * @param { String } radius  '0' '10 10' '10 10 20 20'
     * @param  { Color } background  填充颜色,颜色在外部控制
     * @param { Color } strokeColor 线条画线
     */
    roundRect(ctx, x, y, width, height, radius = '0', background, strokeColor) {
        ctx.save(); //保存当前的绘图上下文。
        if (type(radius) === 'String') {
            let radiusAry = radius
                .trim()
                .split(' ')
                .map(Number);
            if (radiusAry.length === 0) {
                radius = { tl: 0, tr: 0, br: 0, bl: 0 };
            } else if (radiusAry.length === 1) {
                radius = {
                    tl: radiusAry[0],
                    tr: radiusAry[0],
                    br: radiusAry[0],
                    bl: radiusAry[0]
                };
            } else if (radiusAry.length === 2) {
                radius = {
                    tl: radiusAry[0],
                    tr: radiusAry[1],
                    br: radiusAry[0],
                    bl: radiusAry[1]
                };
            } else if (radiusAry.length === 3) {
                radius = {
                    tl: radiusAry[0],
                    tr: radiusAry[1],
                    br: radiusAry[2],
                    bl: radiusAry[1]
                };
            } else {
                radius = {
                    tl: radiusAry[0],
                    tr: radiusAry[1],
                    br: radiusAry[2],
                    bl: radiusAry[3]
                };
            }
        } else if (type(radius) === 'Number') {
            radius = { tl: radius, tr: radius, br: radius, bl: radius };
        } else {
            let defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
            // eslint-disable-next-line guard-for-in
            for (let side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + Math.min(radius.tl, width / 2), y);
        ctx.lineTo(x + width - Math.min(radius.tr, width / 2), y);
        ctx.quadraticCurveTo(
            x + width,
            y,
            x + width,
            y + Math.min(radius.tr, height / 2)
        );
        ctx.lineTo(x + width, y + height - Math.min(radius.br, height / 2));
        ctx.quadraticCurveTo(
            x + width,
            y + height,
            x + width - Math.min(radius.br, width / 2),
            y + height
        );
        ctx.lineTo(x + Math.min(radius.bl, width / 2), y + height);
        ctx.quadraticCurveTo(
            x,
            y + height,
            x,
            y + height - Math.min(radius.bl, height / 2)
        );
        ctx.lineTo(x, y + Math.min(radius.tl, height / 2));
        ctx.quadraticCurveTo(x, y, x + Math.min(radius.tl, width / 2), y);
        ctx.closePath();
        if (background) {
            this.setColor(background, x, y, width, height, 'fillStyle');
            ctx.fill();
        }
        if (strokeColor) {
            this.setColor(strokeColor, x, y, width, height, 'strokeStyle');
            ctx.stroke();
        }
        ctx.restore(); //恢复之前保存的绘图上下文
    }
    text(options) {
        let {
            x = 0,
            y = 0,
            fontFamily = 'sans-serif',
            fontSize = 22,
            color = 'black',
            isBold = false,
            needLine, // 删除线
            text
        } = options;
        if (text == null) return;
        const ctx = this.ctx;
        ctx.save();
        if (fontSize && type(fontSize) === 'Number') {
            ctx.font = `${fontSize}px ${fontFamily}`;
        }
        if (isBold) {
            ctx.font = `normal bold ${fontSize}px ${fontFamily}`;
        }
        let lineWidth = ctx.measureText(text).width;
        if (needLine) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = '#999999';
            ctx.lineWidth = 2;
            ctx.moveTo(x, y - fontSize / 3);
            ctx.lineTo(x + lineWidth, y - fontSize / 3);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }
        this.setColor(
            color,
            x,
            y - fontSize,
            ctx.measureText(text).width,
            fontSize
        );
        ctx.fillText(options.text, x, y);
        ctx.restore();
    }
    setColor(color, x, y, w, h, type = 'fillStyle') {
        const ctx = this.ctx;
        if (/linear-gradient/.test(color)) {
            this.setGradient(color, x, y, w, h, type);
        } else {
            ctx[type] = color;
        }
    }
    setGradient(color, x, y, w, h, type) {
        const optStr = color.match(/linear-gradient\((.+)\)/)[1];
        const optAry = optStr.split(',').map(e => e.trim());
        if (!optAry || !optAry.length || optAry.length < 2) {
            return;
        }
        let direction = [x, y, x, y + h]; // default 180 deg
        let beginColor, endColor;
        if (optAry.length > 2) {
            const tanHW = (Math.atan(h / w) * 180) / Math.PI; // 按照arctan(h/w)来区分不同情况，to right 是 90deg，所以+90
            beginColor = optAry[1];
            endColor = optAry[2];
            if (/^to/.test(optAry[0])) {
                const position = optAry[0].trim();
                if (/top$/.test(position)) {
                    optAry[0] = '0deg';
                } else if (/left$/.test(position)) {
                    optAry[0] = '270deg';
                } else if (/bottom$/.test(position)) {
                    optAry[0] = '180deg';
                } else if (/right$/.test(position)) {
                    optAry[0] = '90deg';
                } else if (
                    /top\s+left$|left\s+top$|bottom\s+right$|right\s+bottom$/.test(
                        position
                    )
                ) {
                    optAry[0] = `${270 + tanHW}deg`;
                } else if (
                    /top\s+right$|right\s+top$|bottom\s+left$|left\s+bottom$/.test(
                        position
                    )
                ) {
                    optAry[0] = `${360 + tanHW}deg`;
                }
            }
            if (/deg$/.test(optAry[0])) {
                let angle = Number(optAry[0].replace('deg', ''));
                angle = angle % 360;
                // 负角度 即加上360
                angle < 0 && (angle += 360);
                // 只判断0-180内情况，因为 190 = 10的情况
                angle > 180 && (angle -= 180);
                if (angle <= 90 - tanHW) {
                    const realW = Math.tan((angle * Math.PI) / 180) * h;
                    direction = [x, y + h, x + realW, y];
                } else if (angle <= 90) {
                    const realH =
                        h - Math.tan(((90 - angle) * Math.PI) / 180) * w;
                    direction = [x, y + h, x + w, y + realH];
                } else if (angle <= tanHW + 90) {
                    const realH = Math.tan(((angle - 90) * Math.PI) / 180) * w;
                    direction = [x, y, x + w, y + realH];
                } else if (angle <= 180) {
                    const realW = Math.tan(((180 - angle) * Math.PI) / 180) * h;
                    direction = [x, y, x + realW, y + h];
                }
            }
        } else {
            beginColor = optAry[0];
            endColor = optAry[1];
        }
        const ctx = this.ctx;
        let linear = ctx.createLinearGradient(...direction);
        linear.addColorStop(0, beginColor);
        linear.addColorStop(1, endColor);
        ctx[type] = linear;
    }
    /**
     * @param { Object } output.type DataURL/png DataURL/jpeg Buffer/png Buffer/jpeg Stream/png Stream/jpeg
     * @param { Object } output.config DataURL/png DataURL/jpeg { quality: 0.75 }
     * @param { Object } output.config Stream/png {compressionLevel: 6, filters: canvas.PNG_ALL_FILTERS, palette: undefined, backgroundIndex: 0, resolution: undefined}
     * @param { Object } output.config Stream/jpeg {quality: 0.75, progressive: false, chromaSubsampling: true}
     */
    getImage() {
        const { output = { type: 'DataURL/png' }, config = {} } = this.options;
        return this.exector.then(() => {
            if (output.type === 'DataURL/png') {
                return this.canvas.toDataURL('image/png', config.quality || 1);
            } else if (output.type === 'DataURL/jpeg') {
                return this.canvas.toDataURL('image/jpeg', config.quality || 1);
            } else if (output.type === 'Buffer/png') {
                return this.canvas.toBuffer('image/png', config);
            } else if (output.type === 'Buffer/jpeg') {
                return this.canvas.toBuffer('image/jpeg', config);
            } else if (output.type === 'Stream/jpeg') {
                return this.canvas.createJPEGStream(config);
            } else if (output.type === 'Stream/png') {
                return this.canvas.createPNGStream(config);
            }
            throw new Error('Not match output setting. Please check!');
        });
    }
}

function paint(options) {
    const p = new Painter(options);
    return p.getImage();
}

module.exports = paint;
