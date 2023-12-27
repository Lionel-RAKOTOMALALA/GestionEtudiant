import React from 'react'

const Page403 = () => {
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="error mx-auto mt-5" data-text="403">403</div>
        <p className="lead text-gray-800 mb-5">Forbidden</p>
        <p className="text-gray-500 mb-0">It looks like you found a glitch in the matrix...</p>
        <a href="index.html">&larr; Back to Dashboard</a>
      </div>
    </div>
  )
}

export default Page403
