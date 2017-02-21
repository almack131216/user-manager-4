//import { noView } from 'aurelia-framework'
//import { MyClass } from './my-class';

//@inject(MyClass)
//@noView
export class MyGlobals {
    foo = {}
    isReadOnly = null
    currentUser = {}
    profileSelected = {}

    isMember
    isReader
    isEditor

    myLookups

    getFoo() { return this.foo }
    setFoo(bar) {
        /* do something */
    }
}