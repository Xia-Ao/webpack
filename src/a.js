console.log('a.js');

import png from './img/north.png';

let img = new Image();
img.src = png;
document.getElementById('img1').appendChild(img);


const fn = () => {
  console.log('a--------')
};
fn();
