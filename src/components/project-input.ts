import { Autobind } from "../decorators/autobind";
import { projectState } from "../state/project-state";
import { Validatable, validate } from "../utils/validation";
import { ProjectComponent } from "./project-component";

export class ProjectInput extends ProjectComponent<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        super('project-input', 'app', 'afterbegin', 'user-input');
        this.configure();
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
    }
    
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }

    renderContent() {

    }
    
    private clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.buildUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }

    }

    private buildUserInput(): [ string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleToValidate: Validatable = {
            value: enteredTitle,
            required: true,
        }

        const descriptionToValidate: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }
        
        const peopleToValidate: Validatable = {
            value: enteredPeople,
            required: true,
            min: 1,
            max: 5
        }
        
        if (!validate(titleToValidate) || !validate(descriptionToValidate) || !validate(peopleToValidate)) {
            alert('Invalid input, please try again!');
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }

    }


}