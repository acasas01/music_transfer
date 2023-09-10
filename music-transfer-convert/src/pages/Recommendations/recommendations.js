import React from "react";

class Recommendations extends Component {
    render() {
        return <h1>Hello, {this.props.name}!</h1>;
      }
    }
    
    export default function App() {
      return (
        <>
          <Recommendations name="Sara" />
          
        </>
      );
    }