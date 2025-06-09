import { SignIn } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div className='background'>
      <SignIn redirectUrl={"/Dashboard/backlog"}/>
    </div>
  )
}

export default page
