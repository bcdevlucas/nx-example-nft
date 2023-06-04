import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ObjectId } from '@nft/core-lib';

export class CreateMediaNftOwnerItemDto {
  @ApiProperty({ required: true })
  @IsString()
  userId: ObjectId;

  @ApiProperty({ required: false })
  @IsString()
  mediaId?: ObjectId;

  @ApiProperty({ required: false })
  @IsString()
  nftId?: ObjectId;

  @ApiProperty({ required: true })
  @IsString()
  createdBy: ObjectId;

  @ApiProperty({ required: false })
  @IsString()
  title: string;
}

export class CreateNftNftOwnerItemDto {
  @ApiProperty({ required: true })
  @IsString()
  userId: ObjectId;

  @ApiProperty({ required: false })
  @IsString()
  nftId: ObjectId;

  @ApiProperty({ required: true })
  @IsString()
  createdBy: ObjectId;

  @ApiProperty({ required: false })
  @IsString()
  title: string;
}
