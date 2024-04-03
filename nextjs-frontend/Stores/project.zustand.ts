import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Build{
    buildDate: string,
    buildId: string,
    buildLog: string,
    buildStatus: string,
    timeToBuild: string

}
interface Project {
    pId: string,
    title: string,
    description: string,
    git_link: string,
    deployed: boolean,
    status: string,
    date_created: string,
    url: string,
    profileUrl: string,
    date_latest_deploy: string,
    builds: [Build]
}



const useProjectStore = create(
  persist(
    (set, get) => ({
      project: null as Project | null,
        setProject: (project: Project) => {
            set({ project })
        },
        

    }),
    {
      name: 'neploy-project-selected', 
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)




export default useProjectStore;