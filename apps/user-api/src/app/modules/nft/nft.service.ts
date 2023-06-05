import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNftInput } from './dto/create-nft.input';
import { UpdateNftInput } from './dto/update-nft.input';
import { Nft } from './entities/nft.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(Nft)
    private readonly nftRepository: Repository<Nft>,
  ) {}

  async create(createNftInput: CreateNftInput): Promise<Nft> {
    const nft = this.nftRepository.create(createNftInput as DeepPartial<Nft>);
    return await this.nftRepository.save(nft);
  }

  async findAll(): Promise<Array<Nft>> {
    return await this.nftRepository.find();
  }

  async findOne(nftId: string): Promise<Nft> {
    const nft = await this.nftRepository.findOne({ where: { id: nftId } });
    if (!nft) {
      throw new NotFoundException(`Nft #${nftId} not found`);
    }
    return nft;
  }

  async update(
    nftId: string,
    updateNftInput: UpdateNftInput,
  ): Promise<Nft> {
    const nft = await this.nftRepository
      .preload({ id: nftId, ...updateNftInput } as DeepPartial<Nft>);
    if (!nft) {
      throw new NotFoundException(`Nft #${nftId} not found`);
    }
    return this.nftRepository.save(nft);
  }

  async remove(nftId: string): Promise<Nft> {
    const nft = await this.findOne(nftId);
    await this.nftRepository.remove(nft);
    return nft;
  }
}
