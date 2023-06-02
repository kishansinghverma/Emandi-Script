export class ComplexPromise {
    constructor(){
        this.Operator = new Promise((resolve, reject)=>{
            this.Resolve = resolve;
            this.Reject = reject;
        })
    }
};
