/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "@/config/axios";
import { ProjectDetails, User } from "@/types/projects";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { initializeSocket, sendMessage, receiveMessage } from "@/config/socket";
import { useUser } from "@/context/user.context";

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
      sender: user._id,
    });

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
    });
  }, [project]);

  // useEffect(()  => console.log(users), [users])

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

        <div className="conversation-area flex grow flex-col">
          <div className="message-box flex grow flex-col gap-1 p-1">
            <div className="incoming message flex flex-col gap-1 p-2 bg-slate-50 w-full rounded-md max-w-56">
              <small className="opacity-65 text-xs truncate">
                example@gmail.com
              </small>
              <p className="text-sm break-words">hello</p>
            </div>

            <div className="incoming message ml-auto flex flex-col gap-1 p-2 bg-slate-50 w-full rounded-md max-w-56">
              <small className="opacity-65 text-xs truncate">
                example@gmail.com
              </small>
              <p className="text-sm break-words">hello</p>
            </div>
          </div>
          <div className="inputField w-full flex">
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
