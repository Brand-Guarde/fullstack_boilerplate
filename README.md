# Technical Test Boilerplate

This repo contains a Rails backend and an Angular front-end project that serves as base code for Full Stack developer interviews.

# How to generate

The steps to generate the starter code for both the Rails project and the Angular project are:

### Rails (Backend)

1. **Create a New Rails Project:**
   ```bash
   rails new todo_app --api
   cd todo_app
   ```

2. **Add the `rack-cors` Gem:**
   Add the following line to your `Gemfile`:
   ```ruby
   gem 'rack-cors'
   ```
   Then run:
   ```bash
   bundle install
   ```

3. **Configure CORS:**
   Create a new file at `config/initializers/cors.rb` and add:
   ```ruby
   Rails.application.config.middleware.insert_before 0, Rack::Cors do
     allow do
       origins '*'  # Adjust this to specify allowed origins if needed
       resource '*',
         headers: :any,
         methods: [:get, :post, :put, :patch, :delete, :options, :head],
         max_age: 600
     end
   end
   ```

4. **Generate the `Todo` Model and Controller:**
   ```bash
   rails generate model Todo title:string completed:boolean due_date:datetime
   rails db:migrate
   rails generate controller Todos
   ```

5. **Set Up the Routes:**
   Add the following to `config/routes.rb`:
   ```ruby
   Rails.application.routes.draw do
     resources :todos
   end
   ```

6. **Create the Todos Controller:**
   Update `app/controllers/todos_controller.rb`:
   ```ruby
   class TodosController < ApplicationController
     def index
       @todos = Todo.all
       render json: @todos
     end

     def show
       @todo = Todo.find(params[:id])
       render json: @todo
     end

     def create
       @todo = Todo.new(todo_params)
       if @todo.save
         render json: @todo, status: :created
       else
         render json: @todo.errors, status: :unprocessable_entity
       end
     end

     def update
       @todo = Todo.find(params[:id])
       if @todo.update(todo_params)
         render json: @todo
       else
         render json: @todo.errors, status: :unprocessable_entity
       end
     end

     def destroy
       @todo = Todo.find(params[:id])
       @todo.destroy
       head :no_content
     end

     private

     def todo_params
       params.require(:todo).permit(:title, :completed, :due_date)
     end
   end
   ```

7. **Add Validation to the `Todo` Model:**
   Update `app/models/todo.rb`:
   ```ruby
   class Todo < ApplicationRecord
     validates :title, presence: true
   end
   ```

8. **Start the Rails Server:**
   ```bash
   rails server
   ```

### Angular (Frontend)

1. **Create a New Angular Project:**
   ```bash
   ng new todo-app
   cd todo-app
   ```

   Respond to the prompts:
   ```
   Would you like to add Angular routing? (y/N) y
   Which stylesheet format would you like to use? (Use arrow keys) CSS
   ```

2. **Generate a Todo Service and Component:**
   ```bash
   ng generate service todo
   ng generate component todo-list
   ```

3. **Install `@angular/common/http`:**
   ```bash
   npm install @angular/common@latest
   ```

4. **Update the Angular Module:**
   Update `src/app/app.module.ts` to import `FormsModule` and `HttpClientModule`:
   ```typescript
   import { BrowserModule } from '@angular/platform-browser';
   import { NgModule } from '@angular/core';
   import { AppRoutingModule } from './app-routing.module';
   import { AppComponent } from './app.component';
   import { TodoListComponent } from './todo-list/todo-list.component';
   import { FormsModule } from '@angular/forms';
   import { HttpClientModule } from '@angular/common/http';

   @NgModule({
     declarations: [
       AppComponent,
       TodoListComponent
     ],
     imports: [
       BrowserModule,
       AppRoutingModule,
       FormsModule,
       HttpClientModule
     ],
     providers: [],
     bootstrap: [AppComponent]
   })
   export class AppModule { }
   ```

5. **Set Up the Todo Service:**
   Update `src/app/todo.service.ts`:
   ```typescript
   import { Injectable } from '@angular/core';
   import { HttpClient } from '@angular/common/http';
   import { Observable } from 'rxjs';

   interface Todo {
     id: number;
     title: string;
     completed: boolean;
     due_date?: string;
   }

   @Injectable({
     providedIn: 'root'
   })
   export class TodoService {
     private apiUrl = 'http://localhost:3000/todos';

     constructor(private http: HttpClient) {}

     getTodos(): Observable<Todo[]> {
       return this.http.get<Todo[]>(this.apiUrl);
     }

     createTodo(todo: Todo): Observable<Todo> {
       return this.http.post<Todo>(this.apiUrl, todo);
     }

     updateTodo(todo: Todo): Observable<Todo> {
       return this.http.put<Todo>(`${this.apiUrl}/${todo.id}`, todo);
     }

     deleteTodo(id: number): Observable<void> {
       return this.http.delete<void>(`${this.apiUrl}/${id}`);
     }
   }
   ```

6. **Set Up the Todo List Component:**
   Update `src/app/todo-list/todo-list.component.ts`:
   ```typescript
   import { Component, OnInit } from '@angular/core';
   import { TodoService } from '../todo.service';

   interface Todo {
     id: number;
     title: string;
     completed: boolean;
     due_date?: string;
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

     addTodo(title: string, dueDate: string): void {
       const newTodo: Todo = { id: 0, title, completed: false, due_date: dueDate };
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
   ```

7. **Update the Todo List Component Template:**
   Update `src/app/todo-list/todo-list.component.html`:
   ```html
   <div>
     <input #newTodoTitle placeholder="New Todo" />
     <input type="date" #newTodoDueDate placeholder="Due Date" />
     <button (click)="addTodo(newTodoTitle.value, newTodoDueDate.value); newTodoTitle.value=''; newTodoDueDate.value=''">Add</button>
   </div>
   <ul>
     <li *ngFor="let todo of todos">
       <input type="checkbox" [(ngModel)]="todo.completed" (change)="updateTodo(todo)" />
       <span>{{ todo.title }} - {{ todo.due_date | date }}</span>
       <button (click)="deleteTodo(todo)">Delete</button>
     </li>
   </ul>
   ```

8. **Serve the Angular Application:**
   ```bash
   ng serve
   ```

After following these steps, your Rails backend should be properly set up to handle CORS requests and include the necessary CRUD operations, and your Angular frontend should be configured to interact with the backend and include forms and HTTP functionality.

This setup should allow candidates to extend and improve upon the existing functionality during the interview.
