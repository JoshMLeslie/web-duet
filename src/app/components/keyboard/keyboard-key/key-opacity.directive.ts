import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
	selector: '[appKeyOpacity]'
})
export class KeyOpacityDirective {
	@Input('appKeyOpacity') set opac(tone: number) {
		this.el.nativeElement.style.opacity = tone / 100;
	}

	constructor(private el: ElementRef) {}
}
