import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { School, SchoolDocument } from './school.model'
import {
  CreateSchoolInput,
  ListSchoolInput,
  UpdateSchoolInput,
} from './school.inputs'

@Injectable()
export class SchoolService {
  constructor(
    @InjectModel(School.name)
    private model: Model<SchoolDocument>,
  ) {}

  create(payload: CreateSchoolInput) {
    const model = new this.model(payload)
    return model.save()
  }

  getById(_id: Types.ObjectId) {
    return this.model.findById(_id).exec()
  }

  list(filters: ListSchoolInput) {
    return this.model.find({ ...filters }).exec()
  }

  update(payload: UpdateSchoolInput) {
    return this.model
      .findByIdAndUpdate(payload._id, payload, { new: true })
      .exec()
  }

  delete(_id: Types.ObjectId) {
    return this.model.findByIdAndDelete(_id).exec()
  }
}

// import { Injectable } from '@nestjs/common'
// import { InjectModel } from '@nestjs/mongoose'
// import { Model } from 'mongoose'
// import { CreateSchoolDto } from './dto/create-school.dto'
// // import { School, SchoolDocument } from './schemas/school.schema'
// import { School, SchoolDocument } from './school.model'

// @Injectable()
// export class SchoolService {
//   constructor(
//     @InjectModel(School.name)
//     private readonly schoolModel: Model<SchoolDocument>,
//   ) {}

//   async create(createSchoolDto: CreateSchoolDto): Promise<School> {
//     const createdSchool = new this.schoolModel(createSchoolDto)
//     return createdSchool.save()
//   }

//   async findAll(): Promise<School[]> {
//     return this.schoolModel.find().exec()
//   }
// }
