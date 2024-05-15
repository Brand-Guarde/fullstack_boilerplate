import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { FormsModule } from '@angular/forms';


interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data;
    });
  }

  addTodo(title: string): void {
    const newTodo: Todo = { id: 0, title, completed: false };
    this.todoService.createTodo(newTodo).subscribe((todo) => {
      this.todos.push(todo);
    });
  }

  updateTodo(todo: Todo): void {
    this.todoService.updateTodo(todo).subscribe();
  }

  deleteTodo(todo: Todo): void {
    this.todoService.deleteTodo(todo.id).subscribe(() => {
      this.todos = this.todos.filter((t) => t.id !== todo.id);
    });
  }
}
