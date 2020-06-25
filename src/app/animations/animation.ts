import { trigger, transition, animate, style, query } from '@angular/animations';

export const myAnimation =
  trigger('routeAnimations', [
    transition('* <=> *', [
      query(':enter, :leave', [
        style({
          position: 'absolute',
          left: 0,
          width: '100%',
          opacity: 0,
          //transform: 'scale(0) translateY(100%)'
        })
      ], { optional: true }),
      query(':enter', [
        animate('3s ease', style({
          opacity: 1, 
          //transform: 'scale(1) translateY(0)'
        })),
      ], { optional: true })
    ])
  ]);