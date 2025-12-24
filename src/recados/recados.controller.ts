/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';

// DTO - Data Transfer Object
// DTO -> Simple Object -> Validate data / Transform data

@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @Get()
  findAll(@Query() pagination: Record<string, number>) {
    // const { limit = 10, offset = 10 } = pagination;

    // return `Retorna todos os recados. Limit=${limit}, Offset=${offset}.`;

    return this.recadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recadosService.findOne(id);
  }

  @Post()
  create(@Body() createBodyDto: CreateRecadoDto) {
    return this.recadosService.create(createBodyDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBodyDto: UpdateRecadoDto) {
    return this.recadosService.update(id, updateBodyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recadosService.remove(id);
  }
}
