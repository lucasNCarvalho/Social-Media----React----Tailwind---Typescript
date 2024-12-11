
import profile from '../../../public/assets/images/profile.webp'
import { Link } from "react-router-dom";

interface UserBadgeProps {
    id: string;
    imageUrl: string;
    name: string
}


export function UserBadge({id, imageUrl, name}: UserBadgeProps) {

    return (
        <Link className="w-full flex  gap-3 items-center justify-start border-2 border-dark-4 py-1 rounded-3xl" to={`/profile/${id}`}>
            <img src={imageUrl || profile} alt="" className="w-10 h-10 rounded-full object-cover" />
            <h1 className="font-bold">{name}</h1>
        </Link>
    )
}