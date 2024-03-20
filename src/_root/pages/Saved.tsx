import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import { useGetCurrentUser } from '@/lib/react-query/queryesAndMutations';
import { Models } from 'appwrite';



function Saved() {
 const {data: currentUser, isLoading} = useGetCurrentUser()

 
 const savedPosts = currentUser?.save
 .map((savePost: Models.Document) => ({
   ...savePost.post,
   creator: {
     imageUrl: currentUser.imageUrl,
   },
 }))
 .reverse();

 console.log("c", currentUser)

  return (
    <div className='saved-container'>
      <div className='flex'>
        <img className='mr-3' src="/assets/icons/bookmark.svg" alt="edit" />
        <div className='h3-bold md:h2-bold w-full'>
          Publicações salvas
        </div>
      </div>
      <div>
        {isLoading ? <Loader/> : savedPosts && <GridPostList posts={savedPosts} />}
      </div>
    </div>
  )
}

export default Saved