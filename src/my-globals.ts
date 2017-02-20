//import { inject } from 'aurelia-framework'
//import { MyClass } from './my-class';

//@inject(MyClass)



export class MyGlobals {
    foo = {}
    currentUser = {}
    profileSelected = {}
    

    getFoo() { return this.foo }
    setFoo(bar) {
        /* do something */
    }
}