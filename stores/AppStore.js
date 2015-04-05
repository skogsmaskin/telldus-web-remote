import AppActions from "../actions/AppActions";

function rehydrate() {
  return JSON.parse(document.getElementById("initialAppState").innerHTML);
}

export const boot = AppActions.boot.first().map(rehydrate);