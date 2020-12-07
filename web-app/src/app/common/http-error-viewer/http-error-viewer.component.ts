import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-http-error-viewer',
    templateUrl: './http-error-viewer.component.html',
    styleUrls: ['./http-error-viewer.component.scss'],
})
export class HttpErrorViewerComponent implements OnInit {
    @Input()
    httpError!: HttpErrorResponse;
    constructor() {}

    ngOnInit(): void {}
}
