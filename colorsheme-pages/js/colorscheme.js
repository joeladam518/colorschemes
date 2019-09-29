function is_dark(hexColor) {
    var c = hexColor.substring(1);      // strip #
    var rgb = parseInt(c, 16);   // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff;  // extract red
    var g = (rgb >>  8) & 0xff;  // extract green
    var b = (rgb >>  0) & 0xff;  // extract blue

    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    return luma < 55;
}

function drawSectionHeading(title) {
    return [
        '<h3 class="section-title">'+ title +'</h3>',
    ].join('\n');
}

function drawBox(color, title = null) {
    if (color === false) {
        return '';
    }
    
    let boxHtml = [];

    if (is_dark(color)) {
        boxHtml.push('<div class="color-box drk-bg" style="background-color:'+ color +';">');
    } else {
        boxHtml.push('<div class="color-box" style="background-color:'+ color +';">');
    }

    if (title) {
        boxHtml.push('<span class="title">'+ title +'</span>');
    }

    boxHtml.push('<span class="color">'+ color +'</span>');
    boxHtml.push('</div>');

    return  boxHtml.join('\n');
}

function traverseColorPallete(colorPalette, classes = []) {
    let html = '';
    let section_classes = 'section'; 

    if (classes.length) {
        section_classes += ' ' + classes.join(' ');
    }

    html += '<div class="'+ section_classes +'">';

    for (let row of colorPalette) {
        if (typeof row.color === 'string') {
            html += drawBox(row.color, row.name);
        } else if (row.color instanceof Array) {
            html += drawSectionHeading(row.name);
            if (row.hasOwnProperty('section_classes') && row.section_classes instanceof Array) {
                html += traverseColorPallete(row.color, row.section_classes);
            } else {
                html += traverseColorPallete(row.color, row.section_classes);
            }
        }
    }

    html += '</div>';

    return html;
}

const html = traverseColorPallete(colorPalette)
const mainContainer = document.getElementById('color-pallete-container');
mainContainer.innerHTML = html;
