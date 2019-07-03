const paint = require('../index');

paint({
    width: 500,
    height: 600,
    background: '#ffffff',
    actions: [
        {
            type: 'image',
            url:
                'https://haitao.nos.netease.com/46ee319f-8a69-40a7-8a07-4dc0a74681de_750_70.png',
            w: 500,
            h: 50,
            x: 0,
            y: 550,
            index: 1
        },
        {
            type: 'text',
            text: '兴爷牛逼',
            fontSize: 50,
            fontFamily: 'sans-serif',
            color: 'linear-gradient(90deg , blue, red )',
            x: 0,
            y: 50,
            isBold: false,
            needLine: 1
        },

        {
            type: 'fill',
            x: 100,
            y: 230,
            w: 100,
            h: 100,
            background: 'linear-gradient(135deg , red, yellow )',
            radius: '10 20 20 10',
            text: '测试哦',
            verticalAlign: 'top',
            color: 'yellow'
        },
        {
            type: 'fill',
            x: 300,
            y: 230,
            w: 100,
            h: 100,
            background: 'red',
            text: '测试哦',
            verticalAlign: 'bottom'
        },
        {
            type: 'fill',
            x: 100,
            y: 120,
            w: 100,
            h: 100,
            background: 'red',
            text: '测试哦',
            verticalAlign: 'middle',
            textAlign: 'left'
        },
        {
            type: 'fill',
            x: 300,
            y: 120,
            w: 100,
            h: 100,
            background: 'red',
            text: '测试哦',
            verticalAlign: 'bottom',
            textAlign: 'right'
        },
        {
            type: 'fill',
            x: 300,
            y: 0,
            w: 100,
            h: 100,
            background: 'red',
            text: '测试哦多行ad问问大订单add大订单'
        },
        {
            type: 'line',
            width: 1,
            color: 'blue',
            points: ['0 548', '500 548']
        },
        {
            type: 'qrcode',
            text:
                'https://haitao.nos.netease.com/46ee319f-8a69-40a7-8a07-4dc0a74681de_750_70.png',
            w: 200,
            h: 200,
            x: 150,
            y: 340,
            color: {
                dark: '#15a8ebff'
            },
            index: 1
        }
    ],
    output: {
        type: 'DataURL/png',
        config: {
            quality: 0.8
        }
    } // DataURL/png DataURL/jpeg Buffer/png Buffer/jpeg Stream/png Stream/jpeg
})
    .then(console.log)
    .catch(console.error);
