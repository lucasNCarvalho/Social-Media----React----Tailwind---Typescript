
import GridPostList from '@/components/shared/GridPostList';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { useCheckIsUserLoggedFollowingUserId, usefollowUser, useGetPostByUserId, useGetUserById, useUnfollowUser } from '@/lib/react-query/queryesAndMutations';
import profile from './../../../public//assets/images/profile.webp'
import { Link, useParams } from 'react-router-dom';
import Loader from '@/components/shared/Loader';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import ListFollowers from '@/components/shared/ListFollowers';
import ListFollowing from '@/components/shared/ListFollowing';

const Profile = () => {
  const { id } = useParams();


  const { data: userProfile, isLoading: isUserProfileLoading } = useGetUserById(id || "");
  const { data: userPosts = [], isLoading: isUserPostsLoading } = useGetPostByUserId(id || "");
  const { data: follow } = useCheckIsUserLoggedFollowingUserId(id || "")
  const { mutateAsync: followUser } = usefollowUser()
  const { mutateAsync: unfollowUser } = useUnfollowUser()
  const { user } = useUserContext();

  if (!id) {
    return <h1 className="bg-white">Usuário não encontrado</h1>;
  }

  if (isUserProfileLoading || isUserPostsLoading) {
    return <Loader />;
  }

  async function handleFollowUser() {
    if (!id) return
    await followUser({ userId: id, action: 'follow' })
  }

  async function handleUnfollowUser() {
    if (!id) return
    await unfollowUser({ userId: id, action: 'unfollow' })
  }

  return (
    <>
      <div className="profile-container2">
        <div className="flex w-full items-center gap-3 h-1/5">
          <img src={userProfile?.imageUrl || profile} alt="profile" className='rounded-full w-20 h-20' />
          <div className="py-10 flex w-full">
            <div>
              <p className="body-bold">{userProfile?.name}</p>
              <p className="small-regular text-light-3 pt-2">@{userProfile?.userName}</p>
            </div>

            {user.id === userProfile?.id ? (
              <div className={`"hidden"}`}>
                <Link className={`ml-1 sm:ml-10 flex-center bg-dark-3 rounded-xl`} to={`/update-profile`}>
                  <img src="/assets/icons/edit.svg" alt="edit profile" width={20} height={20} />
                  <p className="m-2 text-xs text-nowrap hidden display sm:block">Editar Perfil</p>
                </Link>
              </div>
            ) : (
              <div >
                {follow?.isFollowing ?
                  <Button type="button" className={`ml-1 sm:ml-10 bg-dark-2 border-2 `} onClick={handleUnfollowUser}>
                    <p>Seguindo</p>
                  </Button>
                  :
                  <Button type="button" className={`ml-1 sm:ml-10 shad-button_primary hidden `} onClick={handleFollowUser}>
                    <p>Seguir</p>
                  </Button>
                }
              </div>

            )}
          </div>
        </div>
        <div className="flex w-full pt-10 gap-10 justify-center md:justify-start md:pl-10">
          <div className="block text-center">
            <p className="text-primary-600">{userProfile.postsCount}</p>
            <p>Publicações</p>
          </div>
          <div className="block text-center">
            <p className="text-primary-600">{userProfile.followersCount}</p>
            <Dialog>
              <DialogTrigger>
                <p className='cursor-pointer'>Seguidores</p>
              </DialogTrigger>
              <ListFollowers userId={id} />
            </Dialog>
          </div>
          <div className="block text-center">
            <p className="text-primary-600">{userProfile.followingCount}</p>
            <Dialog>
              <DialogTrigger>
                <p className='cursor-pointer'>Seguidores</p>
              </DialogTrigger>
              <ListFollowing userId={id} />
            </Dialog>
          </div>
        </div>
        <div className="flex w-ful pt-10 gap-10 justify-center md:justify-start md:pl-10">
          <div className="block text-center">
            <p>{userProfile?.bio}</p>
          </div>
        </div>

        <div className="mt-10 pt-10 border-solid border-t border-light-3">
          {userPosts ? (
            <GridPostList showUser={false} posts={userPosts} />
          ) : (
            <p>Não há publicações</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;



