import { Component, OnDestroy } from '@angular/core';
import { firstValueFrom, interval, Subscription } from 'rxjs';
import { ExamService } from '../services/exam-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam',
  imports: [FormsModule, CommonModule],
  templateUrl: './exam.html',
  styleUrl: './exam.css',
})

export class Exam implements OnDestroy {

  studentId = '';
  examId: string | null = null;
  endsAt = '';
  timer = '10:00';
  answersText = '';
  submitResult = '';
  startInfo = '';

  private pollSub: Subscription | null = null;

  constructor(private examService: ExamService) { }

  startExam() {
    this.startInfo = 'Starting exam...';
    this.examService.startExam(this.studentId || 'anonymous').subscribe({
      next: (res) => {
        this.examId = res.examId;
        this.endsAt = res.endsAt;
        this.submitResult = '';
        this.startInfo = 'Exam started';
        this.startPolling();
      },
      error: (err) => {
        console.error(err);
        this.startInfo = 'Failed to start exam';
        alert('Failed to start exam');
      },
    });
  }

  async checkBtn() {
    if (!this.examId) {
      alert("Start exam first");
      return;
    }

    const data = await this.checkRemaining();

    if (!data) {
      alert("Unable to fetch remaining time");
      return;
    }

    alert(`Status: ${data.status}\nRemaining: ${data.remainingReadable}`);
  }


  async checkRemaining() {
    if (!this.examId) return null;
    try {
      const data = await firstValueFrom(this.examService.getTime(this.examId));
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  startPolling() {
    if (this.pollSub) {
      this.pollSub.unsubscribe();
    }
    this.pollSub = interval(1000).subscribe(() => {
      if (!this.examId) return;
      this.examService.getTime(this.examId).subscribe({
        next: (data) => {
          this.timer = data.remainingReadable;
          if (data.status === 'finished' || data.remainingMs === 0) {
            this.submitResult = 'Exam finished (time up)';
            this.stopPolling();
          }
        },
        error: (e) => {
          console.error(e);
        },
      });
    });
  }

  stopPolling() {
    if (this.pollSub) {
      this.pollSub.unsubscribe();
      this.pollSub = null;
    }
  }

  submit() {
    if (!this.examId) return alert('Start exam first');
    let parsed = {};
    try {
      parsed = this.answersText ? JSON.parse(this.answersText) : {};
    } catch (e) {
      return alert('Enter valid JSON in answers');
    }

    this.examService.submit(this.examId, parsed).subscribe({
      next: (res) => {
        this.submitResult = 'Submitted at ' + res.finishedAt;
        this.stopPolling();
      },
      error: (err) => {
        console.error(err);
        this.submitResult = 'Submit failed: ' + (err.error?.error || 'unknown');
      },
    });
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

}
