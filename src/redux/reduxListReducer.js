import ACTIONS from "./reduxListActions";

const base_state = {
  originalElements: [],
  elements: [],
  selected: null,
  loadingError: null
}

const reduxList = (state = base_state, action) => {
  switch (action.type) {
    case ACTIONS.LOAD_DATA_ERROR:
      let error_info = action.payload
      return {
        ...state,
        loadingError: `Problem in loading: ${error_info}`
      }

    case ACTIONS.INIT_ELEMENTS:
      let loadedElements = action.payload
      return {
        originalElements: [...loadedElements],
        elements: [...loadedElements]
      }

    case ACTIONS.SAVE_ELEMENT:
      let element = action.payload
      let newOriginalElements = [
        ...state.originalElements.filter(el => el.position !== element.position),
        element
      ]
      return {
        originalElements: newOriginalElements,
        elements: newOriginalElements
      }

    case ACTIONS.SET_FILTER:
      let filterValue = action.payload
      let filteredElements =
        filterValue ?
          state.originalElements.filter(
            element => element.name.toLowerCase().includes(filterValue.toLowerCase())
          ) : state.originalElements
      return {
        ...state,
        elements: filteredElements
      }

    case ACTIONS.DELETE_ELEMENT:
      let position = action.payload
      let lessOriginalElements = [
        ...state.originalElements.filter(el => el.position !== position)
      ]
      return {
        originalElements: lessOriginalElements,
        elements: lessOriginalElements
      }

    case ACTIONS.SELECT_ELEMENT:
      let selected_position = action.payload
      let selected = state.originalElements.find(el => el.position === selected_position)
      return {
        ...state,
        selected
      }

    default:
      return state;
  }
}

export default reduxList;