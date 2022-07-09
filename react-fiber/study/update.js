// 单向链表节点
class Update {
    constructor(payload, nextUpdate) {
        this.payload = payload;
        this.nextUpdate = nextUpdate;
    }
}

class UpdateQueue {
    constructor() {
        this.baseState = null;
        this.firstUpdate = null;
        this.lastUpdate = null;
    }

    enqueueUpdate(update) {
        if (!this.firstUpdate) {
            this.firstUpdate = this.lastUpdate = update;
        }else {
            this.lastUpdate.nextUpdate = update;
            this.lastUpdate = update;
        }
    }

    forceUpdate() {
        let currentState = this.baseState || {};
        let currentUpdate = this.firstUpdate;
        while (currentUpdate) {
            let nextState = typeof currentUpdate.payload === 'function' ? currentUpdate.payload(currentState) : currentUpdate.payload;
            currentState = { ...currentState, ...nextState };
            currentUpdate = currentUpdate.nextUpdate;
        }
        this.firstUpdate = this.lastUpdate = null;
        this.baseState = currentState;
        return currentState;
    }
}

// 模拟React setState 计数器 {number:0}  setState({number:1})  setState((state)=>({number:state.number+1}))
let queue = new UpdateQueue();
queue.enqueueUpdate(new Update({ name: 'lmd' }));
queue.enqueueUpdate(new Update({ number: 0 }));
queue.enqueueUpdate(new Update((state) => ({ number: state.number + 1 })));
queue.enqueueUpdate(new Update((state) => ({ number: state.number + 1 })));
queue.forceUpdate();
console.log(queue.baseState);
