import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { error } from 'console';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private taskRepository: TasksRepository) {}

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOneBy({ id, user });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.taskRepository.delete({id, user})
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id: ${id} not found!`);
    }
  }

  getTasks = async (filterDTO: GetTasksFilterDto, user: User) : Promise<Task[]> => {
    return this.taskRepository.getTasks(filterDTO, user);
  }
  
  updateTaskStatus = async (id: string, status: TaskStatus, user: User): Promise<Task> => {
    const task = await this.getTaskById(id, user);

    task.status = status;
    await this.taskRepository.save(task);
    return task;
  };

  // private tasks: Task[] = [];
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter(
  //       (task) =>
  //         task.title.includes(search) || task.description.includes(search),
  //     );
  //   }
  //   return tasks;
  // }
  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }
}
