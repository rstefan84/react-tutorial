import React, { useState, useEffect } from 'react';
import getDataProvider from '../DataProvider';
import PropTypes from 'prop-types';

function MainListPage() {
  
  let [originalElements, setOriginalElements] = useState([])
  let [elements, setElements] = useState([])

  const changeFilter = (filterValue) => {
    let filteredElements = filterValue ?
      originalElements.filter(
        element => element.name.toLowerCase().includes(filterValue.toLowerCase())
      ) : originalElements

    setElements(filteredElements)
  }

  useEffect(()=>{
    console.log('DidMount from effect hook')
    getDataProvider()
      .getMainListData()
      .then(loadedElements => {
        setOriginalElements(loadedElements)
        setElements(loadedElements)
      })
      return () => {
        console.log('cleanup code')
      }
  },[]) // No dependencies - exec useEffect only once!

  return (
    <MainListPagePresentation elements={elements} changeFilter={changeFilter} />
  )
}

export default MainListPage;

function MainListPagePresentation({elements, changeFilter}) {
  return (
    <div>
      <h2>Main List Page</h2>
      <Filter changeFilter={changeFilter} />
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
          <Body elements={elements} />
        </tbody>
      </table>
    </div>
  )
}

function Filter({changeFilter}) {
  let [filterValue, setFilterValue] = useState('')

  const internalChangeFilter=(e) => {
    setFilterValue(e.target.value)
    changeFilter(e.target.value)
  }
  
  return (
    <div>
      <label htmlFor="filter">Filter :&nbsp;</label>
      <input id='filter' value={filterValue} onChange={internalChangeFilter} />
    </div>
  )
}

function Body({elements}) {
  return (
    elements.length > 0
      ? elements.map(element=><Row key={element.position} {...element} />)
      : <LoadTime colSpan={4} /*render={ msg => <h1>{msg}</h1> }*/ />
  )
}

function LoadTime({colSpan, render}) {
  let msg = "Please wait while loading"
  let view = render ? render(msg) : <p>{msg}</p>
  return (
    <tr><td colSpan={colSpan}>{view}</td></tr>
  )
}

LoadTime.propTypes = {
  colSpan:PropTypes.number.isRequired,
  render:PropTypes.func
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