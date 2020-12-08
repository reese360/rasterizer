import { Component, OnInit } from '@angular/core';
import { UserInputService } from 'src/app/services/userInput.service';

@Component({
	selector: 'app-input-form',
	templateUrl: './input-form.component.html',
	styleUrls: ['./input-form.component.scss'],
})
export class InputFormComponent implements OnInit {
	numAnchors: number[] = [3, 4, 5, 6];

	constructor(public userInputSvc: UserInputService) {}

	ngOnInit(): void {}

	handlePixelSizeChange(): void {
		this.userInputSvc.updatePixelSize();
	}

	handleAnchorCountChange(): void {
		this.userInputSvc.updateHandleCount();
	}

	handleColorChange(): void {
		this.userInputSvc.updateHighlightColor();
	}

	handleTracerDelayChange(): void {
		this.userInputSvc.updateTracerDelay();
	}
}
