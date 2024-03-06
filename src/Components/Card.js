import React from 'react'

function Card( content) {
    const { Title, Category, Description, Charges}=content
  return (
    <div>
       <h2>{Title}</h2> 
       <p>{Category}</p>
       <p>{Description}</p>
       <p>{Charges}</p>
    </div>
  )
}

export default Card