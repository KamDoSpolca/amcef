import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TodoService } from '../services/todo.service';
import { UUID } from 'uuid-generator-ts';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { ConfirmModalComponent } from '../modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { TodoModel } from '../model/todo.model';
import { TodoItemModel } from '../model/todo-item.model';

@Component({
  selector: 'todo-detail',
  templateUrl: './todo-detail.component.html'
})
export class TodoDetailComponent implements OnInit, OnDestroy {

  public todo: TodoModel = { name: '', todoList: [{}], id:'' };
  public filterargs: boolean | string = 'all';
  public searchText: string = '';
  public displayedColumns = ['finishedState', 'header', 'summary', 'deadline', 'finish', 'delete']
  public formGroup: FormGroup = this.fb.group({});
  public displayAddForm: boolean = false;
  public todayDate: Date = new Date();

  private destroyObservable$ = new Subject();
  private todoId: string = '';

  constructor(
    private todoService: TodoService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      header: new FormControl(null, [Validators.required]),
      summary: new FormControl(null, [Validators.required]),
      deadline: new FormControl(null, [Validators.required])
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.todoId = paramMap.get('id')!;
        this.getTodo();
      }
    });
  }

  public onFilterByState(state: boolean | string) {
    this.filterargs = state;
  }

  public getTodo() {
    this.todoService.getTodoList(this.todoId)
      .pipe(takeUntil(this.destroyObservable$))
      .subscribe((res: any) => {
        this.todo = res;
      }, err => {
        this.snackBar.open('Item Probably Doesnt Exist', 'CLOSE');
        this.router.navigateByUrl('/');
      });
  }

  public onDelete(id: string) {
    const modal = this.matDialog.open(ConfirmModalComponent, {
      width: '450px',
      data: {
        title: '',
        question: 'Are you sure to delete this item ? ',
        header: 'Confirm Deletion',
        cancel: 'Cancel',
        confirm: 'OK',
        btnClass: 'button--delete'
      }
    });

    modal.afterClosed().subscribe(res => {
      if (res) {
        const index = this.todo?.todoList?.findIndex((x: any) => x.id === id);
        this.todo.todoList.splice(index, 1);

        this.updateTodo('Item Deleted');
      }
    });
  }

  public onFinish(id: string) {
    this.todo.todoList.forEach((t: any) => {
      if (t.id === id) {
        t.finishedState = !t.finishedState;
      }
    });

    this.updateTodo('Item Status Changed');
  }

  public onAddTodoItem() {
    const uuid: UUID = new UUID();
    const header = this.formGroup.get('header')?.value;
    const summary = this.formGroup.get('summary')?.value;
    const deadline: Date = this.formGroup.get('deadline')?.value;
    const data: TodoItemModel = {
      deadline: deadline.toISOString(),
      finishedState: false,
      header,
      summary,
      id: uuid.toString()
    };

    this.todo.todoList.push(data);
    this.updateTodo('Item Added', true);   
  }

  public toggleForm() {
    this.displayAddForm = !this.displayAddForm;
  }

  private updateTodo(msg: string, resetForm?: boolean) {
    this.todoService.putTodoList(this.todo.id!, this.todo)
      .pipe(takeUntil(this.destroyObservable$))
      .subscribe((res: any) => {
        this.snackBar.open(msg, 'CLOSE');
        this.todo = res;

        if (resetForm) {
          this.formGroup.reset();
          this.toggleForm();
        }
      });
  }

  ngOnDestroy() {
    this.destroyObservable$.next(true);
    this.destroyObservable$.complete();
  }

  ////Webovú aplikáciu je potrebné nasadiť napr. na netlify.com, githubpages.com
}
