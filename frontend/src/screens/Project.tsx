/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";


function Project() {
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location.state)
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  return (
    <main className="h-screen w-screen flex">
        <section className="left relative flex flex-col h-full min-w-96 bg-slate-300">
            <header className="flex justify-end p-2 px-4 w-full bg-slate-100">
                <button className="p-2" onClick={() => {
                    setIsSidePanelOpen(true)
                    console.log(isSidePanelOpen)
                }}><i className="ri-group-fill"></i></button>
            </header>

            <div className="conversation-area flex grow flex-col">
                <div className="message-box flex grow flex-col gap-1 p-1">
                    <div className="incoming message flex flex-col gap-1 p-2 bg-slate-50 w-full rounded-md max-w-56">
                        <small className="opacity-65 text-xs truncate">example@gmail.com</small>
                        <p className="text-sm break-words">hello</p>
                    </div>

                    <div className="incoming message ml-auto flex flex-col gap-1 p-2 bg-slate-50 w-full rounded-md max-w-56">
                        <small className="opacity-65 text-xs truncate">example@gmail.com</small>
                        <p className="text-sm break-words">hello</p>
                    </div>
                   
                </div>
                <div className="inputField w-full flex">
                    <input className="p-2 px-4 border-none outline-none bg-white grow"
                        type="text"
                        placeholder="Type a message"/>
                    <button className='px-5 bg-slate-950 text-white'><i className="ri-send-plane-fill"></i></button>
                </div>
            </div>

            <div className={`sidePanel absolute bg-slate-50 flex flex-col gap-2 w-full h-full transition-all ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>
                <header className="flex justify-end px-4 p-2 bg-slate-200">
                    <button className="p-2" onClick={() => setIsSidePanelOpen(false)}>
                        <i className="ri-close-fill"></i>
                    </button>
                </header>

                <div className="users flex flex-col gap-2">

                    <div className="user flex items-center gap-1 cursor-pointer hover:bg-slate-200 p-2">
                        <div className="aspect-square rounded-full flex items-center justify-center w-fit h-fit p-5 text-white bg-slate-600">
                            <i className="ri-user-fill absolute"></i>
                        </div>
                        <h1 className="font-semibold text-lg">username</h1>
                    </div>

                    
                </div>
            </div>
        </section>

    </main>
  )
}

export default Project;
