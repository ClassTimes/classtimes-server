import { Controller, Get, Query } from '@nestjs/common'
import ImageKit from 'imagekit'
import { SkipAuth } from '../auth/decorators'

const IMAGEKIT_PUBLIC_KEY = 'public_RNd28FuVQCtViXjvAYZOXPb66nY=' // Should be passed
const IMAGEKIT_PRIVATE_KEY = 'private_rR9KNzYyYCE8RWvY4HAazatNhfA='
const IMAGEKIT_ENDPOINT = 'https://ik.imagekit.io/classtimes/'

@Controller('imagekitauth')
export class ImageKitAuthController {
  /*
   *
   * To check if this route is working:
   *
   * curl -H "Content-Type: application/json" -X GET http://localhost:5000/imagekitauth
   */
  @Get()
  @SkipAuth() // TODO: Add permissons
  getAuthenticationParameters(): ImageKitSignature {
    const imagekit = new ImageKit({
      publicKey: IMAGEKIT_PUBLIC_KEY, // TODO: Should be passed in the request
      privateKey: IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: IMAGEKIT_ENDPOINT,
    })
    return imagekit.getAuthenticationParameters()
  }
}
interface ImageKitSignature {
  token: string
  expire: number
  signature: string
}
