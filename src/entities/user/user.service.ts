import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AccessibleRecordModel } from '@casl/mongoose'
import { defineAbility } from '@casl/ability'
import { CurrentUser } from '../../auth/currentUser'
import mongoose from 'mongoose'
import { SendGridService } from '@anchan828/nest-sendgrid'
import * as bcrypt from 'bcrypt'

// User
import { User, UserSchema, UserDocument } from './user.model'
import { CreateUserInput, ListUserInput, UpdateUserInput } from './user.inputs'

// Calendar
// import { Calendar, CalendarDocument } from '../calendar/calendar.model'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private model: mongoose.Model<
      UserDocument,
      AccessibleRecordModel<UserDocument>
    >,
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
      passwordHash,
      ...payloadWithoutPassword,
    }
    const model = new this.model(finalPayload)
    console.log('[User create()] [User]', model)
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

  findByEmailOrUsername(
    emailOrUsername: string, //Types.ObjectId |
  ): Promise<User | undefined> {
    const conditions = []

    // if (typeof emailOrUsername === 'string') {
    conditions.push({ email: emailOrUsername })
    conditions.push({ username: emailOrUsername })
    // conditions.push({ _id: emailOrUsername })
    // }

    //.find((user) => user.username === username)
    return this.model.findOne().or(conditions).exec()
  }

  getById(_id: mongoose.Types.ObjectId) {
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

  async delete(_id: mongoose.Types.ObjectId) {
    let model
    try {
      model = await this.model.findByIdAndDelete(_id).exec()
    } catch (error) {
      console.error(error)
      return
    }

    return model
  }

  async increaseFollowingCount(_id: mongoose.Types.ObjectId) {
    return this.model
      .findByIdAndUpdate({ _id }, { $inc: { followingCounter: 1 } })
      .exec()
  }

  async increaseFollowerCount(_id: mongoose.Types.ObjectId) {
    return this.model
      .findByIdAndUpdate({ _id }, { $inc: { followerCounter: 1 } })
      .exec()
  }

  async decreaseFollowingCount(_id: mongoose.Types.ObjectId) {
    return this.model
      .findByIdAndUpdate({ _id }, { $inc: { followingCounter: -1 } })
      .exec()
  }

  async decreaseFollowerCount(_id: mongoose.Types.ObjectId) {
    return this.model
      .findByIdAndUpdate({ _id }, { $inc: { followerCounter: -1 } })
      .exec()
  }
}
