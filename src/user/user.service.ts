import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

// User
import { User, UserDocument } from './user.model'
import { CreateUserInput, ListUserInput, UpdateUserInput } from './user.inputs'

// // Calendar
// import { Calendar, CalendarDocument } from '../calendar/calendar.model'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private model: Model<UserDocument>,
  ) {}

  async create(payload: CreateUserInput) {
    const model = new this.model(payload)
    // console.log('before', { model, payload })

    await model.save()

    // const updateResult = await this.calendar.findByIdAndUpdate(
    //   model.calendar,
    //   { $push: { users: model._id } },
    //   { new: true, useFindAndModify: false },
    // )

    // console.log('user after', { updateResult })

    return model
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
