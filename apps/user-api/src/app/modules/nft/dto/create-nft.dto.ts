import { PickType } from '@nestjs/swagger';

export class CreateNftDto extends PickType(Nft, ['visibility', 'title', 'description', 'imageSrc', 'cloneOf']) {
}
