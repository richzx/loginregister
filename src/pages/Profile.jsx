import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config.js';

function Profile() {
  // navigation hook
  const navigation = useNavigate();

  // hook details for user
  const [userDatil, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  // constant fetch data for user
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);
      setUserDetail(user);
      const docRef = doc(db, 'Users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap) {
        setUserDetail(docSnap.data());
        console.log(docSnap.data());
      } else {
        toast.error('Usuario no logeado')
      }
    })
  }

  // use effect changed data
  useEffect(() => {
    fetchUserData()
  }, []);

  // function on logout
  async function handleLogout() {
    try {
      setLoading(true);
      setTimeout(function () {
        auth.signOut();
        navigation('/');
      }, 500);
    } catch (error) {
      toast.error('Error al cerrar sesión: ', error.message)
    }
  }

  return (
    <main className='px-5 bg-[url("/img-bg.svg")] w-full h-screen flex justify-center items-center'>
      <section className='px-8 sm:px-16 py-6 sm:py-12 bg-white rounded-2xl flex flex-col items-center gap-5 sm:gap-10'>
        {loading ? (
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900" />
        ) : (
          <>
            <h2 className='text-3xl font-bold'>Tu perfil</h2>
            {userDatil ? (
              <div className='w-full flex flex-col items-center gap-3'>
                {userDatil.photo ? (
                  <img src={userDatil.photo} alt="imagen de perfil" className='w-20 sm:w-[110px] object-cover rounded-full' />
                ) : null}
                <div className='w-full flex flex-col gap-1'>
                  <h2 className='text-xl sm:text-2xl font-bold'>{userDatil.firstName}</h2>
                  <h2 className='flex flex-wrap gap-2 text-base min-[400px]:text-lg sm:text-xl'>
                    Correo:
                    <span>{userDatil.email}</span>
                  </h2>
                  <h2 className='flex gap-2 text-lg sm:text-xl'>
                    Nombre:
                    <span>{userDatil.firstName}</span>
                  </h2>
                  {userDatil.lastName ? (
                    <h2 className='flex gap-2 text-lg sm:text-xl'>
                      Apellido:
                      <span>{userDatil.lastName}</span>
                    </h2>
                  ) : null}
                </div>
                <button onClick={handleLogout} className="w-full bg-gray-500 hover:bg-gray-700 text-white font-normal py-2 px-4 rounded-full">
                  Cerrar sesión
                </button>
              </div>
            ) : 'cargando...'}
          </>
        )}
      </section>
    </main>
  )
}

export default Profile