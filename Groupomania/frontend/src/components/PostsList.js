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

},[])

return (
<div>
    {data.map((e)=>(
<ul className="messageList">
    <li className="messageList_card">
        <p className="messagList_date">{e.createdAt}</p>
        <p className="messagList_userName">{e.user.userName}</p>
         <p className="messageList_userName">{e.message}</p>
         <p className="messageList_comment">{}</p>

        <img className="messageList_image" src={e.attachmentUrl}/>
    </li>
</ul>))}
</div>
    )

}

export default PostsList