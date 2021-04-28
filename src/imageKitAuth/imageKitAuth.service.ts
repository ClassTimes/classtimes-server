import { Injectable } from '@nestjs/common'
import ImageKit from 'imagekit'

import { ImageKitAuth } from './imageKitAuth.model'

const IMAGEKIT_PRIVATE_KEY = 'private_rR9KNzYyYCE8RWvY4HAazatNhfA='
const IMAGEKIT_ENDPOINT = 'https://ik.imagekit.io/classtimes/'

// User
@Injectable()
export class ImageKitAuthService {
  getAuthentication(publicKey: string): ImageKitAuth {
    const imagekit = new ImageKit({
      publicKey,
      privateKey: IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: IMAGEKIT_ENDPOINT,
    })
    return imagekit.getAuthenticationParameters()
  }
}
