import { HttpStatus, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

import { promises as fs } from 'fs';
import * as path from 'path';
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


    async uploadRenterKyc(detail: any): Promise<UploadApiResponse | UploadApiErrorResponse | { error: boolean, status_code: number, message: string, data: any }> {
        try {


            // check  country 
            const country = await this.countryRepository.findOne({ where: { id: detail.addressCountry } })
            if (!country) {
                return {
                    error: true,
                    status_code: HttpStatus.BAD_REQUEST,
                    message: 'country selected do not exist',
                    data: {}
                };

            }


            return new Promise((resolve, reject) => {
                const storagePath = detail.targetPath // Ensure the correct path


                // Determine resource_type based on file extension
                const ext = path.extname(storagePath).toLowerCase();
                let resourceType: 'image' | 'raw' = 'raw'; // Default to raw

                if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'].includes(ext)) {
                    resourceType = 'image'; // Set resource type for images
                } else if (['.pdf'].includes(ext)) {
                    resourceType = 'raw'; // Set resource type for PDF
                }

                cloudinary.uploader.upload(
                    storagePath,
                    { folder: 'rentalsolution/renterkyc', access_mode: 'public', resource_type: resourceType },
                    async (error, result) => {
                        if (error) {
                            console.error('Cloudinary upload error:', error);
                            return reject(error);
                        }



                    },
                );
            });
        } catch (error) {
            console.error('Error in uploadRenterKyc:', error);
            throw error; // Rethrow to handle this in the calling function
        }
    }
}
