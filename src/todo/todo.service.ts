// todo-backend/src/todo/todo.service.ts

// FIX: Nhập thêm NotFoundException để xử lý lỗi 404
import { Injectable, NotFoundException } from '@nestjs/common';
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
    // FIX: Sử dụng findOneBy để tìm chính xác một todo
    const todo = await this.todoRepository.findOneBy({ id: id });

    // FIX: Nếu không tìm thấy, ném ra lỗi 404 chuẩn của NestJS
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    // Trộn các thay đổi và lưu lại
    this.todoRepository.merge(todo, updateTodoDto);
    return this.todoRepository.save(todo);
  }

  async remove(id: number): Promise<void> {
    const result = await this.todoRepository.delete(id);

    // FIX: Nếu không có dòng nào bị ảnh hưởng (xóa thất bại), ném ra lỗi 404
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
  }
}
