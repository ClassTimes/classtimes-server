import { Controller, Post, Body } from '@nestjs/common'
import ImageKit from 'imagekit'
import { SkipAuth } from '../auth/decorators'

const IMAGEKIT_PRIVATE_KEY = 'private_rR9KNzYyYCE8RWvY4HAazatNhfA='
const IMAGEKIT_ENDPOINT = 'https://ik.imagekit.io/classtimes/'

@Controller('imagekitauth')
export class ImageKitAuthController {
  /*
   *
   * To check if this route is working:
   *
   * curl -d '{ "publicKey": "tuvieja" }' -H "Content-Type: application/json" -X POST http://localhost:5000/imagekitauth
   *
   */
  @Post()
  @SkipAuth() // TODO: Add permissons
  getAuthenticationParameters(@Body() body: ImageKitAuthBody): ImageKit {
    const imagekit = new ImageKit({
      publicKey: body?.publicKey,
      privateKey: IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: IMAGEKIT_ENDPOINT,
    })
    return imagekit.getAuthenticationParameters()
  }
}

interface ImageKitAuthBody {
  publicKey: string
}
interface ImageKit {
  token: string
  expire: number
  signature: string
}
