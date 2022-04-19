## 路由的实现

- react-router 路由核心库，只有核心逻辑，与 DOM 无关，支持在各种平台上面使用
- history 针对不同平台实现不同的历史对象
- react-router-dom DOM（浏览器环境）下的路由相关逻辑

### react-router

- Router: 路由容器
- Route: 路由规则

### Route 要想配置路径匹配的时候可渲染的内容有三种方式

- component
  - 写法比较简单，直接渲染一个组件，传递参数 { location, history, match }
  - 缺点是不能写逻辑判断
- render
  - 可以逻辑判断渲染什么组件，比如：登录了就渲染，否则就重定向到登录页面
- children (优先级最高)
  - 是一个函数，不管是否匹配到，都会渲染
