import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'


const GoToTop = () => {

  const routePath = useLocation()

  const goToTheTop = () => {
    //window.moveTo(0, 0) // doesn't work
    window.scrollTo({
      top:  0,
      left: 0,
      behavior: 'auto',
    })
  }

  useEffect(() => {
    goToTheTop()
  }, [routePath])

  return null
}


export default GoToTop