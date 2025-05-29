import React from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import { useNavigate } from 'react-router-dom'
import { useContext,useEffect } from 'react'
import axios from 'axios'


const CaptainProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { captain, setCaptain } = React.useContext(CaptainDataContext);
  const [isLoading,setIsLoading] = React.useState(true);

  useEffect(() => {

    if (!token) {
      navigate("/captain-login");
    }

    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },  
    }).then((response) => {
      if (response.status === 200) {
        const data = response.data;
        setCaptain(data.captain);
        setIsLoading(false);
      }
    }).catch(err => {
      console.log(err);
      localStorage.removeItem("token");
      navigate("/captain-login");
      
    })
    
  }, [token])

  
  
  if(isLoading){
    return <div>Loading...</div>
  }

  return (
    <>
      {children}
    </>
  )
}

export default CaptainProtectedWrapper
