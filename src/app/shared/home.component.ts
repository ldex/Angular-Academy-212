import { Component } from '@angular/core';

@Component({
    templateUrl: './home.component.html'
})
export class HomeComponent {
    constructor() {
        if (typeof Worker !== 'undefined') {
            console.time('Web Worker');
            // Create a new
            const worker = new Worker('./home.worker', { type: 'module' });
            worker.onmessage = ({ data }) => {
              console.log(`page got message: ${data}`);
              console.timeEnd('Web Worker');
            };
            worker.postMessage('hello');
          } else {
            // Web Workers are not supported in this environment.
            // You should add a fallback so that your program still executes correctly.
          }
    }

}
