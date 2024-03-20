import GridPostList from '@/components/shared/GridPostList';
import { useGetCurrentUser } from '@/lib/react-query/queryesAndMutations';
import React from 'react'

const Profile = () => {

  const {data: currentUser} = useGetCurrentUser()

  return (
    <div className='profile-container2 '>
      <div className='flex w-full h-1/5'>
        <img src={currentUser?.imageUrl || '/assets/images/profile.png'} alt='profile' className='mx-5 h-35 w-35 max-h-40 max-w-40 rounded-full  cursor-pointer' />
        <div className='py-10 flex w-full'>

          <div >
            <p className='body-bold'>
              {currentUser?.name}
            </p>
            <p className='small-regular text-light-3 pt-2'>
              @{currentUser?.username}
            </p>
          </div>

          <div>
            <div className='flex-center  bg-dark-3 rounded-xl px-2 py-1  cursor-pointer  sm:ml-10 md:ml-20 '>
              <img src="/assets/icons/edit.svg" alt="edit profile" width={20} height={20}/>
              <p className='m-2 text-xs text-nowrap hidden display sm:block'>Editar Perfil</p>
            </div>
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
        <GridPostList posts={currentUser?.posts} showUser={false} showStats={false}/>
      </div>
    </div>
  )
}

export default Profile