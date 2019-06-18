const paint = require('./index')

paint({
    width: 750,
    height: 1196,
    background: '',
    actions: [{
            type: 'image',
            url: 'https://haitao.nos.netease.com/46ee319f-8a69-40a7-8a07-4dc0a74681de_750_70.png',
            w: 750,
            h: 75,
            x: 0,
            y: 1122
        },
        {
            type: 'text',
            text: 'ad我问问',
            fontSize: '15px',
            fontFamily: 'sans-serif',
            color: 'linear-gradient(90deg , blue, red )',
            x: 0,
            y: 30,
            isBold: false,
            needLine: 1
        },
        {
            type: 'fill',
            x: 100,
            y: 200,
            w: 100,
            h: 100,
            background: 'linear-gradient(135deg , #FFF, #000000 )'
        }
    ],
    output: { type: 'DataURL/png' }
}).then(console.log).catch(console.error)