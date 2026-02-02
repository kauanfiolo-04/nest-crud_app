import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus
} from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { type Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth/auth.constants';
import { TokenPayloadParam } from '../auth/params/token-payload.param';
import { TokenPayloadDto } from '../auth/dto/tokenPayload.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('pessoas')
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService) {}

  @Post()
  create(@Body() createPessoaDto: CreatePessoaDto) {
    return this.pessoasService.create(createPessoaDto);
  }

  @UseGuards(AuthTokenGuard)
  @Get()
  findAll(@Req() req: Request) {
    console.log(req[REQUEST_TOKEN_PAYLOAD_KEY]);
    return this.pessoasService.findAll();
  }

  @UseGuards(AuthTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pessoasService.findOne(+id);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePessoaDto: UpdatePessoaDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto
  ) {
    return this.pessoasService.update(+id, updatePessoaDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.pessoasService.remove(+id, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-picture')
  uploadPicture(
    @UploadedFile(
      // Outra maneira de adicionar validação
      // new ParseFilePipe({
      //   validators: [
      //     new MaxFileSizeValidator({ maxSize: 10 * (1024 * 1024) }), // aprox. 10MB
      //     new FileTypeValidator({ fileType: /^image\/(png|jpeg)$/ })
      //   ]
      // })
      new ParseFilePipeBuilder()
        // .addFileTypeValidator({ fileType: /(image\/jpg|image\/jpeg|image\/png)$/ }) // Tá bugando
        .addMaxSizeValidator({ maxSize: 10 * (1024 * 1024) })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })
    )
    file: Express.Multer.File,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto
  ) {
    return this.pessoasService.uploadPicture(file, tokenPayload);
  }
}
