import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCapitalizeEachWord]'
})
export class CapitalizeEachWordDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const capitalized = this.capitalizeWords(input.value);
    this.el.nativeElement.value = capitalized;
  }

  private capitalizeWords(value: string): string {
    return value.replace(/\b\w/g, char => char.toUpperCase());
  }
}
