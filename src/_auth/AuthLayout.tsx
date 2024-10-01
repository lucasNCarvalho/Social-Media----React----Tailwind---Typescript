import ImageSlider from "@/components/shared/ImageSlider";
import { useUserContext } from "@/context/AuthContext";
import { Outlet, Navigate } from "react-router-dom"



const AuthLayout = () => {

  const {isAuthenticated, isLoading} = useUserContext()

  const images = [
    "/assets/images/slide1.jpg",
    "/assets/images/slide2.png",
    "/assets/images/slide3.jpg"
  ]

  if(isLoading) {
    return
}

  return (
    <>
    {isAuthenticated ? (
      <Navigate to="/" />
    ): (
      <>
        <section className="flex flex-1 justify-center items-center flex-col py-10"> 
          <Outlet/>
        </section>

        {/* <img 
        src="/assets/images/side-img.svg"
        alt="logo"
        className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
        /> */}
        <ImageSlider images={images}/>
      </>
    )}
    </>
  )
}

export default AuthLayout