import getDataProvider from "../DataProvider"

const ACTIONS = {
  LOAD_DATA: 'REDUXLIST/LOAD_DATA',
  LOAD_DATA_ERROR: 'REDUXLIST/LOAD_DATA_ERROR',
  INIT_ELEMENTS: 'REDUXLIST/INIT_ELEMENTS',
  SAVE_START: 'REDUXLIST/SAVE_START',
  SAVE_SUCCESS: 'REDUXLIST/SAVE_SUCCESS',
  SAVE_ERROR: 'REDUXLIST/SAVE_ERROR',
  SET_FILTER: 'REDUXLIST/SET_FILTER',
  DELETE_START: 'REDUXLIST/DELETE_START',
  DELETE_SUCCESS: 'REDUXLIST/DELETE_SUCCESS',
  DELETE_ERROR: 'REDUXLIST/DELETE_ERROR',
  SELECT_ELEMENT: 'REDUXLIST/SELECT_ELEMENT',
}

const createInitElements = payload => { return { type: ACTIONS.INIT_ELEMENTS, payload } }
const createSetFilter = payload => { return { type: ACTIONS.SET_FILTER, payload } }
const createSelectElement = payload => { return { type: ACTIONS.SELECT_ELEMENT, payload } }

const createLoadDataError = payload => { return { type: ACTIONS.LOAD_DATA_ERROR, payload } }
const createLoadData = payload => {
  return dispatch => {
    getDataProvider()
      .getMainListData()
      .then(loadedElements => {
        dispatch(createInitElements(loadedElements))
      })
      .catch(error => {
        dispatch(createLoadDataError(error))
      })
  }
}

const createSaveSuccess = payload => { return { type: ACTIONS.SAVE_SUCCESS, payload } }
const createSaveError = payload => { return { type: ACTIONS.SAVE_ERROR, payload } }

const createSaveStart = payload => {
  let element = payload
  return dispatch => {
    getDataProvider()
      .saveMainListData(element)
      .then(saved_element => {
        dispatch(createSaveSuccess(saved_element))
      })
      .catch(error => {
        dispatch(createSaveError(error))
      })
  }
}

const createDeleteSuccess = payload => { return { type: ACTIONS.DELETE_SUCCESS, payload } }
const createDeleteError = payload => { return { type: ACTIONS.DELETE_ERROR, payload } }

const createDeleteStart = payload => {
  let element = payload
  return dispatch => {
    getDataProvider()
      .deleteMainListData(element)
      .then(saved_element => {
        dispatch(createDeleteSuccess(saved_element))
      })
      .catch(error => {
        dispatch(createDeleteError(error))
      })
  }
}

export default ACTIONS
export {
  createLoadData,
  createLoadDataError,
  createInitElements,
  createSetFilter,
  createSelectElement,
  createSaveSuccess,
  createSaveError,
  createSaveStart,
  createDeleteSuccess,
  createDeleteError,
  createDeleteStart
}

const selectLoadingError = (state) => state.reduxList.loadingError
const selectSelected = (state) => state.reduxList.selected
const selectElements = (state) => state.reduxList.elements
const selectSavingError = (state) => state.reduxList.savingError
const selectDeleteError = (state) => state.reduxList.deleteError

export {
  selectLoadingError,
  selectSelected,
  selectElements,
  selectSavingError,
  selectDeleteError
}