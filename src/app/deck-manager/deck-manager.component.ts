import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Deck } from './../deck.model';
import { DeckService } from './../deck.service';
import { DeckIdPipe } from './../deck-id.pipe';
import { Question } from './../question.model';
import { QuestionService } from './../question.service';

@Component({
  selector: 'app-deck-manager',
  templateUrl: './deck-manager.component.html',
  styleUrls: ['./deck-manager.component.css'],
  providers: [ DeckService, QuestionService ]
})
export class DeckManagerComponent implements OnInit {
  deckId: string = '';
  deck: FirebaseObjectObservable<any>;
  questions: FirebaseListObservable<any[]>;
  editDeck: boolean = false;
  deleteDeck: boolean = false;
  questionToEdit;

  constructor(private deckService: DeckService, private questionService: QuestionService, private route: ActivatedRoute, private location: Location, private router: Router) { }

  ngOnInit() {
    this.route.params.forEach(urlParameters => {
      this.deckId = urlParameters['id'];
    });
    this.deck = this.deckService.getDeckById(this.deckId);
    this.questions = this.questionService.getQuestions();
  }

  editQuestion(questionId: string) {
    this.questionService.getQuestionById(questionId).subscribe(question => {
      this.questionToEdit = new Question(question.text, question.deck, question.tags, question.answer, question.authorId);
    });
  }

  startDeletingDeck(deckId) {
    this.questionService.purgeByDeckId(deckId);
    this.deckService.deleteDeck(deckId);
    this.router.navigate(['your-decks']);
  }

}
