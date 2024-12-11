import { useState } from 'react';
import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import { Input } from '@/components/ui/input';
import useDebounce from '@/hooks/useDebounce';
import { useGetMostLikedPostsThisWeek, useSearcPost } from '@/lib/react-query/queryesAndMutations';

function Explore() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data: mostLikedPostsThisWeek, isLoading: isLoadingMostLiked } = useGetMostLikedPostsThisWeek();
  const { data: searchedPosts, isLoading: isLoadingSearch, isFetched: isFetechedPost } = useSearcPost(debouncedSearch);

  const isSearching = debouncedSearch.length > 1;
  const postsToDisplay = isSearching ? searchedPosts : mostLikedPostsThisWeek;
  const isLoading = isSearching ? isLoadingSearch : isLoadingMostLiked;

  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <h2 className='h3-bold md:h2-bold w-full'>Buscar por publicações</h2>
        <div className='flex gap-1 px-4 w-full rounded-lg bg-dark-4'>
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type='text'
            placeholder='Pesquisar'
            className='explore-search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {!isSearching && (
        <div className='flex-between w-full max-w-5xl mt-16 mb-7'>
          <h3 className='body-bold md:h3-bold'>Popular hoje</h3>
        </div>
      )}

      {isFetechedPost && postsToDisplay.length > 0 && (
        <div className='flex-between w-full max-w-5xl mt-16 mb-7'>
          <h3 className='body-bold md:h3-bold'>Publicações encontradas</h3>
        </div>
      )}

      <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
        {isLoading && <Loader />}
        {!isLoading && postsToDisplay && postsToDisplay.length > 0 && (
          <GridPostList posts={postsToDisplay} showUser={false} />
        )}
        {!isLoading && postsToDisplay && postsToDisplay.length === 0 && (
          <p className='pt-20'>Nenhuma publicação encontrada.</p>
        )}
      </div>
    </div>
  );
}

export default Explore;
