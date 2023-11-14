import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import getDataProvider from '../DataProvider';
import PropTypes from 'prop-types';

// ADD FOR REDUX - START
import { connect } from 'react-redux'
import {
  createInitElements,
  createSaveElement,
  createSetFilter,
  createDeleteElement
} from '../redux/reduxListActions'

// Create Dispatch Context Object 
const DispatchContext = React.createContext(null)

// ReduxListPage
const mapStateToProps_ReduxListPage = state => {
  let elements = state.reduxList.elements
  return {
    elements
  }
}

const mapDispatchToProps_ReduxListPage = dispatch => {
  return { dispatch }
}

const ReduxListPage = connect(
  mapStateToProps_ReduxListPage,
  mapDispatchToProps_ReduxListPage
)(_ReduxListPage)

function _ReduxListPage({elements, dispatch}) {

  useEffect(() => {
    console.log('DidMount from effect hook')
    getDataProvider()
      .getMainListData()
      .then(loadedElements => {
        dispatch(createInitElements(loadedElements))
      })
    return () => {
      console.log('cleanup code')
    }
  }, [dispatch]) // No dependencies - exec useEffect only once!

  return (
    <DispatchContext.Provider value={dispatch}>
      <MainListPagePresentation elements={elements} />
    </DispatchContext.Provider>
  )
}

export default ReduxListPage;

function useSelectedElement(elements) {
  let [selectedElement, setSelectedElement] = useState(null)

  let selectElement = useCallback(position => {
    let element = elements.find(el => el.position === position)
    if (element) {
      setSelectedElement(element)
    }
  }, [elements])

  return [selectedElement, selectElement]
}

function MainListPagePresentation({ elements }) {
  let [selectedElement, selectElement] = useSelectedElement(elements)

  let body = useMemo(() => {
    return <Body elements={elements} selectElement={selectElement} />
  }, [elements, selectElement])

  let edit = useMemo(() => {
    return <MainListEdit {...{ selectedElement }} />
  }, [selectedElement])

  return (
    <div>
      <h2>Main List Page</h2>
      <Filter />
      {edit}
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
          {body}
        </tbody>
      </table>
    </div>
  )
}

function Filter() {
  let [filterValue, setFilterValue] = useState('')

  // USE CONTEXT AND DISPATCH SAVE_ELEMENT ACTION
  let dispatch = useContext(DispatchContext)

  const internalChangeFilter = (e) => {
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

function MainListEdit({ selectedElement }) {
  let defaultValues = {
    position: '',
    name: '',
    weight: '',
    symbol: ''
  }
  let [editValues, changeValues] = useState(defaultValues);

  useEffect(() => {
    if (selectedElement) {
      changeValues(selectedElement)
    }
  }, [selectedElement])

  let onChangedSimpleInput = (inputId, value) => {
    changeValues({
      ...editValues,
      [inputId]: value
    })
  }

  // USE CONTEXT AND DISPATCH SAVE_ELEMENT ACTION
  let dispatch = useContext(DispatchContext)

  let onSave = (e) => dispatch(createSaveElement(editValues))

  return (
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

function SimpleInput({ inputId, size, name, defaultValue, onChanged }) {
  let [value, setValue] = useState(defaultValue)

  useEffect(() => setValue(defaultValue), [defaultValue])

  let onChangeInput = e => setValue(e.target.value)
  let onBlurInput = e => onChanged(inputId, value)
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

function Body({ elements, selectElement }) {
  return (
    elements.length > 0
      ? elements.map(element => <Row key={element.position} {...{ ...element, selectElement }} />)
      : <LoadTime colSpan={5} /*render={ msg => <h1>{msg}</h1> }*/ />
  )
}

function LoadTime({ colSpan, render }) {
  let msg = "Please wait while loading"
  let view = render ? render(msg) : <p>{msg}</p>
  return (
    <tr><td colSpan={colSpan}>{view}</td></tr>
  )
}

LoadTime.propTypes = {
  colSpan: PropTypes.number.isRequired,
  render: PropTypes.func
}

function Row({ position, name, weight, symbol, selectElement }) {
  let dispatch = useContext(DispatchContext)

  return (
    <tr>
      <td>{position}</td>
      <td>{name}</td>
      <td>{weight}</td>
      <td>{symbol}</td>
      <td>
        <button onClick={(e) => selectElement(position)}>Select</button>
        <button onClick={(e) => dispatch(createDeleteElement(position))}>Delete</button>
      </td>
    </tr>
  )
}