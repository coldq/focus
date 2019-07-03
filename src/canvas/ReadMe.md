## example
```js
const paint = require('../index');
const fs = require('fs')
const out = fs.createWriteStream('./test.png')

let p = paint({
    width: 750,
    height: 1152,
    background: '#ffffff',
    actions: [
        {
            type: 'fill',
            w: 126,
            h: 80,
            x: 594,
            y: 30,
            radius: '10 10 0 0',
            background: '#979797'
        },
        {
            type: 'fill',
            color: '#626262',
            text: 'KAOLA',
            w: 126,
            h: 46,
            x: 594,
            y: 110,
            radius: '0 0 10 10',
            background: '#CCCCCC'
        },
        {
            type: 'text',
            text: '跨 境',
            x: 627,
            y: 62,
            fontSize: 26,
            color: '#FFFFFF'
        },
        {
            type: 'text',
            text: '商 品',
            x: 627,
            y: 94,
            fontSize: 26,
            color: '#FFFFFF'
        },
        {
            type: 'text',
            color: '#FF0100',
            fontSize: 34,
            text: '¥',
            x: 30,
            y: 850
        },
        {
            type: 'text',
            color: '#FF0100',
            fontSize: 60,
            text: '118',
            x: 56,
            y: 850
        },
        {
            type: 'text',
            color: '#999999',
            needLine: true,
            fontSize: 28,
            text: '¥',
            x: 171.5,
            y: 850
        },
        {
            type: 'text',
            color: '#999999',
            needLine: true,
            fontSize: 28,
            text: '178',
            x: 193.5,
            y: 850
        },
        {
            type: 'fill',
            borderColor: '#ff0000',
            color: '#ff0000',
            fontSize: 20,
            text: '包税',
            x: 50,
            y: 870,
            w: 60,
            radius: '15'
        },
        {
            type: 'fill',
            color: '#000000',
            fontSize: 32,
            text: 'DoMeCare 欣兰 黑里透白冻膜 225克 亮白清洁 毛孔吸尘器',
            x: 40,
            y: 905,
            w: 400,
            textAlign: 'left',
            lineHeight: 1.3
        },
        {
            type: 'image',
            h: 750,
            url:
                'http://haitao.nos.netease.com/c2618d1588714b9aaab66be6d29379c01560251976092jwrpqpop10441.jpg',
            w: 750,
            x: 0,
            y: 0
        },
        {
            type: 'image',
            h: 75,
            url:
                'https://haitao.nos.netease.com/46ee319f-8a69-40a7-8a07-4dc0a74681de_750_70.png',
            w: 750,
            x: 0,
            y: 1082,
            index: 1
        },
        {
            type: 'image',
            h: 249,
            url:
                'https://haitao.nos.netease.com/9e8cf901-e73d-4fc7-a5b8-29488b472441_214_261.png',
            w: 214,
            x: 496,
            y: 795,
            index: 1
        },
        {
            type: 'image',
            h: 130,
            url: 'http://haitao.nos.netease.com/1bvmjuutb68_120_120.jpg',
            w: 130,
            x: 40,
            y: 40,
            index: 1
        },
        {
            type: 'image',
            h: 102.4,
            url:
                'https://haitao.nos.netease.com/834efbed-8221-4f41-acaf-5a138bf8cc86_234_100.png',
            w: 240,
            x: 40,
            y: 610,
            index: 1
        },
        {
            type: 'line',
            width: 1,
            color: '#E8E8E8',
            points: ['0 751', '750 751']
        },
        {
            type: 'qrcode',
            w: 190,
            h: 190,
            x: 508,
            y: 803,
            index: 2,
            text: 'https://m-goods.kaola.com/product/30555.html'
        }
    ],
    output: {
        type: 'Stream/png',
        config: {
            quality: 0.8
        }
    } // DataURL/png DataURL/jpeg Buffer/png Buffer/jpeg Stream/png Stream/jpeg
})
    .then(stream => {
        stream.pipe(out);
        out.on('finish', () => console.log('The PNG file was created.'));
    })
    .catch(console.error);
```

## Result pic:

![share.png](https://haitao.nos.netease.com/07799670-417f-4308-a697-cc288d5e036a_750_1152.png)