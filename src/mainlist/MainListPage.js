import React from 'react';
import getDataProvider from '../DataProvider';
// old class style
class MainListPage extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      elements: []
    };
  }

  // Lifecycle Method
  componentDidMount() {
    // get Data from provider and set to local state
    // subscribe to updates, ...
    console.log('componentDidMount');
    getDataProvider()
      .getMainListData()
      .then(elements => this.setState({elements}))
  }

  componentWillUnmount() {
    // Do unmount - never set state here
    // unsubscribe from updates, ... 
    console.log('componentWillUnmount');
  }

  render() {
    let rows = this.state.elements.map(element => {
      return (
        <tr key={element.position}>
          <td>{element.position}</td>
          <td>{element.name}</td>
          <td>{element.weight}</td>
          <td>{element.symbol}</td>
        </tr>
      )
    });  

    return (
      <div>
      	<h2>Main List Page</h2>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Weight</th>
              <th>Symbol</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
    	</div>
    )
  }
}

export default MainListPage;