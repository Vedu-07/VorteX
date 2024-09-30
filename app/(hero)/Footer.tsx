import React from 'react'

const Footer = () => {
  return (
<footer className='bg-white dark:bg-black-100 w-full'>
  <div className='flex flex-wrap justify-evenly w-full p-5'>
    <div className='font-bold text-black dark:text-gray-300'>VorteX</div>
    <p className="lg:block text-black dark:text-gray-300">
      © {new Date().getFullYear()}. All rights reserved.
    </p>
  </div>
</footer>

  )
}

export default Footer;
