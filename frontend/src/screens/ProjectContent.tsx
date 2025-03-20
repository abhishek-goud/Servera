/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "@/config/axios";
import { ProjectDetails, User } from "@/types/projects";
import { useEffect, useRef, useState } from "react";

// Extend the Window interface to include hljs
declare global {
  interface Window {
    hljs: {
      highlightElement: (element: HTMLElement) => void;
    };
  }
}
import { useNavigate, useLocation } from "react-router";
import { initializeSocket, sendMessage, receiveMessage } from "@/config/socket";
import { useUser } from "@/context/user.context";
import Markdown from "markdown-to-jsx";

// const users = [
//     { id: '1', _id: '1', email: 'user1@example.com' },
//     { id: '2', _id: '2', email: 'user2@example.com' },
//     { id: '3', _id: '3', email: 'user3@example.com' },
//     { id: '4', _id: '4', email: 'user4@example.com' },
//     { id: '5', _id: '5', email: 'user5@example.com' },
//     { id: '6', _id: '6', email: 'user6@example.com' },
//     { id: '7', _id: '7', email: 'user7@example.com' },
//     { id: '8', _id: '8', email: 'user8@example.com' },
//     { id: '9', _id: '9', email: 'user9@example.com' },

//   ];

function ProjectContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string[]>([]);
  console.log(location.state);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [project, setProject] = useState<ProjectDetails>();
  const [message, setMessage] = useState<string>("");
  const { user } = useUser();
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<
    { sender: { userId: string; email: string }; message: string }[]
  >([]); // New state variable for messages

  const handleUserClick = (id: string) => {
    if (selectedUserId.includes(id)) {
      setSelectedUserId(selectedUserId.filter((userId) => userId !== id));
    } else {
      setSelectedUserId([...new Set([...selectedUserId, id])]);
    }
  };

  const addCollaborator = () => {
    axios
      .put("/projects/add-user", {
        projectId: location.state.project._id,
        users: selectedUserId,
      })
      .then((response) => {
        console.log(response.data);
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const send = () => {
    sendMessage("project-message", {
      message,
      sender: { userId: user._id, email: user.email },
    });
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: { userId: user._id, email: user.email }, message },
    ]); // Update messages state
    // appendOutgoingMessage();
    setMessage("");
  };

  useEffect(() => {
    axios
      .get("users/all")
      .then((response) => {
        console.log(response.data);
        setUsers(response.data.users);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get(`projects/get-projects/${location.state.project._id}`)
      .then((response) => {
        console.log(response.data, "projects");
        setProject(response.data.projects);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [location.state.project._id]);

  useEffect(() => {
    if (project) {
      initializeSocket(project._id);
      console.log("Socket initialized");
    }

    receiveMessage("project-message", (data) => {
      console.log(data);
      // appendIncomingMessage(data);
      setMessages(prevMessages => [ ...prevMessages, data ]) // Update messages state
    });
  }, [project]);

  useEffect(() => {
    console.log(messages)
    scrollToBottom();
  }, [messages])

  useEffect(()  => console.log(users), [users])

  //   function appendIncomingMessage(messageObject: any) {

  //     const messageBox = document.querySelector('.message-box')
  //     const message = document.createElement('div')
  //     message.classList.add('message', 'max-w-56', 'flex', 'flex-col', 'p-2', 'bg-slate-50', 'w-fit', 'rounded-md')
  //     message.innerHTML = `
  //             <small class='opacity-65 text-xs'>${messageObject.sender.email}</small>
  //             <p class='text-sm'>${messageObject.message}</p>
  //         `
  //     messageBox?.appendChild(message)
  //     // messageBoxRef?.current?.appendChild(message)

  // }

  function appendIncomingMessage(messageObject: any) {
    if (!messageBoxRef.current) return; // Ensure ref is assigned

    const message = document.createElement("div");

    message.classList.add(
      "message",
      "max-w-56",
      "flex",
      "flex-col",
      "p-2",
      "bg-slate-50",
      "w-fit",
      "rounded-md",
      "break-words"
    );
    if (messageObject.sender.userId === "ai") {
      const markDown = <Markdown>{messageObject.message}</Markdown>;
      message.innerHTML = `
        <small class='opacity-65 text-xs'>${messageObject.sender.email}</small>
        <p class='text-sm break-words'>${markDown}</p> <!-- ✅ Fix applied here -->
      `;
    } else {
      message.innerHTML = `
        <small class='opacity-65 text-xs'>${messageObject.sender.email}</small>
        <p class='text-sm break-words'>${messageObject.message}</p> <!-- ✅ Fix applied here -->
      `;
    }
    //   message.innerHTML = `
    //   <small class='opacity-65 text-xs'>${messageObject.sender.email}</small>
    //   <p class='text-sm break-words'>${messageObject.message}</p> <!-- ✅ Fix applied here -->
    // `;

    messageBoxRef.current.appendChild(message); // Use ref instead of querySelector
    scrollToBottom();
  }

  function appendOutgoingMessage() {
    if (!messageBoxRef.current) return; // Ensure ref is assigned

    const messageDiv = document.createElement("div");

    messageDiv.classList.add(
      "message",
      "max-w-56",
      "flex",
      "flex-col",
      "p-2",
      "ml-auto",
      "bg-slate-50",
      "w-fit",
      "rounded-md",
      "break-words" // ✅ Ensures long words wrap properly
    );
    messageDiv.innerHTML = `
    <small class='opacity-65 text-xs'>${user.email}</small>
    <p class='text-sm break-words whitespace-normal'>${message}</p> 
  `;

    messageBoxRef.current.appendChild(messageDiv); // Use ref instead of querySelector
    scrollToBottom();
  }

  const scrollToBottom = () => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  };

  function SyntaxHighlightedCode(props: { className?: string; children?: React.ReactNode }) {
    const ref = useRef<HTMLPreElement | null>(null);

    useEffect(() => {
      if (ref.current && props.className?.includes("lang-") && window.hljs) {
        window.hljs.highlightElement(ref.current);

        // hljs won't reprocess the element unless this attribute is removed
        ref.current.removeAttribute("data-highlighted");
      }
    }, [props.className, props.children]);

    return <code {...props} ref={ref} />;
  }

  return (
    <main className="h-screen w-screen flex">
      <section className="left relative flex flex-col h-full min-w-96 bg-slate-300">
        <header className="flex justify-between p-2 px-4 w-full bg-slate-100 items-center">
          <button
            className="flex gap-2"
            onClick={() => {
              setIsModalOpen(true);
              console.log("modal opened");
            }}
          >
            <i className="ri-add-fill mr-1"></i>
            <p>Add collaborator</p>
          </button>
          <button
            className="p-2"
            onClick={() => {
              setIsSidePanelOpen(true);
              console.log(isSidePanelOpen);
            }}
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>

        <div className="conversation-area flex grow flex-col  pb-10 overflow-auto">
          <div
            className="message-box flex-grow flex flex-col gap-1 p-1 overflow-auto max-h-full"
            ref={messageBoxRef}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.sender.userId === "ai" ? "max-w-80" : "max-w-54"
                } ${
                  msg.sender.userId == user._id.toString() && "ml-auto"
                }  message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}
              >
                <small className="opacity-65 text-xs">{msg.sender.email}</small>
                <div className="text-sm">
                  {msg.sender.userId === "ai" ? (
                    <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
                      <Markdown
                        children={msg.message}
                        options={{
                          overrides: {
                            code: SyntaxHighlightedCode,
                          },
                        }}
                      />
                    </div>
                  ) : (
                    msg.message
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="inputField w-full flex absolute bottom-0 pt-10">
            <input
              className="p-2 px-4 border-none outline-none bg-white grow"
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMessage(e.target.value)
              }
            />
            <button className="px-5 bg-slate-950 text-white" onClick={send}>
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        <div
          className={`sidePanel absolute bg-slate-50 flex flex-col gap-2 w-full h-full transition-all ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } top-0`}
        >
          <header className="flex justify-between items-center px-4 p-2 bg-slate-200">
            <h1 className="font-semibold text-lg">Collaborators</h1>
            <button className="p-2" onClick={() => setIsSidePanelOpen(false)}>
              <i className="ri-close-fill"></i>
            </button>
          </header>

          <div className="users flex flex-col gap-2">
            {project?.users.map((user, idx) => (
              <div
                key={idx}
                className="user flex items-center gap-1 cursor-pointer hover:bg-slate-200 p-2"
              >
                <div className="aspect-square rounded-full flex items-center justify-center w-fit h-fit p-5 text-white bg-slate-600">
                  <i className="ri-user-fill absolute"></i>
                </div>
                <h1 className="font-semibold text-lg">{user.email}</h1>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select User</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2">
                <i className="ri-close-fill"></i>
              </button>
            </header>
            <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
              {users &&
                users.map((user) => (
                  <div
                    key={user._id}
                    className={`user cursor-pointer hover:bg-slate-300 } ${
                      selectedUserId.indexOf(user._id) != -1
                        ? "bg-slate-200"
                        : ""
                    } p-2 flex gap-2 items-center`}
                    onClick={() => handleUserClick(user._id)}
                  >
                    <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                      <i className="ri-user-fill absolute"></i>
                    </div>
                    <h1 className="font-semibold text-lg">{user.email}</h1>
                  </div>
                ))}
            </div>
            <button
              onClick={addCollaborator}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Add Collaborators
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default ProjectContent;
