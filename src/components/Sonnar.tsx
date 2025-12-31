import { Toaster, toast } from 'sonner';
import React from 'react'

const Sonnar = () => {
  return (
    <div>
      <Toaster/>
      <button onClick={() => toast('my Custum toast')}>Do The Best Things Get Down</button>
    </div>
  )
}

export default Sonnar
