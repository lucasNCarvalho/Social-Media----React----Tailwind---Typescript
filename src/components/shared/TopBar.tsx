import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queryesAndMutations'
import { useUserContext } from '@/context/AuthContext';

function TopBar() {

    const { mutate: singOut, isSuccess } = useSignOutAccount();
    const navigate = useNavigate();
    const { user } = useUserContext();


    useEffect(() => {
        if (isSuccess) navigate(0);
    }, [isSuccess])

    return (
        <section className='topbar'>
            <div className='flex-between py-4 px-5'>
                <Link to="/" className='flex gap-3 items-center'>
                    <h1 className="h3-bold md:h2-bold pt-5 sm:pt-12">LOOMY</h1>
                </Link>
                <div className='flex gap-4'>
                    <Button variant="ghost" className='shad-button_ghost' onClick={() => singOut()}>
                        <img src='/assets/icons/logout.svg' alt='logout' />
                    </Button>
                    <Link to={`/profile/${user.id}`} className='flex-center gap-3'>
                        <img src={user.imageUrl || '/assets/images/profile.png'} alt='profile' className='h-8 w-8 rounded-full' />

                    </Link>
                </div>
            </div>
        </section>
    )
}

export default TopBar