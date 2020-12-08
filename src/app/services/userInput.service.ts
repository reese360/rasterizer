import { Subject } from 'rxjs/internal/Subject';
import { userInputs } from '../types/userInputs.type';

export class UserInputService {
	public currentInputs: userInputs = {
		pixelSize: 25,
		numAnchors: 3,
		highlightColor: '#1ab1ec',
		tracerDelay: 250,
	};

	invalidPixelCount: boolean = false; // flag for css to show invalid input

	//#region Getters / Setters
	get pixelSize(): number {
		return this.currentInputs.pixelSize;
	}

	set pixelSize(value: number) {
		if (5 <= value && value <= 100) {
			this.currentInputs.pixelSize = value;
			this.invalidPixelCount = false;
		} else this.invalidPixelCount = true;
	}

	//#endregion

	public inputUpdateEvent: Subject<userInputs> = new Subject<userInputs>();

	async updatePixelSize(): Promise<void> {
		return new Promise(() => {
			this.inputUpdateEvent.next(this.currentInputs);
		});
	}

	async updateHandleCount(): Promise<void> {
		return new Promise(() => {
			this.inputUpdateEvent.next(this.currentInputs);
		});
	}

	async updateHighlightColor(): Promise<void> {
		return new Promise(() => {
			this.inputUpdateEvent.next(this.currentInputs);
		});
	}

	async updateTracerDelay(): Promise<void> {
		return new Promise(() => {
			this.inputUpdateEvent.next(this.currentInputs);
		});
	}
}
