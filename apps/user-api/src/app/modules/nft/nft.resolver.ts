import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NftService } from './nft.service';
import { Nft } from './entities/nft.entity';
import { CreateNftInput } from './dto/create-nft.input';
import { UpdateNftInput } from './dto/update-nft.input';

@Resolver(() => Nft)
export class NftResolver {
  constructor(private readonly nftService: NftService) {}

  @Mutation(() => Nft)
  createNft(@Args('createNftInput') createNftInput: CreateNftInput) {
    return this.nftService.create(createNftInput);
  }

  @Query(() => [Nft], { name: 'nfts' })
  findAll() {
    return this.nftService.findAll();
  }

  @Query(() => Nft, { name: 'nft' })
  findOne(@Args('id', { type: () => String }) nftId: string) {
    return this.nftService.findOne(nftId);
  }

  @Mutation(() => Nft)
  updateNft(@Args('updateNftInput') updateNftInput: UpdateNftInput) {
    return this.nftService.update(updateNftInput.id, updateNftInput);
  }

  @Mutation(() => Nft)
  removeNft(@Args('id', { type: () => String }) nftId: string) {
    return this.nftService.remove(nftId);
  }
}
