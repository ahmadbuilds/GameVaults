import { SignIn } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div className='background'>
      <SignIn/>
    </div>
  )
}

export default page
