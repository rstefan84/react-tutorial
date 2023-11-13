import React, { useState, useEffect, useReducer, useContext } from 'react';
import getDataProvider from '../DataProvider';
import PropTypes from 'prop-types';

const ACTIONS = {
  INIT_ELEMENTS : 'MAINLIST/INIT_ELEMENTS',
  SAVE_ELEMENT : 'MAINLIST/SAVE_ELEMENT',
  SET_FILTER : 'MAINLIST/SET_FILTER',
  DELETE_ELEMENT : 'MAINLIST/DELETE_ELEMENT'
}

const createInitElements = payload => { return {type:ACTIONS.INIT_ELEMENTS, payload}}
const createSaveElement = payload => { return {type:ACTIONS.SAVE_ELEMENT, payload}}
const createSetFilter = payload => { return {type:ACTIONS.SET_FILTER, payload}}
const createDeleteElement = payload => { return {type:ACTIONS.DELETE_ELEMENT, payload}}

const mainListReducer = (state,action) => {
  switch(action.type) {
    case ACTIONS.INIT_ELEMENTS:
      let loadedElements = action.payload
      return {
          originalElements:[...loadedElements],
          elements:[...loadedElements]
      }

    case ACTIONS.SAVE_ELEMENT:
      let element=action.payload
      let newOriginalElements = [
        ...state.originalElements.filter(el=>el.position!==element.position),
        element
      ] 
      return {
        originalElements:newOriginalElements,
        elements:newOriginalElements
      }

    case ACTIONS.SET_FILTER:
      let filterValue=action.payload
      let filteredElements = 
        filterValue?
        state.originalElements.filter(
          element => element.name.toLowerCase().includes(filterValue.toLowerCase())
        ):state.originalElements
      return {
        ...state,
        elements:filteredElements
      }

    case ACTIONS.DELETE_ELEMENT:
      let position = action.payload
      let lessOriginalElements = [
        ...state.originalElements.filter(el=>el.position!==position)
      ] 
      return {
        originalElements:lessOriginalElements,
        elements:lessOriginalElements
      }

    default:
      throw new Error()
  }
}

// Create Dispatch Context Object 
const DispatchContext = React.createContext(null)

function MainListPage() {
  
  let [state,dispatch] = useReducer(mainListReducer,{
    originalElements:[],
    elements:[]
  })

  const changeFilter = filterValue => {
    dispatch(createSetFilter(filterValue))
  }

  let saveElement = (element) => {
    dispatch(createSaveElement(element))
  }

  useEffect(()=>{
    console.log('DidMount from effect hook')
    getDataProvider()
      .getMainListData()
      .then(loadedElements => {
        dispatch(createInitElements(loadedElements))
      })
      return () => {
        console.log('cleanup code')
      }
  },[]) // No dependencies - exec useEffect only once!

  return (
    <DispatchContext.Provider value={dispatch}>
      <MainListPagePresentation elements={state.elements} />
    </DispatchContext.Provider>
  )
}

export default MainListPage;

function useSelectedElement(elements) {
  let [selectedElement,setSelectedElement] = useState(null)

  let selectElement = position => {
    let element = elements.find(el=> el.position === position)
    if(element) {
      setSelectedElement(element)
    }
  }

  return [selectedElement, selectElement]
}

function MainListPagePresentation({elements, saveElement}) {
  let [selectedElement,selectElement] = useSelectedElement(elements)

  return (
    <div>
      <h2>Main List Page</h2>
      <Filter />
      <MainListEdit {...{selectedElement}} />
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Weight</th>
            <th>Symbol</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <Body elements={elements} selectElement={selectElement} />
        </tbody>
      </table>
    </div>
  )
}

function Filter({changeFilter}) {
  let [filterValue, setFilterValue] = useState('')

  // USE CONTEXT AND DISPATCH SAVE_ELEMENT ACTION
  let dispatch = useContext(DispatchContext)

  const internalChangeFilter=(e) => {
    setFilterValue(e.target.value)
    dispatch(createSetFilter(e.target.value))
  }
  
  return (
    <div>
      <label htmlFor="filter">Filter:&nbsp;</label>
      <input id='filter' value={filterValue} onChange={internalChangeFilter} />
    </div>
  )
}

function MainListEdit({selectedElement}) {
  let defaultValues = {
    position: '',
    name: '',
    weight: '',
    symbol: ''
  }
  let [editValues,changeValues] = useState(defaultValues);

  useEffect(()=>{
    if(selectedElement) {
      changeValues(selectedElement) 
    }
  },[selectedElement])

  let onChangedSimpleInput = (inputId,value) => {
    changeValues({
      ...editValues,
      [inputId]:value
    })
  }

  // USE CONTEXT AND DISPATCH SAVE_ELEMENT ACTION
  let dispatch = useContext(DispatchContext)

  let onSave = (e) => dispatch(createSaveElement(editValues))
  
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
            <button onClick={onSave}>Save</button>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

function SimpleInput({inputId,size, name, defaultValue,onChanged}) {
  let [value,setValue]=useState(defaultValue)

  useEffect(()=>setValue(defaultValue),[defaultValue])

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

function Body({elements, selectElement}) {
  return (
    elements.length > 0
      ? elements.map(element=><Row key={element.position} {...{...element, selectElement}} />)
      : <LoadTime colSpan={5} /*render={ msg => <h1>{msg}</h1> }*/ />
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

function Row({position,name,weight,symbol,selectElement}) {
  let dispatch = useContext(DispatchContext)
  
  return (
    <tr>
      <td>{position}</td>
      <td>{name}</td>
      <td>{weight}</td>
      <td>{symbol}</td>
      <td>
        <button onClick={(e)=>selectElement(position)}>Select</button>
        <button onClick={(e)=>dispatch(createDeleteElement(position))}>Delete</button>
      </td>
    </tr>
  )
}