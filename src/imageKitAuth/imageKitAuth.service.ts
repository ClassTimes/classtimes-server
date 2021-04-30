import { Injectable } from '@nestjs/common'
import ImageKit from 'imagekit'
import { ImageKitAuth } from './imageKitAuth.model'

// const IMAGEKIT_PUBLIC_KEY = 'public_RNd28FuVQCtViXjvAYZOXPb66nY=' // Should be passed
const IMAGEKIT_PRIVATE_KEY = 'private_rR9KNzYyYCE8RWvY4HAazatNhfA='
const IMAGEKIT_ENDPOINT = 'https://ik.imagekit.io/classtimes/'

@Injectable()
export class ImageKitAuthService {
  getAuthenticationParameters(publicKey: string): ImageKitAuth {
    const imagekit = new ImageKit({
      publicKey,
      privateKey: IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: IMAGEKIT_ENDPOINT,
    })
    return imagekit.getAuthenticationParameters()
  }
}
