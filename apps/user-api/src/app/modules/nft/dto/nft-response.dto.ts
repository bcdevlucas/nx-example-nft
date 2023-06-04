import { ApiProperty } from '@nestjs/swagger';
import { Nft } from '../entities/nft.entity';
import { AuthorProfileDto } from '@nft/core-modules/user/dto/profile.dto';

export class NftResponseDto extends Nft {
  @ApiProperty({ type: () => AuthorProfileDto })
  authorProfile: AuthorProfileDto;

  @ApiProperty({ type: 'number' })
  shareCount?: number;

  @ApiProperty({ type: 'number' })
  viewCount?: number;

  @ApiProperty({ type: 'number' })
  likesCount?: number;
}
