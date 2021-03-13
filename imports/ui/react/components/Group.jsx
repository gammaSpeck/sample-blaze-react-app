import React from 'react'

const GroupJSX = ({ group }) => {
  console.log('Attributes are:', group)

  const onClick = (e) => {
    console.log(`${group.name} clicked`)
  }
  return (
    <button className='Group' onClick={onClick}>
      {group.name}
    </button>
  )
}

export default GroupJSX
