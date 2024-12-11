import { useState } from 'react'
import { UserCard } from '@/components/shared/UserCard'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce'
import { useSearchUser } from '@/lib/react-query/queryesAndMutations'
import Loader from '@/components/shared/Loader';

function AllUsers() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const { data: users, isLoading } = useSearchUser(debouncedSearch)



  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <h2 className='h3-bold md:h2-bold w-full'>Buscar por pessoas</h2>
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

      <div className='pt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4   gap-10'>
        {isLoading && <Loader />}

        {users && users.length > 0 && users.map((u: any) => (
          <UserCard
            key={u.id}
            id={u.id}
            imageUrl={u.imageUrl}
            name={u.name}
            userName={u.userName}
            isFollowing={u.isFollowing}
          />
        ))}


      </div>
    </div>
  )
}

export default AllUsers
