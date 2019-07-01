import React, { Component } from 'react';
import Header from "./componentes/Header";
import TimeLine from "./componentes/TimeLine"


class App extends Component {

  render() {

    return (
      <div id="root" >
        <div className="main">

          <Header></Header>

          <TimeLine login={this.props.match === undefined ? undefined : this.props.match.params.login} ></TimeLine>

        </div>
      </div>
      // <!--fim #root-->
    );
  }
}
export default App;
