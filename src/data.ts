/* Class to manage browser localStorage, it gives the ability to add a callback when the data is changed, 
   effectively enabling data binding to front-end UI elements.
   Usage: Although defined as a class, it is designed to only have a single instance in the app.
          which is the exported localStore var at the bottom.
          E.g. localStore.set(key: string, initial_data: string, callbackFunction: callableFunction)
*/

class LocalData {    
    private callbacks: Map<string, Array<CallableFunction>>;
    constructor(){
        this.callbacks = new Map<string, Array<CallableFunction>>();
    }
    public set(key: string, data: string, onChange: CallableFunction = ()=>{}): void {
        if (!this.callbacks.has(key)) {
            this.callbacks.set(key, []);
        }
        let fncs = this.callbacks.get(key)!;
        fncs.push(onChange);
        this.callbacks.set(key, fncs);
        localStorage.setItem(key, data);
        onChange();
    }
    public get(key: string): string | null {
        return localStorage.getItem(key);
    }
    public update(key: string, data: string): void {
        if (localStorage.getItem(key) != data) {  // Only change the data and execute callbacks if it's different to what is already stored.
            localStorage.setItem(key, data);
            if (this.callbacks.has(key)) {  
                let fncs = this.callbacks.get(key);
                fncs?.forEach((value)=>{
                    value();
                });
            }
        }        
    }
    public remove(key: string): void {
        if (this.callbacks.has(key)) {
            this.callbacks.delete(key);
        }
        localStorage.removeItem(key);
    }
    public cancelCallbacks(): void {
        this.callbacks = new Map<string, Array<CallableFunction>>();
    }
}

export var localStore = new LocalData();