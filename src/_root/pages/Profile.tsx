import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';
import { useGetCurrentUser, useGetUserById } from '@/lib/react-query/queryesAndMutations';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams();
  const { data: currentUser, isLoading } = useGetUserById(id || "")
  const {data:userLogged} = useGetCurrentUser()


  if (isLoading) {
    return (
      <Loader />
    )
  }


  return (
    <div className='profile-container2 '>
      <div className='flex w-full h-1/5 '>
        <img src={currentUser?.imageUrl || '/assets/images/profile.png'} alt='profile' className='mx-5 h-35 w-35 max-h-40 max-w-40 rounded-full  cursor-pointer ' />
        <div className='py-10 flex w-full'>

          <div >
            <p className='body-bold'>
              {currentUser?.name}
            </p>
            <p className='small-regular text-light-3 pt-2'>
              @{currentUser?.username}
            </p>
          </div>

          <div className={`${userLogged?.$id !== id && "hidden"}`}>
            <Button className={`ml-1 sm:ml-10 flex-center  bg-dark-3 rounded-xl`}>
              <img src="/assets/icons/edit.svg" alt="edit profile" width={20} height={20} />
              <p className='m-2 text-xs text-nowrap hidden display sm:block'>Editar Perfil</p>
            </Button>
          </div>


          <div className={`${userLogged?.$id === id && "hidden"}`}>
            <Button type="button" className={`ml-1 sm:ml-10 shad-button_primary hidden `}>
              <p>Seguir</p>
            </Button>
          </div>

        </div>
      </div>
      <div className='flex w-full pt-10 gap-10 justify-center md:justify-start  md:pl-10 '>
        <div className='block text-center'>
          <p className=' text-primary-600'>273</p>
          <p>Publicações</p>
        </div>
        <div className='block text-center'>
          <p className=' text-primary-600'>273</p>
          <p>Seguidores</p>
        </div>
        <div className='block text-center'>
          <p className=' text-primary-600'>273</p>
          <p>Seguindo</p>
        </div>
      </div>
      <div className='flex w-ful pt-10 gap-10 justify-center md:justify-start  md:pl-10'>
        <div className='block text-center'>
          <p>{currentUser?.bio}</p>
        </div>
      </div>
      <div className='mt-10 pt-10 border-solid border-t border-light-3'>
        <GridPostList posts={currentUser?.posts} showUser={false} showStats={false} />
      </div>
    </div>
  )
}

export default Profile