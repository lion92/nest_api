import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Categorie} from "../entity/Categorie.entity";
import {CategorieDTO} from "../dto/CategorieDTO";

@Injectable()
export class CategorieService {
    constructor(
        @InjectRepository(Categorie)
        private categorieRepository: Repository<Categorie>,
    ) {}

    findAll(): Promise<Categorie[]> {
        return this.categorieRepository.find();
    }

    async findOneBy(id: number): Promise<Categorie | null> {
        return await this.categorieRepository.findOneBy({id});
    }

    async delete(id: number) {
        await this.categorieRepository.delete(id);
        console.log('1')
    }

    async create(categorieDTO: CategorieDTO) {
        await this.categorieRepository.save(categorieDTO)
    }

    async update(id: number, categorieDTO: CategorieDTO) {
        await this.categorieRepository.update(id, {description:categorieDTO.description,categorie:categorieDTO.categorie})
    }

}