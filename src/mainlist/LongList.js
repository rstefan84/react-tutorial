import React from 'react'

let global_list = [];

(function () {
  for (let x = 1; x < 100000; x++) {
    global_list.push({
      id: x,
      text: `Element Nr.: ${x}`
    })
  }
})()


function LongListPage() {
  return (
    <LongListPresentation listItems={global_list} />
  )
}

export default LongListPage

let redrawCounter = 0

function recalcSlice(listItems, scrollPosition, itemsToRender, heightOfItem) {
  let isScrollOnStart = (scrollPosition - itemsToRender) < 0
  let startPosition = isScrollOnStart ? 0 : scrollPosition - itemsToRender

  let isScrollOnEnd = (scrollPosition + itemsToRender) >= listItems.length
  let endPosition = isScrollOnEnd ? listItems.length : scrollPosition + itemsToRender

  let spacerTopHeight = startPosition * heightOfItem
  let spacerBottomHeight = listItems.length * heightOfItem - endPosition * heightOfItem

  let listSlice = listItems.slice(startPosition, endPosition)

  return {
    listSlice,
    spacerTopHeight,
    spacerBottomHeight
  }
}

export { redrawCounter }

function LongListPresentation({ listItems }) {
  const heightOfItem = 35
  const maxItemsToRender = 16 // set to 15 or less to see updates while scrolling
  const itemsToRender = maxItemsToRender / 2

  let [scrollPosition, setScrollPosition] = React.useState(0)

  console.log('redraw ' + redrawCounter++)

  const updateScrollPosition = (e) => {
    const newScrollPosition = e.target.scrollTop / heightOfItem
    const difference = Math.abs(scrollPosition - newScrollPosition)
    if (difference >= itemsToRender / 2) {
      setScrollPosition(newScrollPosition)
    }
  }

  const {
    listSlice,
    spacerTopHeight,
    spacerBottomHeight
  } = recalcSlice(listItems, scrollPosition, itemsToRender, heightOfItem)

  const spacerTopStyle = {
    height: spacerTopHeight
  }

  const spacerBottomStyle = {
    height: spacerBottomHeight
  }

  const itemStyle = {
    height: `${heightOfItem}px`,
    padding: '5px'
  }

  const listStyle = {
    height: '300px',
    width: '400px',
    overflowY: 'scroll',
    border: '#ddd solid 1px'
  }

  return (
    <div style={listStyle} onScroll={updateScrollPosition}>
      <div key='list-spacer-top' style={spacerTopStyle}></div>
      {listSlice.map((item) => {
        return (
          <div key={item.id} style={itemStyle} className='longlistitem'>
            <p>{item.text}</p>
          </div>
        )
      })}
      <div key='list-spacer-bottom' style={spacerBottomStyle}></div>
    </div>
  )
}