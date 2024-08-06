import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  voteId: FormControl = new FormControl()
  hasClipboard = false

  constructor(private router: Router) {}

  ngOnInit() {
    this.hasClipboard = !!navigator.clipboard
  }

  pasteVoteId() {
    if (navigator.clipboard) {
      navigator.clipboard
        .readText()
        .then(text => {
          this.voteId.setValue(text)
        })
        .catch(err => {
          console.error('Failed to read clipboard contents: ', err)
        })
    }
  }

  searchVote() {
    const id = this.voteId.value
    if (id) {
      this.router.navigate(['/voting', id])
    }
  }

  createVote() {
    this.router.navigate(['/voting', 'create'])
  }
}
