import React from 'react'

function EcommerceSettings() {
    
  const enableDarkMode = () => {
    document.documentElement.classList.add('dark');
  };

  const disableDarkMode = () => {
    document.documentElement.classList.remove('dark');
  };

  return (
    <div className='font-bold text-2xl text-center mt-30'>
      <h1 className='text-gray-600 dark:text-gray-300'>Configuraciones</h1>
      <div className='mt-4 text-gray-500 dark:text-gray-400'>
        <button
          onClick={enableDarkMode}
          className='m-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
        >
          Cambiar a modo oscuro
        </button>
        <button
          onClick={disableDarkMode}
          className='m-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
        >
          Cambiar a modo claro
        </button>
      </div>
    </div>
  )
}

export default EcommerceSettings
