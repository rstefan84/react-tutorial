const ACTIONS = {
  INIT_ELEMENTS: 'REDUXLIST/INIT_ELEMENTS',
  SAVE_ELEMENT: 'REDUXLIST/SAVE_ELEMENT',
  SET_FILTER: 'REDUXLIST/SET_FILTER',
  DELETE_ELEMENT: 'REDUXLIST/DELETE_ELEMENT',
  SELECT_ELEMENT: 'REDUXLIST/SELECT_ELEMENT',
}

const createInitElements = payload => { return { type: ACTIONS.INIT_ELEMENTS, payload } }
const createSaveElement = payload => { return { type: ACTIONS.SAVE_ELEMENT, payload } }
const createSetFilter = payload => { return { type: ACTIONS.SET_FILTER, payload } }
const createDeleteElement = payload => { return { type: ACTIONS.DELETE_ELEMENT, payload } }
const createSelectElement = payload => { return { type: ACTIONS.SELECT_ELEMENT, payload } }

export default ACTIONS
export { createInitElements, createSaveElement, createSetFilter, createDeleteElement, createSelectElement }