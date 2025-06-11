import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/dto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(todo: Partial<Todo>): Promise<Todo> {
    const newTodo = this.todoRepository.create(todo);
    return this.todoRepository.save(newTodo);
  }

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.find({ order: { createdAt: 'DESC' } });
  }

  async update(id: number, updateTodoDto: Partial<Todo>): Promise<Todo> {
    const todo = await this.todoRepository.preload({ id, ...updateTodoDto });
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }
    return this.todoRepository.save(todo);
  }

  async remove(id: number): Promise<void> {
    const result = await this.todoRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Todo with id ${id} not found`);
    }
  }
}
