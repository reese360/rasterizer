import { ElementRef, Renderer2 } from '@angular/core';
import { nanoid } from 'nanoid/non-secure';

export class PixelModel {
	id: string;
	element: HTMLElement;
	x: number;
	y: number;
	dimensions: number;
	highlighted: boolean = false;

	constructor(dimensions: number, x: number, y: number, private renderer: Renderer2, private domElement: ElementRef) {
		this.id = nanoid();
		this.x = x;
		this.y = y;
		this.dimensions = dimensions;
		this.element = this.renderer.createElement('rect', 'svg');
		this.renderer.setAttribute(this.element, 'id', this.id);
		this.renderer.setAttribute(this.element, 'x', this.x.toString());
		this.renderer.setAttribute(this.element, 'y', this.y.toString());
		this.renderer.setAttribute(this.element, 'width', this.dimensions.toString());
		this.renderer.setAttribute(this.element, 'height', this.dimensions.toString());
		this.renderer.setAttribute(this.element, 'class', 'pixel');
	}

	async highlightOn(): Promise<void> {
		return new Promise(() => {
			if (this.highlighted) return;
			this.highlighted = true;
			this.renderer.setAttribute(this.element, 'class', 'pixel highlighted');
		});
	}

	async highlightOff(): Promise<void> {
		return new Promise(() => {
			if (!this.highlighted) return;
			this.highlighted = false;
			this.renderer.setAttribute(this.element, 'class', 'pixel');
		});
	}

	async render(): Promise<void> {
		return new Promise(() => {
			this.renderer.appendChild(this.domElement.nativeElement, this.element);
		});
	}

	remove(): void {
		this.renderer.removeChild(this.domElement.nativeElement, this.element);
	}
}
