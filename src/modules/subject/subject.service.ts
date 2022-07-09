import { Injectable, Inject } from '@nestjs/common'
import { CONTEXT } from '@nestjs/graphql'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { plainToInstance } from 'class-transformer'

import { Subject, SubjectDocument } from './subject.model'

// Auth
import { Action } from '@modules/casl/casl-ability.factory'

// Service
import { BaseService } from '@utils/BaseService'
import { School, SchoolDocument } from '@modules/school/school.model'
import {
  Institute,
  InstituteDocument,
} from '@modules/institute/institute.model'

import { CreateSubjectInput } from './subject.inputs'

const MODEL_CLASS = Subject
@Injectable()
export class SubjectService extends BaseService<Subject> {
  modelClass = MODEL_CLASS
  dbModel: Model<SubjectDocument>
  context

  constructor(
    @InjectModel(Subject.name)
    dbModel: Model<SubjectDocument>,
    @InjectModel(School.name)
    private schoolModel: Model<SchoolDocument>,
    @InjectModel(Institute.name)
    private instituteModel: Model<InstituteDocument>,
    @Inject(CONTEXT) context,
  ) {
    super()
    this.dbModel = dbModel
    this.context = context
  }

  async create(payload: CreateSubjectInput) {
    // A Subject can be passed either a Institute or a School
    // If it is passed an Institute, then if that Institute has a School,
    // that school will be automatically assigned as the Subject's School
    let instituteDoc: InstituteDocument
    let institute: Institute
    let schoolDoc: SchoolDocument
    let school: School

    if (payload?.institute) {
      instituteDoc = await this.instituteModel
        .findById(payload.institute)
        .exec()
      institute = plainToInstance(
        Institute,
        instituteDoc.toObject() as Institute,
      )
      if (institute?.school) {
        school = institute.school as School
        payload['school'] = school._id // Update payload for .create()
      }
    } else if (payload?.school) {
      schoolDoc = await this.schoolModel.findById(payload.school).exec()
      school = plainToInstance(School, schoolDoc.toObject() as School)
    }

    const record: Subject = new Subject(school, institute)
    await this.checkPermissons({
      action: Action.Create,
      record,
    })

    return await this.dbModel.create(payload)
  }
}
