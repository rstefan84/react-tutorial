import React from 'react';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import AppContainer, { App } from './App';
import { MemoryRouter } from 'react-router';

describe('Tests on AppContainer including Router', () => {

  test('renders Home Page', () => {
    const { getByText, debug } = render(<AppContainer />);
    const element = getByText(/Simple React Home/i);

    expect(element).toBeInTheDocument();
    //debug()
  });


  test('renders Main List on click to link', () => {
    const { getByText, debug } = render(<AppContainer />)
    const link = getByText(/Main List/i)
    fireEvent.click(link)
    const mainListHeader = getByText(/Main List Page/i)

    expect(mainListHeader).toBeInTheDocument()
    //debug()
  });

  test('renders Main List', async () => {
    const { getByText, getAllByText, debug } = render(<AppContainer />)
    const homeLink = getAllByText(/Home/i)
    fireEvent.click(homeLink[0])
    const mainListLink = getByText(/Main List/i)
    fireEvent.click(mainListLink)

    await waitForElementToBeRemoved(() => getByText(/Please wait while loading/i), { timeout: 5000 })
    const hydrogenElement = getByText(/Hydrogen/i)
    //debug()

    expect(hydrogenElement).toBeInTheDocument()
  });

})

describe("Tests on App with Memory Router", () => {

  test('renders Home Page', () => {
    const { getByText, debug } = render(<App />, { wrapper: MemoryRouter })
    const element = getByText(/Simple React Home/i)

    expect(element).toBeInTheDocument()
    //debug()
  });

  test('renders Main List on click to link', () => {
    const { getByText, debug } = render(<App />, { wrapper: MemoryRouter })
    const link = getByText(/Main List/i)
    fireEvent.click(link)
    const mainListHeader = getByText(/Main List Page/i)

    expect(mainListHeader).toBeInTheDocument()
    // debug()
  });

  test('renders Main List', async () => {

    const { getByText, getAllByText, debug } = render(<App />, { wrapper: MemoryRouter })
    // no longer needed since wrapper is created for each test
    //const homeLink = getAllByText(/Home/i)
    //fireEvent.click(homeLink[0])
    const mainListLink = getByText(/Main List/i)
    fireEvent.click(mainListLink)

    await waitForElementToBeRemoved(() => getByText(/Please wait while loading/i), { timeout: 5000 })
    const hydrogenElement = getByText(/Hydrogen/i)
    //debug()

    expect(hydrogenElement).toBeInTheDocument()

  });
})