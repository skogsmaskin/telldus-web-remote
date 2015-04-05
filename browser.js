import "babel-core/polyfill"
import attachFastClick from 'fastclick'
import React from "react";
import Layout from "./components/Layout.jsx";
import Rx from "rx-dom";

import AppActions from "./actions/AppActions";
import * as appStore from "./stores/AppStore";
import Debug from "debug";

Debug.enable(process.env.DEBUG || '');


let domready = Rx.DOM.ready();

domready.subscribe(()=> {
  attachFastClick(document.body);
});

domready.subscribe(()=> {
  AppActions.boot();
});

appStore.boot.subscribe(initialData => {
  React.render(<Layout {...initialData}/>, document);
});