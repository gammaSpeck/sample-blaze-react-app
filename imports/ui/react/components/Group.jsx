import React from 'react'

const DeleteButton = () => <button className='delete'>&times;</button>

const GroupJSX = ({ group, setFilterByGroup, filterByGroupId }) => {
  console.log('Attributes are:', { group, setFilterByGroup, filterByGroupId })

  const onClick = (event) => {
    setFilterByGroup(group._id)
  }

  let className = `Group ${group._id === filterByGroupId ? 'selected' : ''}`

  return (
    <>
      <button className={className} onClick={onClick}>
        {group.name}
      </button>
      {/* <DeleteButton /> */}
    </>
  )
}

export default GroupJSX
