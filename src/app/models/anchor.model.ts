import { ElementRef, Renderer2 } from '@angular/core';
import { nanoid } from 'nanoid/non-secure';

export class AnchorModel {
	id: string;
	element: HTMLElement;
	renderer: Renderer2;
	cx: number;
	cy: number;
	dimensions: number = 2;

	constructor(cx: number, cy: number, renderer: Renderer2, private domElement: ElementRef) {
		this.id = nanoid();
		this.cx = cx;
		this.cy = cy;
		this.renderer = renderer;
		this.element = this.renderer.createElement('circle', 'svg');
		this.element.innerHTML = 'reese';
		this.renderer.setAttribute(this.element, 'id', this.id);
		this.renderer.setAttribute(this.element, 'r', this.dimensions.toString());
		this.renderer.setAttribute(this.element, 'class', 'handle');
	}

	set position(val: [number, number]) {
		this.cx = val[0];
		this.cy = val[1];
	}

	async render(): Promise<void> {
		return new Promise(() => {
			this.renderer.setAttribute(this.element, 'cx', `${this.cx}`);
			this.renderer.setAttribute(this.element, 'cy', `${this.cy}`);
			this.renderer.appendChild(this.domElement.nativeElement, this.element);
		});
	}

	remove(): void {
		this.renderer.removeChild(this.domElement.nativeElement, this.element);
	}
}
