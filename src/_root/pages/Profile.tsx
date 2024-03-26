import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';
import { deletefollowUser, followUser } from '@/lib/appwrite/api';
import { useDeleteFollowUser, useFollowUser, useGetCurrentUser, useGetUserById } from '@/lib/react-query/queryesAndMutations';
import { checkIsFollowing } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams();
  const { data: currentUser, isLoading, refetch } = useGetUserById(id || "")
  const { data: userLogged, isLoading: loading} = useGetCurrentUser()
  const { mutate: followUser } = useFollowUser();
  const { mutate: deleteFollowUser } = useDeleteFollowUser();
  const [follow, setFollow] = useState(checkIsFollowing(userLogged?.following || [], id || ""))
 

  useEffect(() => {
    setFollow(checkIsFollowing(userLogged?.following || [], id || ""));
  }, [userLogged]);
  
  const followHandler = () => {
    followUser({ user: userLogged || "", userFollow: id || "" });
    setFollow(true)
  }

  const deleteFollowHandler = () => {
    deleteFollowUser({user: userLogged || "", userFollow: id || ""})
    setFollow(false)
  }

  refetch()

  return (
    <>
    {isLoading && loading ? <Loader/> : 
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
            {follow ?
              <Button onClick={deleteFollowHandler} type="button" className={`ml-1 sm:ml-10 bg-dark-2 border-2 `}>
                <p>Seguindo</p>
              </Button>
              :
              <Button onClick={followHandler} type="button" className={`ml-1 sm:ml-10 shad-button_primary hidden `}>
                <p>Seguir</p>
              </Button>
            }
          </div>

        </div>
      </div>
      <div className='flex w-full pt-10 gap-10 justify-center md:justify-start  md:pl-10 '>
        <div className='block text-center'>
          <p className=' text-primary-600'>{currentUser?.posts.length}</p>
          <p>Publicações</p>
        </div>
        <div className='block text-center'>
          <p className=' text-primary-600'>{currentUser?.followers.length}</p>
          <p>Seguidores</p>
        </div>
        <div className='block text-center'>
          <p className=' text-primary-600'>{currentUser?.following.length}</p>
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
    }
    </>
  )
}

export default Profile