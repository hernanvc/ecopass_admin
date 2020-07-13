
export const getToken=()=>{
    return localStorage.getItem('token')
  }
  
  export const getUserRole = () => {
    return JSON.parse(localStorage.getItem('user')).role
  }
  
  export const getUser = () => {
    return JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).id : null
  }
  
  export const getUserAll = () => {
    return JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).id : null
  }