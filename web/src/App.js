import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';

import Login from './Login';
import Main from './Main';

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={Login} />
                    <Route path="/main" component={Main} />
                </div>
            </Router>
        );
    }
}

export default App;
