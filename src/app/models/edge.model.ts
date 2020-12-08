import { ElementRef, Renderer2 } from '@angular/core';
import { nanoid } from 'nanoid/non-secure';
import { AnchorModel } from './anchor.model';

export class EdgeModel {
	id: string;
	element: HTMLElement;

	constructor(private handleA: AnchorModel, private handleB: AnchorModel, private renderer: Renderer2, private domElement: ElementRef) {
		this.id = nanoid();
		this.element = this.renderer.createElement('line', 'svg');
		this.renderer.setAttribute(this.element, 'class', 'edge');
	}

	async render(): Promise<void> {
		return new Promise(() => {
			this.renderer.setAttribute(this.element, 'id', this.id);
			this.renderer.setAttribute(this.element, 'x1', this.handleA.cx.toString());
			this.renderer.setAttribute(this.element, 'y1', this.handleA.cy.toString());
			this.renderer.setAttribute(this.element, 'x2', this.handleB.cx.toString());
			this.renderer.setAttribute(this.element, 'y2', this.handleB.cy.toString());
			this.renderer.appendChild(this.domElement.nativeElement, this.element);
		});
	}

	get points(): { p: number; q: number; r: number; s: number } {
		return { p: this.handleA.cx, q: this.handleA.cy, r: this.handleB.cx, s: this.handleB.cy };
	}

	remove(): void {
		this.renderer.removeChild(this.domElement.nativeElement, this.element);
	}
}
