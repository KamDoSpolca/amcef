import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TodoModel } from '../model/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {

  private readonly BACKEND_URL = 'https://647e0baaaf984710854ad9a8.mockapi.io';

  constructor(
    private http: HttpClient,
    public router: Router
  ) { }

  getDashboard() {
    return this.http.get(`${this.BACKEND_URL}/api/todos`);
  }

  postTodoList(data: TodoModel) {
    return this.http.post(`${this.BACKEND_URL}/api/todos`, data);
  }

  putTodoList(id: string, data: TodoModel) {
    return this.http.put(`${this.BACKEND_URL}/api/todos/${id}`, data);
  }

  getTodoList(id: string) {
    return this.http.get(`${this.BACKEND_URL}/api/todos/${id}`);
  }
}
