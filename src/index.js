import './a';
import './b';

console.log('index.js');

console.log('webpack-dev-server');


import './css/index.css';
import './css/b.less';

const fn = () => {
  console.log('es6语法')
};
fn();

let button = document.createElement('button');
button.innerHTML = '懒加载';

button.addEventListener('click', () => {
  // es6 草案
  import('./other.js').then((data) => {
    console.log(data.a);
  })

});
document.body.appendChild(button);
/*function log (target, name, descriptor) {
  let oldValue = descriptor.value;
  descriptor.value = function () {
    console.log(`Calling ${name} with`, arguments);
    return oldValue.apply(this, arguments);
  };

  return descriptor;
}

class A {
  @log
  print () {
    console.log('class A')
  }
}


const a = new A();
a.print();


function* gen () {
  yield 1;
}

console.log(gen().next());

console.log(['a', 'a'].includes('a'));*/
