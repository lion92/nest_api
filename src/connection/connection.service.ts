import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDTO } from '../dto/UserDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/User.entity';
import { compare, hash } from 'bcrypt';
import { LoginDTO } from '../dto/LoginDTO';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(user: UserDTO, res) {
    const userCreate = user;
    const hashedPassword = await hash(user.password, 10);
    user.password = hashedPassword;
    const jwt = await this.jwtService.signAsync(
      { id: user.id },
      { secret: process.env.secret },
    );
    // Générer un token de validation par email

    const emailVerificationToken = uuidv4();

    // Envoyer l'email de validation

    const newUser = this.userRepository.create({
      email: userCreate.email,
      password: hashedPassword,
      emailVerificationToken,
      isEmailVerified: false, // Ajouter un champ pour suivre la vérification de l'email
    });
    await this.sendVerificationEmail(userCreate.email, emailVerificationToken);
    res.cookie('jwt', jwt, { httpOnly: true });
    await this.userRepository
      .save(newUser)
      .catch((reason) => console.log(reason));
  }

  async login(
    user: LoginDTO,
    res,
  ): Promise<{
    id: number;
    email: string;
    prenom: string;
    nom: string;
    jwt: string;
  }> {
    const { password, email } = user;
    const userFind = await this.userRepository.findOneBy({ email: email });
    if (!userFind) {
      throw new NotFoundException('User Not found');
    } else {
      if (!userFind.isEmailVerified) {
        throw new UnauthorizedException('Email not verified');
      }

      const bool = await compare(user.password, userFind.password);

      if (!bool) {
        throw new UnauthorizedException('illegal');
      } else {
        const jwt = await this.jwtService.signAsync(
          { id: userFind.id },
          { secret: process.env.secret },
        );

        res.cookie('jwt', jwt, { httpOnly: true });
        return {
          id: userFind.id,
          email: userFind.email,
          nom: userFind.nom,
          prenom: userFind.prenom,
          jwt: jwt,
        };
      }
    }
  }

  async update(id: number, userDTO: UserDTO) {
    await this.userRepository.update(id, {
      nom: userDTO.nom,
      prenom: userDTO.prenom,
    });
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = token; // Supprimer le token après la vérification

    await this.userRepository.save(user);
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: 'mail.krissclotilde.com',
      port: 465,
      secure: true, // Utiliser SSL/TLS
      auth: {
        user: 'noreply_justerecipes@krissclotilde.com',
        pass: process.env.MAIL, // Mot de passe de votre compte
      },
      tls: {
        rejectUnauthorized: false, // Ignore les erreurs de certificat
      },
    });

    const verificationUrl = `http://localhost:3006/connection/verify-email?token=${token}`;

    const mailOptions = {
      from: 'noreply_justerecipes@krissclotilde.com',
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
    };

    await transporter.sendMail(mailOptions);
  }
}
