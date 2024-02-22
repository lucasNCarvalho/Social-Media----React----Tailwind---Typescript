import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import SearchResults from '@/components/shared/SearchResults';
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce';
import { useGetPosts, useSearchPosts } from '@/lib/react-query/queryesAndMutations';
import React, { useState } from 'react'

function Explore() {

  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();

  const [searchValue, setSearchValue] = useState('');
  const debounceValue = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFeching } = useSearchPosts(debounceValue);

  if (!posts) {
    return (
      <div className='flex-center w-full h-full'>
        <Loader />
      </div>
    )
  }

  const shouldShowSearchResults = searchValue !== '';
  const shouldShowPosts = !shouldShowSearchResults && posts.pages.every((item) => item.documents.lenght === 0)

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
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className='flex-between w-full max-w-5xl mt-16 mb-7'>
        <h3 className='body-bold md:h3-bold'>Popular hoje</h3>
        <div className='flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer'>
          <p className='small-medium md:base-medium text-light-2'>Todos</p>
          <img
            src="/assets/icons/filter.svg"
            height={20}
            width={20}
            alt="filter" />
        </div>
      </div>
      <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFeching}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          <p className='text-light-4 mt-10 text-center w-full'>Parece que não há mais publicações</p>
        ) : posts.pages.map((item, index) => (
          <GridPostList key={`post-${index}`} posts={item.documents} />
        ))}
      </div>
    </div>
  )
}

export default Explore