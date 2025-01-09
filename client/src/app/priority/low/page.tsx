import React from 'react'
import ReusablePriorityPage from '../reusablePriorityPage'
import { Priority } from '@/state/api'

type Props = {}

function Low({}: Props) {
  return (
     <ReusablePriorityPage 
        priority={Priority.Low}/>
  )
}

export default Low