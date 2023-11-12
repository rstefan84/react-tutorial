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
    return (
      <MainListPagePresentation {...this.state} />
    )
  }
}

export default MainListPage;

function MainListPagePresentation(props) {
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
          <Body {...props} />
        </tbody>
      </table>
    </div>
  )
}

function Body({elements}) {
  return (
    elements.length > 0
      ? elements.map(element=><Row key={element.position} {...element} />)
      : <LoadTime colSpan="4"/>
    )
}

function LoadTime({colSpan}) {
  return (
    <tr><td colSpan={colSpan}>Please wait while loading</td></tr>
  )
}

function Row({position,name,weight,symbol}) {
  return (
    <tr>
      <td>{position}</td>
      <td>{name}</td>
      <td>{weight}</td>
      <td>{symbol}</td>
    </tr>
  )
}