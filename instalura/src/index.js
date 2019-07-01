import React from 'react';
import ReactDOM from 'react-dom';
import "./css/reset.css"
import "./css/timeline.css"
import "./css/login.css"
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import App from './App';
import Login from './componentes/Login';

import * as serviceWorker from './serviceWorker';
import logout from './componentes/logout';

function authentication(nextState, replace) {
    const url = nextState.location.pathname;
    if(localStorage.getItem('auth-token') === null){
        return <Redirect to='/' />;
    }
    // if(url != '/' && url != '/timeline'){
    //     return <Error url={window.location.href} />;
    // }
    return <App/>;

}
ReactDOM.render(
    <BrowserRouter>
        <Switch>

            <Route exact path="/" component={Login} ></Route>
            <Route path="/timeline/:login" component={App}/>   
            <Route exact path="/timeLine" render={authentication} ></Route>

            <Route path="/logout" component={logout} ></Route>



        </Switch>
    </BrowserRouter>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
