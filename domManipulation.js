function D(x) { return document.getElementById(x) }
function E(e) { return document.createElement(e)  }

const mkSlider = _ => {
    const p = E('input')
    p.type='range'
    p.classList.add('slider')
    return p
}