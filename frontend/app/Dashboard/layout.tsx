import { SignedIn, UserButton } from '@clerk/nextjs'
import React from 'react'

const layout = () => {
  return (
    <div className='background'>
      <SignedIn><UserButton></UserButton></SignedIn>
      Hello From Dahsboard
    </div>
  )
}

export default layout
