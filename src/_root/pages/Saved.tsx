import GridPostList from '@/components/shared/GridPostList';
import { useUserContext } from '@/context/AuthContext';
import { useGetPosts, useGetSavedPosts, useSavePost } from '@/lib/react-query/queryesAndMutations';
import React from 'react'

function Saved() {
  const { user } = useUserContext();

  const { data: savedPosts, isFetching: isSearchFeching } = useGetSavedPosts(user?.id);

  return (
    <div>
      <div className='saved-container'>
        <div className='flex'>
          <img className='mr-3' src="/assets/icons/bookmark.svg" alt="" />
          <div className='h3-bold md:h2-bold w-full'>
            Publicações salvas
          </div>
        </div>
        <div>
          {savedPosts && <GridPostList posts={savedPosts} />}
        </div>
      </div>
    </div>
  )
}

export default Saved