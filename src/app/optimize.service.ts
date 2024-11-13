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
    return this.http.get(`https://gestao-horarios-940588244292.us-central1.run.app/generate`, { params: {...variables }});
  }
}
