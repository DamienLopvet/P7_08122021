import { useEffect, useState } from "react"
import '../styles/messageList.css'



function PostsList(){
    const [data, setData] = useState([]);
    useEffect(()=>{
        const postUrl ="http://localhost:3030/api/messages";
        const fetchPostData = async () => {
            try {   
                const reponse= await fetch(postUrl);
                const json = await reponse.json();
                setData(json);

            } catch (error){
                console.log("error", error)
            }
        }
    

    fetchPostData();

},[]);



return (
<div><ul className="messageList">

    {data.map((e)=>(
    <li className="messageList_card">
        
        <p className="messagList_date">{e.createdAt}</p>
        
        <p className="messagList_userName">{e.user.userName}</p>
        {e.attachmentUrl ? (e.attachmentUrl.split(".", 3)[2] === "mp4" ? (
       <div><video controls autoPlay muted className="messageList_attachment">
       <source src={e.attachmentUrl} type="video/mp4"></source>
     </video></div>
   ) : (
       <div> <img src={e.attachmentUrl} alt="heye" className="messageList_attachment"></img></div>
   )):("")}
         <p className="messageList_userName">{e.message}</p>
         <p className="messageList_comment">   {e.comments ? (<span>{e.comments.map((a)=>(<ul>
             <div>{a.commentaire} </div>
         </ul>))} </span>):(<span>no comment</span>)}
</p>
       
        
    </li>
))}
</ul></div>
    )

}

export default PostsList