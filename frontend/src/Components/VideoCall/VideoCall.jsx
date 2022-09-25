import React, { useRef } from 'react';
import { useState } from 'react';
import './VideoCall.css';
import { ChatState } from '../../Context/ChatProvider';

const VideoCall = () => {
    let Peer,peerId;
    const [display, setDisplay] = useState("none");
    const [myStream, setmyStream] = useState(null);
    const [userStream, setuserStream] = useState(null);
    const myVideo = useRef(null);
    const userVideo = useRef(null);

    const { selectedChat, user, onlineUsers, setOnlineUsers } = ChatState();



    const callHandelar = () => {
        setDisplay("block");
        userVideo.current.srcObject= userStream;
        myVideo.current.srcObject= myStream;
        // userVideo.current.addev
        userVideo.current.play();
        const userId = getSenderFull(user,selectedChat.users).id;
        socket.emit('send video call', userId, peerId)
    }


    
    useEffect(() => {
        Peer = new Peer();

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          }).then(stream => {

            setmyStream(stream)
            
          })


          Peer.on('open', id => {
            peerId=id;
          })
          
      }, []);
    
    return (
        <>
            <i className="bi bi-camera-video me-4"
                onClick={callHandelar}
            />

            <div className='video w-100 h-100 position-absolute top-0 end-0'
                 style={{
                    display:display
                }}
            >
                <div className="headerVideo w-100 text-end">
                    <i className="bi bi-camera-video me-4"
                        onClick={()=>{setDisplay("none")}}
                    />
                </div>
                <div className="senderVideo">
                <video ref={userVideo}>
                        {/* <source src="https://www.w3schools.com/tags/movie.mp4" type="video/mp4"/> */}
                        Your browser does not support the video tag.
                    </video>
                    <video ref={myVideo}>
                        {/* <source src="https://www.w3schools.com/tags/movie.mp4" type="video/mp4"/> */}
                        Your browser does not support the video tag.
                    </video>
                </div>
               
            </div>
        </>
    );
};

export default VideoCall;