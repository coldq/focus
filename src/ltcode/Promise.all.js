function all(promises) {
    let count = 0;
    const result = [];
    return new Promise((res, rej) => {
        for (let [k, v] of promises) {
            Promise.resolve(v).then(ret => {
                count++;
                result[k] = ret;
                if (count === promises.length) {
                    res(result);
                }
            }, rej);
        }
    });
}
/**
 * 把多个reducer合并为一个reducer
 * @param reducers {array} 多个reducer组成的数组
 * @return {object} 全局state
 */
export default function combineReducers(reducers) {  
    var reducerKeys = Object.keys(reducers)
    var finalReducers = {}
    .....// 数据处理
    return function combination(state = {}, action) {// 返回一个需要传入state和action参数的方法，该方法的返回值是最新的state
      .....// 检查是否包含多个reducer, state的字段是否和reducer的key对应
      var hasChanged = false
      var nextState = {}
      /**
       * 对传入combineReducers的 state 每个字段(var previousStateForKey = state[key])都和
       * 处理后的新state(var nextStateForKey = reducer(previousStateForKey, action))对比
       * 如果state里对应的字段内容相同,hasChanged 为false
       * 目的：逐个更新每个reducer中对应的state，最终一个循环更新完所有的state
       */
      for (var i = 0; i < finalReducerKeys.length; i++) {
        var key = finalReducerKeys[i]
        var reducer = finalReducers[key]
        var previousStateForKey = state[key]
        var nextStateForKey = reducer(previousStateForKey, action)
        nextState[key] = nextStateForKey
        // 1. action type 存在,返回新的state, hasChanged 为 true
        // 2. action type 不存在,返回原来的state, hasChanged 为 false
        // 3. 不管action type 是否存在, 在原来的state上修改,但是返回的是修改后的state(没有返回拷贝), hasChanged还是为false
        hasChanged = hasChanged || nextStateForKey !== previousStateForKey
      }
      // 根据更改状态来决定返回的state值
      // state 的更新应该在"不可变（immutable）"的理念下完成 => 总是去返回一个新的更新后的对象，而不是直接去修改原始的 state tree。
      return hasChanged ? nextState : state
    }
  }
  /**
   * combineReducer 接收一个拆分后 reducer 函数组成的对象，返回一个新的 Reducer 函数。
   */

   /**
 * 把多个reducer合并为一个reducer
 * @param reducers {array} 多个reducer组成的数组
 * @return {object} 全局state
 */
export default function combineReducers(reducers) {  
  var reducerKeys = Object.keys(reducers)
  var finalReducers = {}
  .....// 数据处理
  return function combination(state = {}, action) {// 返回一个需要传入state和action参数的方法，该方法的返回值是最新的state
    .....// 检查是否包含多个reducer, state的字段是否和reducer的key对应
    var hasChanged = false
    var nextState = {}
    /**
     * 对传入combineReducers的 state 每个字段(var previousStateForKey = state[key])都和
     * 处理后的新state(var nextStateForKey = reducer(previousStateForKey, action))对比
     * 如果state里对应的字段内容相同,hasChanged 为false
     * 目的：逐个更新每个reducer中对应的state，最终一个循环更新完所有的state
     */
    for (var i = 0; i < finalReducerKeys.length; i++) {
      var key = finalReducerKeys[i]
      var reducer = finalReducers[key]
      var previousStateForKey = state[key]
      var nextStateForKey = reducer(previousStateForKey, action)
      nextState[key] = nextStateForKey
      // 1. action type 存在,返回新的state, hasChanged 为 true
      // 2. action type 不存在,返回原来的state, hasChanged 为 false
      // 3. 不管action type 是否存在, 在原来的state上修改,但是返回的是修改后的state(没有返回拷贝), hasChanged还是为false
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    // 根据更改状态来决定返回的state值
    // state 的更新应该在"不可变（immutable）"的理念下完成 => 总是去返回一个新的更新后的对象，而不是直接去修改原始的 state tree。
    return hasChanged ? nextState : state
  }
}
/**
 * combineReducer 接收一个拆分后 reducer 函数组成的对象，返回一个新的 Reducer 函数。
 */

export default function(state = { }, action) {  
    if(action.data) {
        let newState = {};
        $.extend(true, newState, state);
        switch (action.type) {
            case 'DELETE_URL_FAIL':
                $.extend(true, newState, action.data);
                return newState;
            case 'DELETE_URL_SUCCESS':
                ....
            default:
                return state;
        }
    }else {
        return state;
    }
}

import compose from './compose'

export default function applyMiddleware(...middlewares) {  
  return (createStore) => (reducer, preloadedState, enhancer) => {
    //获取最基本的store对象，其中包含dispatch、subscribe、getState和replaceReducer四种方法的对象
    //相当于调用 Redux.createStore(reducer, preloadedState)
    var store = createStore(reducer, preloadedState, enhancer)
    var dispatch = store.dispatch //最原始的dispatch方法
    var chain = []
    // 中间件API，包含getState和dispatch函数
    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action) //原始dispatch被覆盖，变成包装后的dispatch函数
    }
    chain = middlewares.map(middleware => middleware(middlewareAPI)) //给每个middleware传入基本的getState和dispatch的API方法
    dispatch = compose(...chain)(store.dispatch) //用所有传入的middlewares来包装store.dispatch，但其实最终middleware中使用的dispatch方法都是原生store.dispatch
    return { //更新store的dispatch方法，利用中间件来增强store.dispatch函数的功能
      ...store,
      dispatch
    }
  }
}
function createThunkMiddleware(extraArgument) {  
    return ({ dispatch, getState }) => next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState, extraArgument);
      }
      return next(action);
    };
  }
  const thunk = createThunkMiddleware();  
  thunk.withExtraArgument = createThunkMiddleware;
  
  export default thunk;  

  const a = next => action => {
    if (typeof action === 'function') {
       return action();
    }
    return next(action);
  };
  const b = next => action => {
    if (typeof action === 'function') {
      return action();
    }
    return next(action);
  };
  a(b())(console.log)