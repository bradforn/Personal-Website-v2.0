import React from 'react';
import './css/body.css';
//import PropTypes from 'prop-types';

//const App = () => <h1> Hello </h1>

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      Name: 'Nick W. Bradford',
      temp: ''
    }
  }
  update (e){
    this.setState({txt: e.target.value})
  }
  render(){
    //let txt = this.props.txt
    let test = this.state.test
    let txt = this.state.txt
    return(
      <canvas class="background">
        <div class='body'>
        <div class='header-body'>
        <canvas class="background"></canvas>
          <div class ='top-item-menuBar-header-body'></div>
         <div class ='item-menuBar-header-body'>First Test</div>
          <div class ='item-menuBar-header-body'>Second Test</div>
        </div>
                  <Button><Heart />React</Button>
        </div>
        
      </canvas>






    )
    //return React.createElement('h1', null, 'Hello-World')
    // return (
    //   <div>
    //     <h1 className="">Hello World</h1>
    //     <b>Bold</b>
    //   </div>
    // )
  }
 }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const Button = (props) => <button>{props.children}</button>
class Heart extends React.Component {
  render(){
    return(
      <div>
        <span>&hearts;</span>
      </div>
    )
  }
}


class menu extends React.Component{
  render(){
    return(
      <div>
      <canvas class="background"></canvas>
      </div>
    )
  }
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const Widget = (props) =>
  <input type="text" onChange={props.update} />
t: "This is the default txt"



export default  App
