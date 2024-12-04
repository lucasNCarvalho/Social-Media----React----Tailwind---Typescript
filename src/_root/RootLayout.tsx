
import BottomBar from '@/components/shared/BottomBar'
import { LeftSideBar } from '@/components/shared/LeftSideBar'
import TopBar from '@/components/shared/TopBar'
import { useUserContext } from '@/context/AuthContext'

import { Navigate, Outlet } from 'react-router-dom'

const RootLayout = () => {
  const { isAuthenticated, isLoading } = useUserContext()

  if (isLoading) {
    return
  }


  return (
    <>
      {isAuthenticated ? (
        <div className='w-full md:flex'>
          <TopBar />
          <LeftSideBar />
          <section className='flex flex-1 h-full'>
            <Outlet />
          </section>
          <BottomBar />
        </div>
      ) : (
        <Navigate to="/sign-in" />
      )}
    </>

  )
}

export default RootLayout