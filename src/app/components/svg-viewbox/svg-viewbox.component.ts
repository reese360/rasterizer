import { AfterViewInit, Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { AnchorModel } from 'src/app/models/anchor.model';
import { PixelModel } from 'src/app/models/pixel.model';
import { EdgeModel } from 'src/app/models/edge.model';
import { UserInputService } from 'src/app/services/userInput.service';

@Component({
	selector: 'app-svg-viewbox',
	templateUrl: './svg-viewbox.component.html',
	styleUrls: ['./svg-viewbox.component.scss'],
})
export class SvgViewboxComponent implements AfterViewInit {
	height: number = 500;
	width: number = 500;

	pixelSize: number = 25;

	pixelModelMap: Map<string, PixelModel> = new Map<string, PixelModel>();
	anchorModelMap: Map<string, AnchorModel> = new Map<string, AnchorModel>();
	edgeModelMap: Map<string, EdgeModel> = new Map<string, EdgeModel>();

	offsetX: number = 0;
	offsetY: number = 0;

	hitAnchor: AnchorModel | undefined;

	numAnchors: number = 3;
	anchorPoints: Map<string, number[][]> = new Map<string, number[][]>();

	@ViewChild('svgViewbox') svgViewbox!: ElementRef;
	@ViewChild('anchorGroup') anchorGroup!: ElementRef;
	@ViewChild('edgeGroup') edgeGroup!: ElementRef;
	@ViewChild('pixelGroup') pixelGroup!: ElementRef;

	constructor(private renderer: Renderer2, private userInputSvc: UserInputService) {
		this.anchorPoints.set('3', [
			[this.width * 0.5, this.height * 0.125],
			[this.width * 0.125, this.height * 0.875],
			[this.width * 0.875, this.height * 0.875],
		]);
		this.anchorPoints.set('4', [
			[this.width * 0.5, this.height * 0.125],
			[this.width * 0.125, this.height * 0.5],
			[this.width * 0.5, this.height * 0.875],
			[this.width * 0.875, this.height * 0.5],
		]);
		this.anchorPoints.set('5', [
			[this.width * 0.5, this.height * 0.125],
			[this.width * 0.125, this.height * 0.45],
			[this.width * 0.25, this.height * 0.875],
			[this.width * 0.75, this.height * 0.875],
			[this.width * 0.875, this.height * 0.45],
		]);
		this.anchorPoints.set('6', [
			[this.width * 0.5, this.height * 0.1],
			[this.width * 0.1, this.height * 0.25],
			[this.width * 0.1, this.height * 0.75],
			[this.width * 0.5, this.height * 0.9],
			[this.width * 0.9, this.height * 0.75],
			[this.width * 0.9, this.height * 0.25],
		]);

		this.pixelSize = this.userInputSvc.currentInputs.pixelSize;
		this.numAnchors = this.userInputSvc.currentInputs.numAnchors;
		document.documentElement.style.setProperty('--highlightColor', this.userInputSvc.currentInputs.highlightColor);
		document.documentElement.style.setProperty('--tracerDelay', `${this.userInputSvc.currentInputs.tracerDelay}ms`);

		// subscribe to user input service for changes
		this.userInputSvc.inputUpdateEvent.subscribe((inputs) => {
			document.documentElement.style.setProperty('--highlightColor', inputs.highlightColor);
			document.documentElement.style.setProperty('--tracerDelay', `${inputs.tracerDelay}ms`);

			if (this.numAnchors !== inputs.numAnchors) {
				this.numAnchors = inputs.numAnchors;
				this.createHandleControls();
			}

			// adjust pixel size only if change has been made
			if (this.pixelSize !== inputs.pixelSize) {
				this.pixelSize = inputs.pixelSize;
				this.createPixelGrid();
			}

			this.render();
		});
	}

	createPixelGrid(): void {
		// remove all existing pixels
		this.pixelModelMap.forEach((p) => {
			p.remove();
		});
		this.pixelModelMap.clear();

		// create grid of pixel model objects
		for (let i = 0; i < this.height / this.pixelSize; i++) {
			for (let j = 0; j < this.width / this.pixelSize; j++) {
				const pixel = new PixelModel(this.pixelSize, j * this.pixelSize, i * this.pixelSize, this.renderer, this.pixelGroup);
				this.pixelModelMap.set(pixel.id, pixel);
				pixel.render();
			}
		}
	}

	createHandleControls(): void {
		// remove existing edges
		this.edgeModelMap.forEach((e) => {
			e.remove();
		});
		this.edgeModelMap.clear();

		// erase existing anchors
		this.anchorModelMap.forEach((h) => {
			h.remove();
		});
		this.anchorModelMap.clear();

		// create anchors
		const anchors = this.anchorPoints.get(this.numAnchors.toString());
		if (anchors)
			anchors.forEach((p) => {
				const handle = new AnchorModel(p[0], p[1], this.renderer, this.anchorGroup);
				this.anchorModelMap.set(handle.id, handle);
			});

		// create edges
		const keys = Array.from(this.anchorModelMap.keys());
		for (let i = 0; i < this.anchorModelMap.size; i++) {
			const handleA = this.anchorModelMap.get(keys[i]);
			const handleB = this.anchorModelMap.get(keys[i + 1 === keys.length ? 0 : i + 1]);
			if (handleA && handleB) {
				const edge = new EdgeModel(handleA, handleB, this.renderer, this.edgeGroup);
				this.edgeModelMap.set(edge.id, edge);
			}
		}

		this.render();
	}

	ngAfterViewInit(): void {
		// get offset position of svg viewbox
		this.offsetX = this.svgViewbox.nativeElement.getBoundingClientRect().x;
		this.offsetY = this.svgViewbox.nativeElement.getBoundingClientRect().y;

		this.createPixelGrid();
		this.createHandleControls();
	}

	@HostListener('window:resize', ['$event']) onResize(): void {
		// reset offset position of svg viewbox
		this.offsetX = this.svgViewbox.nativeElement.getBoundingClientRect().x;
		this.offsetY = this.svgViewbox.nativeElement.getBoundingClientRect().y;
	}

	@HostListener('mousedown', ['$event']) onMouseDown(e: { target: { getAttribute: (arg0: string) => any }; ctrlKey: any; clientX: number; clientY: number; preventDefault: () => void }): void {
		const hitObjectTest = this.anchorModelMap.get(e.target.getAttribute('id'));
		if (hitObjectTest) this.hitAnchor = hitObjectTest;
		else this.hitAnchor = undefined;
	}

	@HostListener('mousemove', ['$event']) onMouseMove(e: { preventDefault: () => void; clientX: number; clientY: number }): void {
		if (this.hitAnchor) {
			const mouseX = e.clientX - this.offsetX;
			const mouseY = e.clientY - this.offsetY;
			this.hitAnchor.position = [mouseX, mouseY];
			this.render();
		}
	}

	// mouse up event handler
	@HostListener('mouseup', ['$event']) onMouseUp(e: { clientX: number; clientY: number }): void {
		if (this.hitAnchor) this.hitAnchor = undefined;
		this.render();
	}

	// render all models on screen
	render(): void {
		this.rasterizePixels();

		this.anchorModelMap.forEach((h) => {
			h.render();
		});

		this.edgeModelMap.forEach((e) => {
			e.render();
		});
	}

	rasterizePixels(): void {
		this.pixelModelMap.forEach((pixel) => {
			const a = pixel.x + this.pixelSize / 2; // pixel mid-x
			const b = pixel.y + this.pixelSize / 2; // pixel mid-y
			let inside = false;
			let onEdge = false;

			this.edgeModelMap.forEach((edge) => {
				const { p, q, r, s } = edge.points;

				// determine if pixel point ray intersects with line segment
				const intersect = q > b !== s > b && a < ((r - p) * (b - q)) / (s - q) + p;
				if (intersect) inside = !inside;

				// determine if pixel point is within edge segment
				if (((s - q) * (a - p)).toFixed(0) === ((b - q) * (r - p)).toFixed(0) && ((p > a && a > r) || (p < a && a < r)) && ((q >= b && b >= s) || (q <= b && b <= s))) onEdge = true;

				// determine if pixel point is on end of edge segment
				if ((a === p && b === q) || (a === r && b === s)) onEdge = true;
			});

			// set highlight on/off
			if (inside || onEdge) pixel.highlightOn();
			else pixel.highlightOff();
		});
	}
}
