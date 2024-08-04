import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumeric]'
})
export class NumericDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const capitalized = this.numeric(input.value);
    this.el.nativeElement.value = capitalized;
  }

  private numeric(value: string): string {
    return value.replace(/[^0-9]/g, '');
  }

}
