
import './globals.css';
import { Routes, Route } from 'react-router-dom';
import SigninForm from './_auth/forms/SigninForm';
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from './_root/pages/Index';
import SignupForm from './_auth/forms/SignupForm';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Toaster } from "@/components/ui/toaster"



const App = () => {
    return (
        <main className='flex h-screen'>
            <Routes>
                {/* Rota publica*/}
                <Route element={<AuthLayout />}>
                    <Route path="/sign-in" element={<SigninForm />} />
                    <Route path="/sign-up" element={<SignupForm />} />
                </Route>
                {/* Rota privada*/}
                <Route element={<RootLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/explore" element={<Explore/>} />
                    <Route path="/Saved" element={<Saved/>} />
                    <Route path="/all-users" element={<AllUsers/>} />
                    <Route path="/create-post" element={<CreatePost/>} />
                    <Route path="/update-post/:id" element={<EditPost/>} />
                    <Route path="/posts/:id" element={<PostDetails/>} />
                    <Route path="/Profile/:id/*" element={<Profile/>} />
                    <Route path="/update-profile" element={<UpdateProfile/>} />
                </Route>
            </Routes>
            <Toaster />
        </main>
    )
}

export default App