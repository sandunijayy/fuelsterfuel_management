import {create} from "zustand";
import axios from "axios";

const API_URL="http://localhost:5000/api";

export const userAuth=create((set)=>({

    //initial states
    user:null,
    isLoading:false,
    error:null,
    message:null,
    fetchingUser:true,

    //functions
    signup:async(username,email,password)=>{
        set({isLoading:true,message:null})

        try {
            const response=await axios.post(`${API_URL}/signup`,{
                username,email,password

            }, { withCredentials: true });

            if (!response.data || !response.data.user) {
                throw new Error("Invalid response from server");
            }

            set({
                user:response.data.user, 
                isLoading:false,
                message:response.data.message
            });

        } catch (error) {
            set({isLoading:false,error:error.response.data.message || "Error signing up",

            });
            throw error;
        }
    },

    
    login:async(email,password)=>{
        set({isLoading:true,message:null,error:null});

        try {
            const response=await axios.post(`${API_URL}/login`,{
                email,
                password,
            },{ withCredentials: true })

            const{user,message}=response.data;

            set({user,isLoading:false,message})
            return{user,message}

        } catch (error) {
            
            set({
                isLoading:false,
                error:error.response.data.message || "error logging in",
            })
        }
    },

    

    fetchUser:async()=>{
        set({fetchingUser:true,error:null})

        try {
            
            const response=await axios.get(`${API_URL}/fetch-user`, { withCredentials: true });
            set({user:response.data.user, fetchingUser:false})
        } catch (error) {
            
            set({
                fetchingUser:false,
                error:null,
                user:null,
            });

            throw error;
            
        }

    },



    logout:async()=>{

        set({isLoading:true,error:null,message:null});

        try {
            const response=await axios.post(`${API_URL}/logout`,{ withCredentials: true });
            const{message}=response.data;

            set({message,isLoading:false,user:null,error:null})
            return {message};
        } catch (error) {
            
            set({
                isLoading:false,
                error:error.response.data.message || "error logging out",
            });

            throw error;
        }

    }


}))