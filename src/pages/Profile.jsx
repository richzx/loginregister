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
      await auth.signOut();
      navigation('/');
    } catch (error) {
      toast.error('Error al cerrar sesión: ', error.message)
    }
  }

  return (
    <main className='bg-[url("/img-bg.svg")] w-full h-screen flex justify-center items-center'>
      <section className='w-fit px-8 sm:px-16 py-6 sm:py-12 bg-white rounded-2xl flex flex-col items-center gap-5 sm:gap-10'>
        <h2 className='text-3xl font-bold'>Tu perfil</h2>
        {userDatil ? (
          <div className='flex flex-col items-center gap-3'>
            {userDatil.photo ? (
              <img src={userDatil.photo} alt="imagen de perfil" className='w-[110px] object-cover rounded-full' />
            ) : null}
            <div className='flex flex-col gap-1'>

              <h2 className='text-2xl font-bold'>{userDatil.firstName}</h2>
              <h2 className='flex gap-2 text-xl'>
                Correo:
                <span>{userDatil.email}</span>
              </h2>
              <h2 className='flex gap-2 text-xl'>
                Nombre:
                <span>{userDatil.firstName}</span>
              </h2>
              {userDatil.lastName ? (
                <h2 className='flex gap-2 text-xl'>
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
      </section>
    </main>
  )
}

export default Profile