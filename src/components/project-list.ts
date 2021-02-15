import { Autobind } from "../decorators/autobind";
import { DragTarget } from "../models/drag-drop";
import { Project, ProjectStatus } from "../models/project";
import { projectState } from "../state/project-state";
import { ProjectComponent } from "./project-component";
import { ProjectItem } from "./project-item";

export class ProjectList extends ProjectComponent<HTMLDivElement, HTMLElement> implements DragTarget {

    assignedProjects: any[] = [];
    
    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', 'beforeend', `${type}-projects`);
        this.configure();
        this.renderContent();
    } 
    
    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);

        projectState.addListener( (projects: Project[]) => {
            const filteredProject = projects.filter(p => {
                if (this.type === 'active') {
                    return p.status === ProjectStatus.ACTIVE
                }
                return p.status === ProjectStatus.FINISHED;
            });
            
            this.assignedProjects = filteredProject;
            this.renderProjects();
        });
    }

    renderContent() {
        const listId = `${this.type}-projects-lists`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }  

    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-lists`)!;
        listEl.innerHTML = '';
        for (const pItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, pItem)
        }
    }

    @Autobind
    dragLeaveHandler(_ev: DragEvent) {
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');
    }

    @Autobind
    dragOverHandler(ev: DragEvent) {
        if (ev.dataTransfer && ev.dataTransfer.types[0] === 'text/plain') {
            ev.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');
        }
    }

    @Autobind
    dropHandler(ev: DragEvent) {
        const pId = ev.dataTransfer!.getData('text/plain');
        projectState.moveProject(pId, this.type === 'active' ? ProjectStatus.ACTIVE : ProjectStatus.FINISHED);
    }

}