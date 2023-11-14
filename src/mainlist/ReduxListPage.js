import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux'
import {
  createLoadData,
  createSaveStart,
  createSetFilter,
  createDeleteStart,
  createSelectElement,

  selectElements,
  selectLoadingError,
  selectSelected,
  selectSavingError,
  selectDeleteError
} from '../redux/reduxListActions'

// ReduxListPage
function ReduxListPage() {

  let loadingError = useSelector(selectLoadingError)
  let savingError = useSelector(selectSavingError)
  let deleteError = useSelector(selectDeleteError)
  let dispatch = useDispatch()

  useEffect(() => {
    dispatch(createLoadData())
  }, [dispatch])

  let error_msg = ''
  if (loadingError) {
    error_msg = <div className='alert alert-danger'>{loadingError}</div>
  }
  if (savingError) {
    error_msg = <>{error_msg}<div className='alert alert-danger'>{savingError}</div></>
  }
  if (deleteError) {
    error_msg = <>{error_msg}<div className='alert alert-danger'>{deleteError}</div></>
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

function Filter() {
  let [filterValue, setFilterValue] = useState('')
  let dispatch = useDispatch()

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

function MainListEdit() {
  let selectedElement = useSelector(selectSelected)
  let dispatch = useDispatch()

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

  let onSave = (e) => dispatch(createSaveStart(editValues))

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

function Body() {
  let elements = useSelector(selectElements)
  let loadingError = useSelector(selectLoadingError)

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

function Row({ position, name, weight, symbol }) {
  let dispatch = useDispatch()

  return (
    <tr>
      <td>{position}</td>
      <td>{name}</td>
      <td>{weight}</td>
      <td>{symbol}</td>
      <td>
        <button onClick={(e) => dispatch(createSelectElement(position))}>Select</button>
        <button onClick={(e) => dispatch(createDeleteStart(position))}>Delete</button>
      </td>
    </tr>
  )
}