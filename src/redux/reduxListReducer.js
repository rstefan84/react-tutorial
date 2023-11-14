import ACTIONS from "./reduxListActions";

const base_state = {
  originalElements: [],
  elements: []
}

const reduxList = (state = base_state, action) => {
  switch (action.type) {
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

    default:
      return state;
  }
}

export default reduxList;