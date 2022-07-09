/**
 * 每一个fiber节点都是一个最小的工作单元
 * 1.从顶点开始遍历
 * 2.如果有大儿子，先遍历大儿子
 *
 */
function sleep(delay) {
    let begin = Date.now();
    while (Date.now() - begin <= delay){}
}

let A1 = { type: 'div', key: 'A1' };
let B1 = { type: 'div', key: 'B1', return: A1 }
let B2 = { type: 'div', key: 'B2', return: A1 }
let C1 = { type: 'div', key: 'C1', return: B1 }
let C2 = { type: 'div', key: 'C2', return: B1 }
A1.child = B1;
B1.sibling = B2;
B1.child = C1;
C1.sibling = C2;

let nextUnitOfWork = A1;//下一个执行单元

function workLoop(deadline) {
    while (deadline.timeout || deadline.timeRemaining() > 0 && nextUnitOfWork) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
    if (!nextUnitOfWork) {
        console.log('任务执行完成，没有剩余')
    }else {
        console.log('当前帧已无剩余时间，下一帧有空闲时间执行')
        window.requestIdleCallback(workLoop, { timeout: 1000 });
    }
}

// 执行工作单元是深度优先执行；
function performUnitOfWork(fiber) {
    beginUnitOfWork(fiber);
    if (fiber.child) {
        return fiber.child;
    }
    // 当没有儿子了，此工作单元完成
    while (fiber) {
        completeUnitOfWork(fiber);
        // 在找兄弟
        if (fiber.sibling) {
            return fiber.sibling;
        }
        // 它和它兄弟都完成了，父亲也完成
        fiber = fiber.return;
    }
}

function beginUnitOfWork(fiber) {
    console.log('beginUnitOfWork', fiber.key)
    sleep(30);
}

function completeUnitOfWork(fiber) {
    console.log('completeUnitOfWork', fiber.key)
}

window.requestIdleCallback(workLoop, { timeout: 1000 });
