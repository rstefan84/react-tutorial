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
      return apply_LOAD_DATA_ERROR(action, state);

    case ACTIONS.INIT_ELEMENTS:
      return apply_INIT_ELEMENTS(action);

    case ACTIONS.SAVE_ELEMENT:
      return apply_SAVE_ELEMENT(action, state);

    case ACTIONS.SET_FILTER:
      return apply_SET_FILTER(action, state);

    case ACTIONS.DELETE_ELEMENT:
      return apply_DELETE_ELEMENT(action, state);

    case ACTIONS.SELECT_ELEMENT:
      return apply_SELECT_ELEMENT(action, state);

    default:
      return state;
  }
}

export default reduxList;

function apply_SELECT_ELEMENT(action, state) {
  let selected_position = action.payload;
  let selected = state.originalElements.find(el => el.position === selected_position);
  return {
    ...state,
    selected
  };
}

function apply_DELETE_ELEMENT(action, state) {
  let position = action.payload;
  let lessOriginalElements = [
    ...state.originalElements.filter(el => el.position !== position)
  ];
  return {
    originalElements: lessOriginalElements,
    elements: lessOriginalElements
  };
}

function apply_SET_FILTER(action, state) {
  let filterValue = action.payload;
  let filteredElements = filterValue ?
    state.originalElements.filter(
      element => element.name.toLowerCase().includes(filterValue.toLowerCase())
    ) : state.originalElements;
  return {
    ...state,
    elements: filteredElements
  };
}

function apply_SAVE_ELEMENT(action, state) {
  let element = action.payload;
  let newOriginalElements = [
    ...state.originalElements.filter(el => el.position !== element.position),
    element
  ];
  return {
    originalElements: newOriginalElements,
    elements: newOriginalElements
  };
}

function apply_INIT_ELEMENTS(action) {
  let loadedElements = action.payload;
  return {
    originalElements: [...loadedElements],
    elements: [...loadedElements]
  };
}

function apply_LOAD_DATA_ERROR(action, state) {
  let error_info = action.payload;
  return {
    ...state,
    loadingError: `Problem in loading: ${error_info}`
  };
}
