import React from 'react'

const LoadingProcess = () => {
  return (
    <div className="flex flex-row items-center gap-1">
    <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce"></div>
    <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
    <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-.5s]"></div>
    </div>
  )
}

export default LoadingProcess