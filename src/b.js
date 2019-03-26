const fn = () => {
  console.log('b--------')
};
fn();


function add (...args) {
  var summary = 0;
  if (args.length > 0) {
    for (let i = 0; i < args.length; i++) {
      summary += args[i];
    }
    return add;
    // var add = function (...args) {
    //   if (args.length > 0) {
    //     for (let i = 0; i < args.length; i++) {
    //       summary += args[i];
    //     }
    //     return add;
    //   } else {
    //     return summary
    //   }
    // };
    // return add
  } else {
    console.log(summary);
    return summary
  }
}

let res = add(1)(2, 3)();
console.log(res);