import React from 'react'
import { render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react'

import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import reducer from '../redux'

import thunk from 'redux-thunk'

import ReduxListPage from './ReduxListPage'
import axios from 'axios'
import { createSelectElement } from '../redux/reduxListActions'

jest.mock('axios')

// this is a helper function that is normally made available for all tests
// that deal with connected components.
// you can provide initialState for the entire store that the ui is rendered with
function renderWithRedux(
  ui,
  {
    initialState,
    store = configureStore({
      reducer,
      preloadedState: initialState,
      applyMiddleware: thunk
    })
  } = {}
) {
  return {
    ...render(
      <Provider store={store}>
        {ui}
      </Provider>),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  }
}

test('render ReduxListPage (and check Hydrogen List Element after load)', async () => {
  const data = [
    { id: 1, position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' }
  ]
  const resp = { data }

  axios.get.mockImplementation(() => Promise.resolve(resp));

  const { getByText, debug } = renderWithRedux(<ReduxListPage />)

  await waitForElementToBeRemoved(() => getByText(/Please wait while loading/i), { timeout: 5000 })
  const hydrogenElement = getByText(/Hydrogen/i)

  expect(hydrogenElement).toBeInTheDocument()
  expect(axios.get).toHaveBeenCalledTimes(1);
  expect(axios.get).toHaveBeenCalledWith(
    'http://localhost:3005/elements'
  );

  //debug()
  axios.get.mockReset() // reset any mock result value so it doesn't affect other tests
})

test('render ReduxListPage and test store dispatch', async () => {
  const data = [
    { id: 1, position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' }
  ]
  const response = { status: 200, data }

  axios.get.mockImplementation(() => Promise.resolve(response));

  const { getByText, debug, store } = renderWithRedux(<ReduxListPage />)

  await waitForElementToBeRemoved(() => getByText(/Please wait while loading/i), { timeout: 5000 })

  // check state before action
  let original_state = store.getState()
  expect(original_state.reduxList.selected).toBeFalsy()

  store.dispatch(createSelectElement(data[0].position))

  // check state after action -- remember to request the new state
  let new_state = store.getState()
  expect(new_state.reduxList.selected.position).toEqual(data[0].position)

  // Take a look into the states
  //console.log(original_state)
  //console.log(new_state)
  //debug()
  axios.get.mockReset() // reset any mock result value so it doesn't affect other tests
})