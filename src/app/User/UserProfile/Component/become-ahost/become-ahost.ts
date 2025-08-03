import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AddHost } from '../../Services/add-host';
import { IAddHost } from '../../Models/iadd-host';

enum QuestionType {
  OPTIONS = 'options',
  MULTI_OPTIONS = 'multi-options',
  NUMBER = 'number',
  TEXT = 'text'
}

interface QuestionOption {
  icon: string;
  text: string;
}

interface Question {
  number: number;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  placeholder?: string;
}

@Component({
  selector: 'app-become-ahost',
  imports: [CommonModule],
  templateUrl: './become-ahost.html',
  styleUrl: './become-ahost.css'
})
export class BecomeAHost implements OnInit {
 QuestionType = QuestionType;
  questions: Question[] = [
  {
    number: 1,
    text: "Tell us about yourself (About Me)",
    type: QuestionType.TEXT,
    placeholder: "Write a short description about yourself"
  },
  {
    number: 2,
    text: "What is your current work?",
    type: QuestionType.TEXT,
    placeholder: "E.g., Software Engineer, Teacher, Freelancer"
  },
  {
    number: 3,
    text: "What is your education background?",
    type: QuestionType.TEXT,
    placeholder: "E.g., Bachelor's in Computer Science"
  },
  {
    number: 4,
    text: "What languages do you speak?",
    type: QuestionType.MULTI_OPTIONS,
    options: [
      { icon: "fa-language", text: "English" },
      { icon: "fa-language", text: "Arabic" }
    ]
  },
  // {
  //   number: 5,
  //   text: "Are you a verified host?",
  //   type: QuestionType.OPTIONS,
  //   options: [
  //     { icon: "fa-check-circle", text: "Yes" },
  //     { icon: "fa-times-circle", text: "No" }
  //   ]
  // },
  // {
  //   number: 6,
  //   text: "What is your total earnings?",
  //   type: QuestionType.NUMBER,
  //   min: 0,
  //   placeholder: "Enter total earnings amount"
  // },
  // {
  //   number: 7,
  //   text: "What is your available balance?",
  //   type: QuestionType.NUMBER,
  //   min: 0,
  //   placeholder: "Enter available balance"
  // },
  // {
  //   number: 8,
  //   text: "What is your Stripe account ID?",
  //   type: QuestionType.TEXT,
  //   placeholder: "Enter your Stripe account ID"
  // },
  // {
  //   number: 9,
  //   text: "Select your default payout method",
  //   type: QuestionType.OPTIONS,
  //   options: [
  //     { icon: "fa-university", text: "Bank Transfer" },
  //     { icon: "fa-credit-card", text: "Credit/Debit Card" },
  //     { icon: "fa-wallet", text: "Wallet" }
  //   ]
  // },
  // {
  //   number: 10,
  //   text: "Enter payout account details",
  //   type: QuestionType.TEXT,
  //   placeholder: "Provide your payout account details"
  // },
  {
    number: 11,
    text: "Where do you live?",
    type: QuestionType.TEXT,
    placeholder: "Enter your city and country"
  },
  {
    number: 12,
    text: "What is your dream destination?",
    type: QuestionType.TEXT,
    placeholder: "E.g., Paris, Tokyo, Maldives"
  },
  {
    number: 13,
    text: "Share a fun fact about yourself",
    type: QuestionType.TEXT,
    placeholder: "Something interesting or funny about you"
  },
  {
    number: 14,
    text: "Do you have pets?",
    type: QuestionType.OPTIONS,
    options: [
      { icon: "fa-dog", text: "Yes" },
      { icon: "fa-times-circle", text: "No" }
    ]
  },
  {
    number: 15,
    text: "What are you obsessed with?",
    type: QuestionType.TEXT,
    placeholder: "E.g., Coffee, Traveling, Music"
  },
  {
    number: 16,
    text: "What’s something special about you?",
    type: QuestionType.TEXT,
    placeholder: "Share something unique about yourself"
  }
];


  currentQuestionIndex = 0;
answers: { [key: number]: string | number | string[] } = {};
  showThankYou = false;
  progressPercent = 0;

  ngOnInit() {
    this.updateProgress();
  }

  get currentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  isSelected(optionText: string): boolean {
    if (this.currentQuestion.type === QuestionType.OPTIONS) {
      return this.answers[this.currentQuestion.number] === optionText;
    } else if (this.currentQuestion.type === QuestionType.MULTI_OPTIONS) {
      return (this.answers[this.currentQuestion.number] as string[])?.includes(optionText) || false;
    }
    return false;
  }

  selectOption(optionText: string) {
    if (this.currentQuestion.type === QuestionType.OPTIONS) {
      this.answers[this.currentQuestion.number] = optionText;
    } else if (this.currentQuestion.type === QuestionType.MULTI_OPTIONS) {
      const currentAnswers = (this.answers[this.currentQuestion.number] as string[]) || [];
      const index = currentAnswers.indexOf(optionText);

      if (index === -1) {
        currentAnswers.push(optionText);
      } else {
        currentAnswers.splice(index, 1);
      }

      this.answers[this.currentQuestion.number] = currentAnswers;
    }
  }



updateInputValue(event: Event): void {
  const input = event.target as HTMLInputElement | null; // التعامل مع null
  if (!input) return;

  const value = input.value; // هنا أكيد string
  this.answers[this.currentQuestion.number] =
    this.currentQuestion.type === QuestionType.NUMBER ? Number(value) : value;
}



  get canProceed(): boolean {
    const answer = this.answers[this.currentQuestion.number];

    if (this.currentQuestion.type === QuestionType.OPTIONS) {
      return !!answer;
    } else if (this.currentQuestion.type === QuestionType.MULTI_OPTIONS) {
      return Array.isArray(answer) && answer.length > 0;
    } else {
      return !!answer && answer.toString().trim() !== '';
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.updateProgress();
    } else {
      this.showThankYou = true;
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.updateProgress();
    }
  }

  updateProgress() {
    this.progressPercent = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

 private mapAnswersToPayload(): IAddHost {
  return {
    aboutMe: String(this.answers[1] || ''),
    work: String(this.answers[2] || ''),
    education: String(this.answers[3] || ''),
    languages: Array.isArray(this.answers[4]) ? (this.answers[4] as string[]).join(', ') : String(this.answers[4] || ''),
    livesIn: String(this.answers[11] || ''),
    dreamDestination: String(this.answers[12] || ''),
    funFact: String(this.answers[13] || ''),
    pets: String(this.answers[14] || ''),
    obsessedWith: String(this.answers[15] || ''),
    specialAbout: String(this.answers[16] || ''),
    // isVerified: false
  };
}





  constructor(private service:AddHost) {}



  submit() {


    const AllHostData = this.mapAnswersToPayload();

    console.log(AllHostData);
    console.log(localStorage.getItem('access_token'));


    this.service.AddHost(AllHostData).subscribe({
      next: (response) => {
        console.log(response);


      }

    })



  }







  restart() {
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.showThankYou = false;
    this.updateProgress();
  }

}
