import { HttpStatus, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import path, { join } from 'path';
import { promises as fs } from 'fs';

import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../user/user.entity';
import Country from '../country/country.entity';


@Injectable()
export class CloudinaryService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Country)
        private countryRepository: Repository<Country>,

    ) {
        // Initialize Cloudinary with your credentials
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
            api_key: process.env.CLOUDINARY_API_KEY,       // Your Cloudinary API key
            api_secret: process.env.CLOUDINARY_API_SECRET,   // Your Cloudinary API secret
        });
    }

    // async uploadUserDocument(data) {
    //     try {
    //         cloudinary.config({
    //             cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    //             api_key: process.env.CLOUDINARY_API_KEY,
    //             api_secret: process.env.CLOUDINARY_API_SECRET,
    //         });
    //         //read file to be uploaded  to cloudinary from diskstorage
    //         const storagePath = join(
    //             path.resolve('./'),
    //             `/uploads/identification-document/${data.filename}`,
    //         );

    //         console.log(storagePath)
    //         //construct db path for image to be searched
    //         const imageInDBPath = `uploads/identification-document/${data.filename}`;

    //         // Upload the image
    //         const result = await cloudinary.uploader.upload(storagePath);

    //         console.log(result)

    //         return result.secure_url;

    //     } catch (error) { }
    // }

    async uploadUserDocument(data, email: string): Promise<string> {
        try {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            });

            const storagePath = join(path.resolve('./'), `/uploads/identification-document/${data.filename}`);



            // Determine resource_type based on file extension
            const ext = path.extname(storagePath).toLowerCase();
            let resourceType: 'image' | 'raw' = 'raw'; // Default to raw

            if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'].includes(ext)) {
                resourceType = 'image'; // Set resource type for images
            } else if (['.pdf'].includes(ext)) {
                resourceType = 'raw'; // Set resource type for PDF
            }

            const result = await cloudinary.uploader.upload(storagePath,
                { folder: 'syndicatekycs/' + email, access_mode: 'public', resource_type: resourceType },);

            if (!result || !result.secure_url) {
                throw new Error(`Cloudinary upload failed for ${data.filename}`);
            }

            console.log('Cloudinary Upload Response:', result.secure_url);
            return result.secure_url;
        } catch (error) {
            console.error('Cloudinary Upload Error:', error);
            throw new Error(`Upload failed for ${data.filename}`);
        }
    }

}
