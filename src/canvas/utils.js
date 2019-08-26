/* eslint-disable no-var */
// export measureText
// encode
// decode
!(function(root, name, definition) {
    if (typeof module != 'undefined' && module.exports)
        module.exports = definition();
    else if (typeof define == 'function' && define.amd)
        define(name, definition);
    else root[name] = definition();
})(this, 'canvasTool', function() {
    var _ = {};
    // 比例按照微信小程序
    var MEASURE_SCALE = {
        number: 0.58642578125,
        enPunc: 0.74169921875,
        enLowcase: 0.552734375,
        enUppercase: 0.70361328125,
        bold: 1.051623646960866,
        sign: {
            '~=<>+': 0.74169921875,
            '!': 0.3125,
            '"': 0.435546875,
            '#': 0.63818359375,
            $: 0.58642578125,
            '%': 0.8896484375,
            '&': 0.8701171875,
            "'": 0.25634765625,
            '([]){}': 0.333984375,
            '*': 0.455078125,
            ',.:;': 0.24072265625,
            '-': 0.4326171875,
            '/\\': 0.42724609375,
            '?': 0.48291015625,
            '|': 0.26904296875
        }
    };
    _.measureText = function(text, font) {
        if (font == null) {
            return 0;
        }
        var fontSize = font.match(/(\d+)px/)[1];
        var bold = font.includes('bold');
        var partial = Object.keys(MEASURE_SCALE.sign);
        var width = 0,
            code;
        for (var i = 0; i < text.length; i++) {
            code = text.charCodeAt(i);
            if ((code >= 48) & (code <= 57)) {
                // 0-9
                width += fontSize * MEASURE_SCALE.number;
            } else if (code >= 65 && code <= 90) {
                // A-Z
                width += fontSize * MEASURE_SCALE.enUppercase;
            } else if (code >= 97 && code <= 122) {
                // a-z
                width += fontSize * MEASURE_SCALE.enLowcase;
            } else {
                var matched = false;
                for (var j = 0; j < partial.length; j++) {
                    if (partial[j].includes(text[i])) {
                        width += fontSize * MEASURE_SCALE.sign[partial[j]];
                        matched = true;
                        break;
                    }
                }
                !matched && (width += Number(fontSize));
            }
        }
        if (bold) {
            width *= MEASURE_SCALE.bold;
        }
        return {
            width
        };
    };
});
