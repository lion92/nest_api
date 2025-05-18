import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from './todos/todos.module';
import { ConnectionModule } from './connection/connection.module';
import { categorieModule } from './categorie/Categorie.module';
import { ActionModule } from './action/Action.module';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RevenueModule } from './revenue/revenue.module';
import * as dotenv from 'dotenv';

// Assurez-vous que dotenv est chargé avant tout autre code
dotenv.config();

// Vérification de la présence des variables d'environnement essentielles
if (!process.env.secret) {
  console.error('ERREUR: Variable d\'environnement "secret" non définie');
  console.error('Veuillez ajouter secret=votre_cle_secrete dans votre fichier .env');
}

if (!process.env.psw) {
  console.error('ERREUR: Variable d\'environnement "psw" non définie');
  console.error('Veuillez ajouter psw=votre_mot_de_passe_db dans votre fichier .env');
}

@Module({
  imports: [
    // Configuration globale pour l'accès aux variables d'environnement
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MulterModule.register({
      dest: './uploads',
    }),

    // TypeORM avec vérification des variables d'environnement
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const password = configService.get('psw');

        return {
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: password,
          database: 'crud_nest',
          entities: ['dist/**/*.entity.js'],  // Chemin corrigé pour les fichiers compilés
          synchronize: true,
        };
      },
    }),

    // JwtModule avec vérification de la clé secrète
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get('secret');
        if (!secret) {
          throw new Error('La variable d\'environnement "secret" est requise pour la génération de JWT');
        }

        return {
          secret: secret,
          signOptions: { expiresIn: '1d' },
        };
      },
    }),

    TodosModule,
    ConnectionModule,
    categorieModule,
    ActionModule,
    RevenueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    // Vérification de la configuration dans le constructeur
    const secret = this.configService.get('secret');
    const dbPassword = this.configService.get('psw');

    console.log('Configuration chargée:', {
      secretDefined: !!secret,
      dbPasswordDefined: !!dbPassword,
    });
  }
}