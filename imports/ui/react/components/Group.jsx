import React from 'react'

const GroupJSX = ({ group, setFilterByGroup, filterByGroupId }) => {
  console.log('Attributes are:', { group, setFilterByGroup, filterByGroupId })

  const onClick = (event) => {
    setFilterByGroup(group._id)
  }

  let className = `Group ${group._id === filterByGroupId ? 'selected' : ''}`

  return (
    <button className={className} onClick={onClick}>
      {group.name}
    </button>
  )
}

export default GroupJSX
