import React from'react';
import config from "../config";
import DeviceList from "./DeviceList.jsx";
import Header from "./Header.jsx";

export default React.createClass({
  displayName: 'Layout',

  render() {

    const title = `Telldus Web Remote @ ${this.props.hostname}`;

    const {devices, sensors} = this.props;

    return (
      <html>
        <head>
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <title>{title}</title>
          <script src="/browser.js" async/>
          {config.env === 'development' && <script src="/quickreload.js" async/>}
          <link rel="stylesheet"  href="/stylesheets/main.css"/>
          <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1" />
        </head>
        <body>
          <div className="container">
            <Header sensors={sensors}/>
            <DeviceList devices={devices}/>
          </div>
          <script id="initialAppState" type="text/json"
            dangerouslySetInnerHTML={{__html: JSON.stringify(this.props)}}
          />
        </body>
      </html>
    );
  }
});
