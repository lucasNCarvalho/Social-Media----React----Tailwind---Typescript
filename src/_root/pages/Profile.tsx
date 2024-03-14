import { useUserContext } from '@/context/AuthContext';
import React from 'react'

const Profile = () => {

  const { user } = useUserContext();

  return (
    <div className='profile-container2 '>
      <div className='flex w-full'>
        <img src={user.imageUrl || '/assets/images/profile.png'} alt='profile' className='mx-5 h-35 w-35 max-h-40 max-w-40 rounded-full' />
        <div className='py-10'>
          <p className='body-bold'>
            {user.name}
          </p>
          <p className='small-regular text-light-3'>
            @{user.username}
          </p>
        </div>
        <div className='flex  h-fit rounded-md text-nowrap p-1 '>
          <img src="/assets/icons/edit.svg" alt="edit profile" width={20} height={20}/>
          <p>Editar</p>
        </div>
      </div>
    </div>
  )
}

export default Profile