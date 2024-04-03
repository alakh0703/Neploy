/*
   Description:
   This file defines a custom React hook for managing user and project state using Zustand.
   It provides functionality for setting and accessing user information, as well as managing projects.
   The hook includes persistence using sessionStorage to retain user and project data between sessions.

   Custom Hook:
   - useUserStore: A custom Zustand hook for managing user and project state.
     - State:
       - user: Holds the user object or null if not logged in.
       - projects: Holds an array of project objects or null if no projects exist.
     - Actions:
       - setUser: Updates the user object in the store.
       - setProjects: Updates the projects array in the store.
       - logout: Clears the user object from the store, effectively logging the user out.
*/

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


// Project: Defines the structure of a project object, including its properties.
interface Project {
  pId: string,
  title: string,
  description: string,
  url: string,
  git_link: string,
  deployed: boolean,
  date_created: string,
  profileUrl: string

}

// User: Defines the structure of a user object, including its properties.
type User = {
  name: string,
  email: string,
  accessToken: string | null,
  photoUrl: string | null,
  verified: boolean,
  uid: string,
  git_username: string,
  git_url: string,
  linkedin_url: string,
  personal_website: string,
  notification: boolean,
}


const useUserStore = create(
  persist(
    (set, get) => ({
      user: null as User | null,
      projects: null as Project[] | null,
      setUser: (user : User) => { 
        set({ user }) 
      
      },
      setProjects: (projects: Project[]) => {
        set({ projects })
      },
      logout: () => set({ user: null as User | null}),
    }),
    {
      name: 'neploy-user', 
      storage: createJSONStorage(() => sessionStorage), 
    },
  ),
)




export default useUserStore;