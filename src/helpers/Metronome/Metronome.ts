class Ticker {

    subscriptionList = new Map();
    time = 0;
    
    tick = (timestamp:number) => {
        this.time = timestamp;
        this.subscriptionList.forEach((subscription, key, subscriptionList) => {
            typeof key === "function" ? 
                key(this.time-subscription.startTime) :
                subscriptionList.delete(key)});
        this.subscriptionList.size > 0 ? window.requestAnimationFrame(this.tick) : this.time = 0;
    }

    add = (subscription:(timestamp:number) => void) => {
        !this.subscriptionList.has(subscription) && 
            this.subscriptionList.set(subscription, 
                { startTime: this.time }
            ).size == 1 && window.requestAnimationFrame(this.tick); 
        return () => this.subscriptionList.delete(subscription);
    }
}

const Metronome = new Ticker();
export default Metronome;