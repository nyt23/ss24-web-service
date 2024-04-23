import {describe} from "@jest/globals";



function factorial(n){
    if (n < 0) {
        throw new Error('Factorial is only defined for positive integer numbers.')
    } else if (n === 0) {
        return 1;
    } else {
        return factorial(n - 1) * n;
    }
}




function product(n, term = k => k, initial=1){
    // todo: implement the product `term(initial) * term(initial + 1) * term(initial + 2) * ... * term(initial + d)` with initial + d <= n
    let result = term(initial);
    for(let i = initial+1; i<n; i++) {
        result *= term(i)
    }
}


export {factorial, product}
