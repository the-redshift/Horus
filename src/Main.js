import React from 'react';
import './main.css';
import { withRouter } from 'react-router-dom';

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        this.props.history.push("/");
    }

render() {
return (
    <div>

	<div className="header">
        <div className="btn-logout">
            <button type="button" class="btn btn-default btn-logout" onClick={this.handleLogout}>
                <span><i className="fa fa-sign-out pr-2" /> Log out </span>
            </button>
            <button type="button" className="btn secondary">Log out</button>
        </div>
	</div>

      <div className ="app">

        <div className="row">
          <div className="col-md-3 column">
            <h2>Choose camera</h2>
            <p>Choose camera which view you would like to see in the center pane</p>
            <p><a className="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
          </div>
          <div className="col-md-6 column">
            <h2>Cameras</h2>
            <p> View from the selected camera will be displayed in here - user can choose
                camera in the left panel and objects to recognize in the right panel</p>
            <p><a className="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
          </div>
          <div className="col-md-3 column">
            <h2>Choose objects</h2>
            <p>Choose objects that you want to recognize from the CCTV</p>
            <p><a className="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
          </div>
        </div>
      </div>

    </div>
);}}

export default withRouter(Main);
