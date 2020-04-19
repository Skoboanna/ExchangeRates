import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'rate-popup',
  templateUrl: './rate-popup.component.html',
  styleUrls: ['./rate-popup.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate(500, style({ opacity: 0 }))
      ])
    ])]

})
export class RatePopupComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Output() symbol: string;
  @Output() baseSymbol: string;

  constructor() { }

  ngOnInit() { }

  onClose() {
    this.close.emit();
  }

  ngOnDestroy() { }
}

