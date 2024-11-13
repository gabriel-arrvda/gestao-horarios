import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OptimizeService {

  constructor(
    private http: HttpClient
  ) { }

  getOptimizeData(variables: object) {
    return this.http.get(`/api/generate`, { params: {...variables }});
  }
}
