import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateMediaNftOwnerItemDto, CreateNftNftOwnerItemDto } from './create-nft-owner.dto';

export class UpdateMediaNftOwnerItemDto extends PartialType(CreateMediaNftOwnerItemDto) {
  @ApiProperty({ required: true })
  read: boolean;
}

export class UpdateNftNftOwnerItemDto extends PartialType(CreateNftNftOwnerItemDto) {
  @ApiProperty({ required: true })
  read: boolean;
}
