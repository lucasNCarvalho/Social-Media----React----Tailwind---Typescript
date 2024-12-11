
import Loader from './Loader';
import GridPostList from './GridPostList';

type SearchResultsProps = {
  isSearchFetching: boolean;
  searchedItems: []
}

const SearchResults = ({isSearchFetching, searchedItems}: SearchResultsProps) => {

  if(isSearchFetching) return <Loader/>

  if(searchedItems) {
    return (
      <GridPostList posts={searchedItems}/>
    )
  }

  return (
    <p className='text-light-4 mt-10 text-center w-full'>Nenhum resultado encontrado</p>
  )
}

export default SearchResults
