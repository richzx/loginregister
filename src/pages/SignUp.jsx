import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config.js';
import SignInWithGoogle from '../component/signInWithGoogle.jsx';

function SignUp() {
  // hook navigation
  const navigation = useNavigate();

  // hooks form
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // service cloud.firestore {
  //   match /databases/{database}/documents {
  //     match /{document=**} {
  //       allow read, write: if false;
  //     }
  //   }
  // }

  // handle register
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname
        });
        auth.signOut();
      }
      toast.success('Usuario registrado! redirigiendo...');
      setTimeout(function () {
        navigation('/');
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <main className='bg-[url("/img-bg.svg")] w-full h-screen flex justify-center items-center'>
      <section className='w-fit px-8 sm:px-16 py-6 sm:py-8 bg-white rounded-2xl flex flex-col items-center gap-5 sm:gap-10'>
        <h2 className='text-2xl font-medium'>Registrarme</h2>
        <SignInWithGoogle />
        <span>O</span>
        <form method="post" className='w-[200px] min-[400px]:w-[250px] min-[500px]:w-[300px] flex flex-col gap-3'>
          <div className='w-full flex flex-col items-center gap-1'>
            <div className='w-full flex flex-col sm:flex-row gap-2 sm:max-w-[400px] sm:justify-between'>
              <div className='flex flex-col'>
                <label htmlFor="fname" className='text-base text-[#666]'>Nombre</label>
                <input className='w-full py-2 px-4 border border-[#6666664f] rounded-lg focus:ring-2 ring-gray-600 outline-none' type="text" name="fname" id="name" onChange={(e) => setFname(e.target.value)} />
              </div>
              <div className='flex flex-col'>
                <label htmlFor="lname" className='text-base text-[#666]'>Apellido</label>
                <input className='w-full py-2 px-4 border border-[#6666664f] rounded-lg focus:ring-2 ring-gray-600 outline-none' type="text" name="lname" id="lastname" onChange={(e) => setLname(e.target.value)} />
              </div>
            </div>
            <div className='w-full flex flex-col'>
              <label htmlFor="email" className='text-base text-[#666]'>Correo</label>
              <input className='w-full sm:max-w-[400px] py-2 px-4 border border-[#6666664f] rounded-lg focus:ring-2 ring-gray-600 outline-none' type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='w-full flex flex-col'>
              <label htmlFor="password" className='text-base text-[#666]'>Contraseña</label>
              <div className="relative">
                <input
                  className='w-full py-2 px-4 border border-[#6666664f] rounded-lg focus:ring-2 ring-gray-600 outline-none'
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>

                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <button className='bg-gray-600 text-white py-3 px-4 rounded-lg active:ring-4 ring-gray-500 outline-none' onClick={handleRegister}>Registrarme</button>
          <a href='/' className='text-[15px] text-center text-[#666]'>Si ya tienes una cuenta: <span className='underline'>accede</span></a>
        </form>
      </section>
    </main>
  )
}

export default SignUp