import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { SendGridService } from '@anchan828/nest-sendgrid'
import bcrypt from 'bcrypt'

// User
import { User, UserDocument } from './user.model'
import { CreateUserInput, ListUserInput, UpdateUserInput } from './user.inputs'

// Calendar
// import { Calendar, CalendarDocument } from '../calendar/calendar.model'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private model: Model<UserDocument>,
    private readonly sendGrid: SendGridService,
  ) {}

  async create(payload: CreateUserInput) {
    const { password, ...payloadWithoutPassword } = payload

    let passwordHash: string
    try {
      passwordHash = await bcrypt.hash(password, 10)
    } catch (error) {
      console.error(error)
      throw error
    }

    const finalPayload = {
      password: passwordHash,
      ...payloadWithoutPassword,
    }
    const model = new this.model(finalPayload)
    // console.log('before', { model, payload })

    await model.save()

    await this.sendGrid.send({
      to: model.email,
      from: 'hey@classtimes.app',
      subject: 'Welcome to Classtimes!',
      text: `Hey @${model.username}, 
      
      Welcome to Classtimes!
      
      https://classtimes.app`,
      // html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    })

    // const updateResult = await this.calendar.findByIdAndUpdate(
    //   model.calendar,
    //   { $push: { users: model._id } },
    //   { new: true, useFindAndModify: false },
    // )

    // console.log('user after', { updateResult })

    return model
  }

  findByEmailOrUsername(emailOrUsername: string): Promise<User | undefined> {
    return this.model
      .findOne()
      .or([{ username: emailOrUsername }, { email: emailOrUsername }])
      .exec()
    //.find((user) => user.username === username)
  }

  getById(_id: Types.ObjectId) {
    return this.model.findById(_id).exec()
  }

  list(filters: ListUserInput) {
    return this.model.find({ ...filters }).exec()
  }

  update(payload: UpdateUserInput) {
    return this.model
      .findByIdAndUpdate(payload._id, payload, { new: true })
      .exec()
  }

  async delete(_id: Types.ObjectId) {
    let model
    try {
      model = await this.model.findByIdAndDelete(_id).exec()
    } catch (error) {
      console.error(error)
      return
    }

    // if (model) {
    //   const updateResult = await this.calendar.findByIdAndUpdate(
    //     model.school,
    //     { $pull: { users: _id } },
    //     // { new: true, useFindAndModify: false },
    //   )
    //   console.log('delete updateResult', { updateResult })
    // }

    return model
  }
}
