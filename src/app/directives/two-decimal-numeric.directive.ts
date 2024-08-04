import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTwoDecimalNumeric]'
})
export class TwoDecimalNumericDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    const formattedValue = this.formatToTwoDecimals(input.value);

    input.value = formattedValue;
    
    if (start !== null && end !== null) {
      this.setCursorPosition(input, start, end, formattedValue);
    }
  }

  private formatToTwoDecimals(value: string): string {
    // Remove non-numeric characters except the decimal point
    let sanitized = value.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point is present
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      sanitized = parts[0] + '.' + parts.slice(1).join('');
    }

    // Append zeros to ensure two decimal places
    if (parts.length === 1) {
      sanitized = parts[0] + '.00';
    } else if (parts.length === 2) {
      parts[1] = (parts[1] + '00').slice(0, 2); // Ensure two decimal places
      sanitized = parts[0] + '.' + parts[1];
    }

    return sanitized;
  }

  private setCursorPosition(input: HTMLInputElement, start: number, end: number, formattedValue: string) {
    const newStart = Math.min(start, formattedValue.length);
    const newEnd = Math.min(end, formattedValue.length);

    setTimeout(() => input.setSelectionRange(newStart, newEnd), 0);
  }

}
