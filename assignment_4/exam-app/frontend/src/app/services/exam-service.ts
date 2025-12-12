import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ExamService {
  
  private base = 'http://localhost:3001';
  constructor(private http: HttpClient) { }


  startExam(studentId: string): Observable<any> {
    return this.http.post(`${this.base}/exam/start`, { studentId });
  }


  getTime(examId: string): Observable<any> {
    return this.http.get(`${this.base}/exam/${examId}/time`);
  }


  submit(examId: string, answers: any): Observable<any> {
    return this.http.post(`${this.base}/exam/${examId}/submit`, { answers });
  }
}
