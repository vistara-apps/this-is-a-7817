import React from 'react'

const InputText = ({ 
  variant = 'default',
  className = '',
  placeholder,
  value,
  onChange,
  rows,
  ...props 
}) => {
  const baseClasses = 'w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
  
  if (variant === 'textarea') {
    return (
      <textarea
        className={`${baseClasses} resize-none ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows || 3}
        {...props}
      />
    )
  }
  
  return (
    <input
      type="text"
      className={`${baseClasses} ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  )
}

export default InputText