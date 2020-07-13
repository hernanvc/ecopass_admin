import {  API_URL } from '../env'
import axios from 'axios'
import { getToken } from './helper';

class RequestHttp
{

    requestPost( url, params){
        const headers = {'Content-Type': 'application/json; charset=UTF-8', 'Access-Control-Allow-Origin':'*', "Access-Control-Allow-Headers": "*" };
        const http =  axios.create({ baseURL:API_URL,  headers: headers  });
        return http.post( `${url}`, params ).then( function(response){
            return response
          }).catch( error => { console.log(error); return false });        
    } 

    requestPostToken( url, params){
        const headers = {'Content-Type': 'application/json; charset=UTF-8', "Authorization": getToken()  };
        const http =  axios.create({ baseURL:API_URL,  headers: headers });
        return http.post( `${url}`, params ).then( function(response){
            return response
          }).catch( error => { console.log(error); return false });        
    } 

    update(url, params){
        const headers = {'Content-Type': 'application/json; charset=UTF-8', "Authorization": getToken()  };
        const http =  axios.create({ baseURL:API_URL,  headers: headers });
        return http.put( `${url}`, params ).then( function(response){
            console.log(response)
            return response
          }).catch( error => { console.log(error); return false });      
    }
    updateWithoutToken(url, params){
        const headers = {'Content-Type': 'application/json; charset=UTF-8' };
        const http =  axios.create({ baseURL:API_URL,  headers: headers });
        return http.put( `${url}`, params ).then( function(response){
            console.log(response)
            return response
          }).catch( error => { console.log(error); return false });      
    }

    deleteItem(url){
        const headers = {'Content-Type': 'application/json; charset=UTF-8', "Authorization": getToken() };
        const http =  axios.create({ baseURL:API_URL,  headers: headers });
        return http.delete( `${url}` ).then( function(response){
            console.log(response)
            return response
        }).catch( error => { console.log(error); return false });   
    }

    requestGet(url, params){
        const headers = {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*',  "Authorization":getToken() };
        const http =  axios.create({ baseURL: API_URL,  headers: headers });
        return http.get( `${url}`, params).catch( error => { console.log(error); return false });
    }

    getWithToken(url){
        const headers = {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*',  "Authorization":getToken() };
        const http =  axios.create({ baseURL: API_URL,  headers: headers });
        return http.get( `${url}`).catch( error => { console.log(error); return false });
    }

}

export const requestHttp = new RequestHttp();