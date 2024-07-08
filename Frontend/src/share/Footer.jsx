import React from 'react'

function Footer() {
  return (
    <footer className='flex justify-center bg-gray-200 py-4'>
      <div className="flex flex-col gap-2">
        <h1 className='sm:text-lg font-semibold'>Bench Sharing Portal</h1>
        <div className='flex gap-2'>

        <p>Copyright &copy; 2024</p><p>Bench Portal</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer