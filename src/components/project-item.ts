import { Autobind } from "../decorators/autobind";
import { Draggable } from "../models/drag-drop";
import { Project } from "../models/project";
import { ProjectComponent } from "./project-component";

export class ProjectItem extends ProjectComponent<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project;

    get persons() {
        return this.project.people == 1 ? '1 person' : `${this.project.people} persons`;
    }

    constructor(
        hostId: string,
        project: Project
    ) {
        super('single-project', hostId, 'beforeend', project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }

    renderContent() {
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
        this.element.querySelector('p')!.textContent = this.project.description;
    }

    @Autobind
    dragStartHandler(ev: DragEvent) {
        ev.dataTransfer!.setData('text/plain', this.project.id);
        ev.dataTransfer!.effectAllowed = 'move';
    }

    dragEndHandler(_: DragEvent) {
        console.log('Drag end'); 
    }

    
}