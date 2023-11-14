import React, { useState, useEffect } from 'react';
import getDataProvider from '../DataProvider';
import PropTypes from 'prop-types';

// ADD FOR REDUX - START
import { connect } from 'react-redux'
import {
  createLoadData,
  createSaveElement,
  createSetFilter,
  createDeleteElement,
  createSelectElement
} from '../redux/reduxListActions'

// ReduxListPage
const mapStateToProps_ReduxListPage = state => {
  let loadingError = state.reduxList.loadingError
  return {
    loadingError
  }
}

const mapDispatchToProps_ReduxListPage = {
  loadData: createLoadData
}

const ReduxListPage = connect(
  mapStateToProps_ReduxListPage,
  mapDispatchToProps_ReduxListPage
)(_ReduxListPage)

function _ReduxListPage({ loadData, loadingError }) {

  useEffect(() => {
    loadData()
  }, [loadData])

  let error_msg = ''
  if (loadingError) {
    error_msg = <p>{loadingError}</p>
  }

  return (
    <>
      {error_msg}
      <ReduxListPagePresentation />
    </>
  )
}

export default ReduxListPage;

function ReduxListPagePresentation() {
  let body = <Body />
  let edit = <MainListEdit />

  return (
    <div>
      <h2>Redux List Page</h2>
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

const mapStateToProps_Filter = state => {
  return {
  }
}

const mapDispatchToProps_Filter = {
  setFilter: createSetFilter
}

const Filter = connect(
  mapStateToProps_Filter,
  mapDispatchToProps_Filter
)(_Filter)

function _Filter({ setFilter }) {
  let [filterValue, setFilterValue] = useState('')

  const internalChangeFilter = (e) => {
    setFilterValue(e.target.value)
    setFilter(e.target.value)
  }

  return (
    <div>
      <label htmlFor="filter">Filter:&nbsp;</label>
      <input id='filter' value={filterValue} onChange={internalChangeFilter} />
    </div>
  )
}

const mapStateToProps_MainListEdit = state => {
  let selectedElement = state.reduxList.selected
  return {
    selectedElement
  }
}

const mapDispatchToProps_MainListEdit = {
  saveElement: createSaveElement
}

const MainListEdit = connect(
  mapStateToProps_MainListEdit,
  mapDispatchToProps_MainListEdit
)(_MainListEdit)

function _MainListEdit({ selectedElement, saveElement }) {
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

  let onSave = (e) => saveElement(editValues)

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

const mapStateToProps_Body = state => {
  let elements = state.reduxList.elements
  let loadingError = state.reduxList.loadingError
  return {
    elements,
    loadingError
  }
}

const mapDispatchToProps_Body = {
}

const Body = connect(
  mapStateToProps_Body,
  mapDispatchToProps_Body
)(_Body)

function _Body({ elements, loadingError }) {
  let load_info = loadingError ?
    <LoadTime colSpan={5} render={msg => <h1>{loadingError}</h1>} /> :
    <LoadTime colSpan={5} />


  return (
    elements.length > 0
      ? elements.map(element => <Row key={element.position} {...{ ...element }} />)
      : load_info
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

const mapStateToProps_Row = state => {
  return {
  }
}

const mapDispatchToProps_Row = {
  selectElement: createSelectElement,
  deleteElement: createDeleteElement
}

const Row = connect(
  mapStateToProps_Row,
  mapDispatchToProps_Row
)(_Row)

function _Row({ position, name, weight, symbol, selectElement, deleteElement }) {
  return (
    <tr>
      <td>{position}</td>
      <td>{name}</td>
      <td>{weight}</td>
      <td>{symbol}</td>
      <td>
        <button onClick={(e) => selectElement(position)}>Select</button>
        <button onClick={(e) => deleteElement(position)}>Delete</button>
      </td>
    </tr>
  )
}