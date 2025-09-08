import React from 'react'

const Card = ({ children, className = '', elevated = false, onClick, ...props }) => {
  const baseClasses = 'bg-white rounded-lg transition-all duration-150'
  const shadowClasses = elevated ? 'shadow-modal' : 'shadow-card'
  const hoverClasses = onClick ? 'cursor-pointer hover:shadow-lg' : ''
  
  const classes = `${baseClasses} ${shadowClasses} ${hoverClasses} ${className}`
  
  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  )
}

export default Card