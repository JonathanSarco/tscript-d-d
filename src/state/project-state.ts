import { Project, ProjectStatus } from "../models/project";

type Listener<T> = (items: T[]) => void;

abstract class State<T> {
    protected listeners: Listener<T>[] = [];

    public addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }
}

// State
export class ProjectState extends State<Project>{
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
        super();
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    public addProject(title: string, description: string, people: number) {
        const newProject = new Project(Math.random.toString(), title, description, people, ProjectStatus.ACTIVE);
        this.projects.push(newProject);
        this.updateListener();
    }

    public moveProject(projectId: string, newStatus: ProjectStatus) {
        const project = this.projects.find(p => p.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListener();
        }
    }

    private updateListener() {
        for (const fn of this.listeners) {
            fn(this.projects.slice());
        }
    }

}

export const projectState = ProjectState.getInstance();