import '../styles/messageList.css'
import React, { useContext, useEffect, useState } from "react";
import axios from "axios"
import { UserContext } from './UserContext';

function PostsList(){
 
const [data, setData] = useState([]);
const user= useContext(UserContext)

useEffect(async ()=>{
  axios({
    headers:{
      "Authorization": "Bearer "+ user.token
    },
    method:'get',
    url: `${process.env.REACT_APP_API_URL}api/messages`,
    withCredentials:false,
    data:{
          }
  }).then((res)=>{
    if(res.data.error){
            console.log('get message réussit')

    }
    else{
      console.log(res.data)
      setData(res.data)
    }
  }).catch((err)=>{
    console.log(err)
  })},[])

return user.isLogged?(
<div><ul className="messageList">

    {data.map((e)=>(
    <li key={e.id} className="messageList_card">
        
        <p className="messagList_date">{e.createdAt}</p>
        
        <p className="messagList_userName">{e.user.userName}</p>
        {e.attachmentUrl ? (e.attachmentUrl.split(".", 3)[2] === "mp4" ? (
       <div><video controls autoPlay muted className="messageList_attachment">
       <source src={e.attachmentUrl} type="video/mp4"></source>
     </video></div>
   ) : (
       <div> <img src={e.attachmentUrl} alt="post" className="messageList_attachment"></img></div>
   )):("")}
         <p className="messageList_userName">{e.message}</p>
         <div className="messageList_comment">   {e.comments ? (<ul>{e.comments.map((a)=>(<li key={e.comment}>
             <div>{e.commentaire} </div>
         </li>))} </ul>):(<span>no comment</span>)}
</div>
       
        
    </li>
))}
</ul></div>
    ):('')

}

export default PostsList