export class EventSubscriber<T> extends Array<(t:T)=>void> {
    subscribe(f:((t:T)=>void))  {
        this.push(f);
        return () => {
            const i = this.indexOf(f);
            if (i != -1) this.splice(i, 1);
        }
    }
    constructor() {
        super();
    }
}