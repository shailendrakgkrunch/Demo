import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import List from '../models/list';
import Task from '../models/task';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {
  lists: List[] = [];
  tasks: Task[] = [];
  listId: string;
  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.taskService.getLists()
      .subscribe((lists: List[]) => this.lists = lists);
    this.route.params.subscribe((params: Params) => {
      this.listId = params['listId'];
      if (!this.listId) return;
      this.taskService.getTasks(this.listId)
        .subscribe((tasks: Task[]) => this.tasks = tasks);
    });
  }

  onTaskClick(task: Task) {
    this.taskService.setCompleted(this.listId, task).subscribe(() => task.completed = !task.completed);
  }

  onDeleteTask(task: Task) {
    this.taskService.deleteTask(this.listId, task._id)
      .subscribe((task: Task) =>
        this.tasks = this.tasks.filter(t => t._id != task._id)
      );
  }

  onDeleteList(list: List) {
    this.taskService.deleteList(list._id)
      .subscribe(() =>
        this.lists = this.lists.filter(l => l._id != list._id)
      );
  }

  onAddTask() {
    if (!this.listId) {
      alert('Please select a list to add task to');
      return;
    }
    this.router.navigate(['./new-task'], { relativeTo: this.route });
  }
}
