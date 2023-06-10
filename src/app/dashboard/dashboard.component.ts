import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TodoModel } from '../model/todo.model';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public todos: any[] = [];
  public formGroup: FormGroup = this.fb.group({});
  public displayAddForm: boolean = false;

  private destroyObservable$ = new Subject();

  constructor(
    private todoService: TodoService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({ todoName: new FormControl(null, [Validators.required]) });

    this.todoService.getDashboard()
      .pipe(takeUntil(this.destroyObservable$))
      .subscribe((res: any) => {
        this.todos = res;
      });
  }

  public onOpenTodo(id: string) {
    this.router.navigate(['todo', id]);
  }

  public onAddTodo() {
    const name = this.formGroup.get('todoName')?.value;
    const data: TodoModel = {
      name,
      todoList: []
    };

    this.todoService.postTodoList(data)
      .pipe(takeUntil(this.destroyObservable$))
      .subscribe(res => {
        this.todos.push(res)
        this.toggleForm();
        this.formGroup.reset();
      });
  }

  //public enableForm() {
  //  this.displayAddForm = true;
  //}

  //public disableForm() {
  //  this.displayAddForm = false;
  //}


  public toggleForm() {

    this.displayAddForm = !this.displayAddForm;
  }

  ngOnDestroy() {
    this.destroyObservable$.next(true);
    this.destroyObservable$.complete();
  }
}
