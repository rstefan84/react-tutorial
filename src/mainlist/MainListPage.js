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
      <MainListEdit />
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
      <label htmlFor="filter">Filter:&nbsp;</label>
      <input id='filter' value={filterValue} onChange={internalChangeFilter} />
    </div>
  )
}

function MainListEdit() {
  let defaultValues = {
    position: '',
    name: '',
    weight: '',
    symbol: ''
  }
  let [editValues,changeValues] = useState(defaultValues);

  let onChangedSimpleInput = (inputId,value) => {
    changeValues({
      ...editValues,
      [inputId]:value
    })
  }
  
  return(
    <table>
      <tbody>
        <tr>
          <td>
            <SimpleInput inputId='position' 
              size='3' 
              name='Pos' 
              defaultValue={editValues.position} 
              onChanged={onChangedSimpleInput}
            />
          </td>
          <td>
            <SimpleInput inputId='name' 
              size='15' 
              name='Name' 
              defaultValue={editValues.name} 
              onChanged={onChangedSimpleInput}
            />
          </td>
          <td>
            <SimpleInput inputId='weight' 
              size='6' 
              name='Weight' 
              defaultValue={editValues.weight} 
              onChanged={onChangedSimpleInput}
            />
          </td>
          <td>
            <SimpleInput inputId='symbol' 
              size='3' 
              name='Symbol' 
              defaultValue={editValues.symbol} 
              onChanged={onChangedSimpleInput}
            />
          </td>
          <td>
            &nbsp;&nbsp;&nbsp;
            <button>Save</button>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

function SimpleInput({inputId,size, name, defaultValue,onChanged}) {
  let [value,setValue]=useState(defaultValue)
  let onChangeInput = e => setValue(e.target.value)
  let onBlurInput = e => onChanged(inputId,value)
  return (
    <>
      <label htmlFor={inputId}>{name}:&nbsp;</label>
      <input id={inputId} size={size}
        value={value}
        onChange={onChangeInput}
        onBlur={onBlurInput}
      />
    </>
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