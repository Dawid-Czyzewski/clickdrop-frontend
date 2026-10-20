'use client'

import { useEffect, useState } from 'react'
import {
  getSkipCaseAnimationPreference,
  setSkipCaseAnimationPreference,
} from '../lib/caseAnimationPreference'

export function useSkipCaseAnimation() {
  const [skipAnimation, setSkipAnimationState] = useState(false)

  useEffect(() => {
    setSkipAnimationState(getSkipCaseAnimationPreference())
  }, [])

  function setSkipAnimation(skip: boolean) {
    setSkipCaseAnimationPreference(skip)
    setSkipAnimationState(skip)
  }

  return { skipAnimation, setSkipAnimation }
}
