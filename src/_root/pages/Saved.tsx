
import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import { useGetPostSavedByUserId } from '@/lib/react-query/queryesAndMutations';



function Saved() {
  
  const {data: savedPosts, isPending: isLoading} = useGetPostSavedByUserId()

  console.log('a', savedPosts)

  return (
    <div className='saved-container'>
      <div className='flex'>
        <img className='mr-3' src="/assets/icons/bookmark.svg" alt="edit" />
        <div className='h3-bold md:h2-bold w-full'>
          Publicações salvas
        </div>
      </div>
      <div>
        {isLoading ? <Loader /> : savedPosts && <GridPostList showUser={false} posts={savedPosts} />}
      </div>
    </div>
  )
}

export default Saved