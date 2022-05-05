import prefixNamespace from "./prefixNamespace";
import { combineReducers, createStore, applyMiddleware } from "redux";
import React from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import createSagaMiddleware from "redux-saga";
import * as sagaEffects from "redux-saga/effects";

export { connect };

function getSagas(app) {
  let sagas = [];
  for (let model of app._models) {
    sagas.push(getSaga(model.effects, model));
  }
  return sagas;
}

function getSaga(effects, model) {
  return function* () {
    for (const key in effects) {
      const watcherSaga = getWatcher(key, effects[key], model);
      yield sagaEffects.fork(watcherSaga); // 创建新迭代器去执行
    }
  };
}

function getWatcher(actionType, saga, model) {
  return function* () {
    // actionType = counter/asyncAdd
    yield sagaEffects.takeEvery(actionType, function* (action) {
      yield saga(action, {
        ...sagaEffects,
        // AOP重写put方法，自动添加namespace
        put: (action) => {
          return sagaEffects.put({
            ...action,
            type: prefixType(action.type, model),
          });
        },
      });
    });
  };
}

function prefixType(type, model) {
  // 可以put其他namespace的saga,如果是自己的namespace会警告 m
  if (type.indexOf("/") > -1) return type;
  return model.namespace + "/" + type;
}

function getReducer(model) {
  const { state: initialState, reducers } = model;
  return (state = initialState, action) => {
    const r = reducers[action.type]; // namespace/add
    if (r) return r(state, action);
    return state;
  };
}

function createReducer(initialReducers) {
  return combineReducers(initialReducers);
}

function dva() {
  function model(model) {
    const prefixModel = prefixNamespace(model);
    app._models.push(prefixModel);
  }
  function router(routerConfig) {
    app._router = routerConfig;
  }
  function start(root) {
    const initialReducers = {};
    for (let model of app._models) {
      initialReducers[model.namespace] = getReducer(model);
    }
    const rootReducers = createReducer(initialReducers);

    const sagaMiddleware = createSagaMiddleware();

    const store = createStore(rootReducers, applyMiddleware(sagaMiddleware));

    const sagas = getSagas(app);
    sagas.forEach(sagaMiddleware.run);

    ReactDOM.render(
      <Provider store={store}>{app._router()}</Provider>,
      document.querySelector(root)
    );
  }

  const app = {
    model,
    _models: [],
    _router: null,
    router,
    start,
  };

  return app;
}

export default dva;
