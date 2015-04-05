import Rx from "rx";

function flatten(arr) {
  return arr.reduce((flatArr, item) => flatArr.concat(item), []);
}

export function createAction() {

  const subject = new Rx.Subject();

  for (let prop in subject) {
    action[prop] = subject[prop];
  }

  return action;

  function action(...args) {
    subject.onNext(...args);
  }
}

export function createActions(...args) {
  return flatten(args).reduce((actions, method)=> {
    actions[method] = createAction();
    return actions;
  }, {})
}