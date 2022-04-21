## Redux 设计思想

- `Redux` 是将整个应用状态存储到一个地方，称为 `store`
- `store` 里面保存一颗状态树 `state tree`
- 组件可以派发 `dispatch` 行为 `action` 给到 `store`，而不是直接通知其他组件
- 组件可以通过订阅`store`中的状态`state`来刷新自己的视图
