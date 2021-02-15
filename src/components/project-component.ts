export abstract class ProjectComponent<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    constructor(
        templateId: string,
        hostElementId: string,
        positionElement: InsertPosition,
        newElementId?: string,
    ) {
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as T;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as U;
        this.element.id = newElementId ? newElementId : '';

        this.attach(positionElement);
    }

    private attach(position: InsertPosition) {
        this.hostElement.insertAdjacentElement(position, this.element)
    }

    abstract configure(): void;
    abstract renderContent(): void;
}