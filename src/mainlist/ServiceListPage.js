import React, { useState, useEffect, useContext } from 'react';
import getServiceDataProvider from '../ServiceDataProvider';
import PropTypes from 'prop-types';

const ServiceContext = React.createContext(null)

function ServiceListPage() {
  
  return (
    <ServiceContext.Provider value={getServiceDataProvider()}>
      <ServiceListPagePresentation />
    </ServiceContext.Provider>
  )
}

export default ServiceListPage;

function ServiceListPagePresentation() {
  let body = <Body/>
  let edit = <ServiceListEdit/>

  return (
    <div>
      <h2>Service List Page</h2>
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

  let service = useContext(ServiceContext)

  const internalChangeFilter=(e) => {
    setFilterValue(e.target.value)
    service.filter(e.target.value)
  }
  
  return (
    <div>
      <label htmlFor="filter">Filter:&nbsp;</label>
      <input id='filter' value={filterValue} onChange={internalChangeFilter} />
    </div>
  )
}

function ServiceListEdit() {
  let defaultValues = {
    position: '',
    name: '',
    weight: '',
    symbol: ''
  }
  let [editValues,changeValues] = useState(defaultValues);

  let service = useContext(ServiceContext)

  useEffect(()=>{
    let subscription = service.getSelectedElement$()
      .subscribe((selectedElement)=>{
        if(selectedElement)
          changeValues(selectedElement)
        })
        return ()=>{
          subscription.unsubscribe()
        }
    },[service])

  let onChangedSimpleInput = (inputId,value) => {
    changeValues({
      ...editValues,
      [inputId]:value
    })
  }

  let onSave = (e) => service.saveElement(editValues)
  
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

function Body() {
  
  let service = useContext(ServiceContext)
  let [elements,setElements]=useState([])
  useEffect(()=>{
    let subscription = service.getElements$()
    .subscribe((newElements)=>{
      setElements(newElements)
    })
    return ()=>{
      subscription.unsubscribe()
    }
  },[service])

  return (
    elements.length > 0
      ? elements.map(element=><Row key={element.position} {...{...element}} />)
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

function Row({position,name,weight,symbol}) {
  let service = useContext(ServiceContext)
  
  return (
    <tr>
      <td>{position}</td>
      <td>{name}</td>
      <td>{weight}</td>
      <td>{symbol}</td>
      <td>
        <button onClick={(e)=>service.selectElement(position)}>Select</button>
        <button onClick={(e)=>service.deleteElement(position)}>Delete</button>
      </td>
    </tr>
  )
}