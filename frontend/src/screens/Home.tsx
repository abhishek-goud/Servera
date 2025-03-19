/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { FolderPlus, Users, ChevronRight, Code, Database, GitBranch, Layout, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "@/config/axios";
import { Project } from "@/types/projects";
import { useNavigate } from "react-router";
import { useUser } from "@/context/user.context";

// Project icons array to randomly assign to projects
const projectIcons = [Code, Database, GitBranch, Layout];

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  // const {user} = useUser();

  // Fetch projects once when component mounts
  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/projects/all")
      .then((res) => {
        setProjects(res.data.projects);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log({projects})
  },[projects])

  // Create a new project and update state immediately
  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await axios.post("/projects/create", { name: projectName });
      if (res.data.project) {
        setProjects((prev) => [...prev, res.data.project]); // ✅ Add project immediately
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
      setProjectName("");
      setIsModalOpen(false);
    }
  };

  // Function to get a random icon for each project
  const getProjectIcon = (projectId: string) => {
    const iconIndex = projectId.charCodeAt(0) % projectIcons.length;
    const IconComponent = projectIcons[iconIndex];
    return <IconComponent className="h-8 w-8 text-blue-500" />;
  };

  return (
    <main className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Database className="mr-2 h-6 w-6 text-blue-500 animate-pulse" />
        Projects
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <p className="text-gray-400">Loading projects...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            className="p-6 border rounded-lg border-gray-700 bg-gray-800 hover:border-blue-500 cursor-pointer transition-all transform hover:scale-105 flex items-center justify-center flex-col h-48 relative overflow-hidden group"
            onClick={() => setIsModalOpen(true)}
          >
            <FolderPlus className="h-12 w-12 text-blue-500 mb-4 transition-transform group-hover:rotate-12" />
            <span className="text-lg font-medium text-white">New Project</span>
          </div>
          
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => {
                navigate(`/project`, {
                  state: { project },
                });
              }}
              className="p-6 border rounded-lg border-gray-700 bg-gray-800 hover:border-blue-500 cursor-pointer transition-all transform hover:scale-105 flex flex-col justify-between h-48 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="flex items-start">
                <div className="mr-3 p-2 bg-gray-700 rounded-lg transition-all group-hover:bg-gray-600">
                  {getProjectIcon(project._id)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">{project.name}</h2>
                  <div className="flex items-center text-gray-400 mt-2">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{project.users.length} Collaborators</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-blue-500 mt-4 self-end group-hover:transform group-hover:translate-x-[-4px] transition-transform">
                <span className="mr-1">View Project</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <FolderPlus className="mr-2 h-5 w-5 text-blue-500" />
              Create New Project
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={createProject}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="projectName"
                  className="text-right text-gray-300"
                >
                  Project Name
                </Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="col-span-3 bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-gray-700 bg-gray-800 text-blue-500 hover:bg-gray-700 hover:text-white"
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default Home;
