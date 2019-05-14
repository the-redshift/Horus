import React from 'react';
import './App.css';

class App extends React.Component {

render() {
return (
    <div class="app">

	<div class="header">
	  <h1 class="display-3">siemaneczko</h1>
	  <p>taki tam poczateczek</p>
	</div>

      <div>

        <div class="row">
          <div class="col-md-3 column">
            <h2>wybor kamery</h2>
            <p>tutaj bedzie wybor kamer</p>
            <p><a class="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
          </div>
          <div class="col-md-6 column">
            <h2>kamery</h2>
            <p> tutaj bedzie widok kamer</p>
            <p><a class="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
          </div>
          <div class="col-md-3 column">
            <h2>obiekty</h2>
            <p> a tu proszem ja cb bedzie wybor obiektow</p>
            <p><a class="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
          </div>
        </div>

        <hr/>

      </div> 

    </div>
);}}

export default App;
