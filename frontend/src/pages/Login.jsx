import React from 'react'

const Login = () => {
  return (
    <div className="flex justify-center items-center mt-10">
      <div className="shadow-xl p-8 rounded-xl w-96">
        <h2 className="text-primary font-medium text-xl">Login</h2>
        <p className='text-sm mb-3 mt-1'>Please login to book appointment</p>
        <div className="mb-2 flex flex-col">
          <label htmlFor="">Email</label>
          <input type="email" className="p-2 border rounded-lg mb-2" />
        </div>
        <div className="mb-2 flex flex-col">
          <label htmlFor="">Password</label>
          <input type="password" className="p-2 border rounded-lg mb-2" />
        </div>
        <div>
          <button className="w-full py-2 mb-3 bg-custom-bg rounded-lg text-white">
            Login
          </button>
        </div>
        <h2 className='text-sm py-3'>
          Already have an account? <span className='text-blue-500 underline'>Login here</span>
        </h2>
      </div>
    </div>
  );
}

export default Login