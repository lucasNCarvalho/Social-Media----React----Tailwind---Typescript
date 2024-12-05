import { Link, NavLink, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queryesAndMutations'
import { useUserContext } from '@/context/AuthContext';
import { sidebarLinks } from '@/constants';
import { INavLink } from '@/types';
import profile from '../../../public/assets/images/profile.webp'

export function LeftSideBar() {

    const { pathname } = useLocation();

    const { mutateAsync: singOut } = useSignOutAccount();
    const { user } = useUserContext();

    async function handleLogout () {
        await singOut()
    }

    return (
        <nav className='leftsidebar'>
            <div className='flex flex-col gap-11'>
                <Link to="/" className='flex gap-3 items-center'>
                <h1 className="h3-bold md:h2-bold pt-5 sm:pt-12">LOOMY</h1>
                </Link>
                <Link to={`/profile/${user.id}`} className='flex gap-3 items-center'>
                    <img src={user.imageUrl || profile} alt='profile' className='w-14 h-14 rounded-full' />
                    <div className='flex flex-col'>
                        <p className='body-bold'>
                            {user.name}
                        </p>
                        <p className='small-regular text-light-3'>
                            @{user.userName}
                        </p>
                    </div>
                </Link>
                <ul className='flex flex-col gap-6'>
                    {sidebarLinks.map((link: INavLink) => {
                        const isActive = pathname === link.route
                        return (
                            <li key={link.label}
                                className={`leftsidebar-link ${isActive && 'bg-primary-500'}`}>
                                <NavLink
                                    to={link.route}
                                    className='flex gap-4 items-center p-4'
                                >
                                    <img
                                        src={link.imgURL}
                                        alt="label"
                                        className={`group-hoover: invert-white ${isActive && 'invert-white'}`} />
                                    {link.label}
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <Button variant="ghost" className='shad-button_ghost' onClick={() =>  handleLogout()}>
                <img src='/assets/icons/logout.svg' alt='logout' />
                <p className='small-medium lg:base-medium'>
                    Sair
                </p>
            </Button>
        </nav>
    )
}
