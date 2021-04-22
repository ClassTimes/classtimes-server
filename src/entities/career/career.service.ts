import { Injectable, Inject } from '@nestjs/common'
import { CONTEXT } from '@nestjs/graphql'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { plainToClass } from 'class-transformer'

// Base Service
import { BaseService } from '../../utils/BaseService'

// School
import { School } from '../school/school.model'
import { SchoolService } from '../school/school.service'

// Auth
import { Action } from '../../casl/casl-ability.factory'

// Career
import { Career, CareerDocument } from './career.model'
import {
  ApproveCareerInput,
  CreateCareerInput,
  ListCareerInput,
  UpdateCareerInput,
} from './career.inputs'

const MODEL_CLASS = Career
@Injectable()
export class CareerService extends BaseService<Career> {
  modelClass = MODEL_CLASS
  dbModel: Model<CareerDocument>
  context

  constructor(
    @InjectModel(MODEL_CLASS.name)
    dbModel: Model<CareerDocument>,
    @Inject(CONTEXT) context,
    private schoolService: SchoolService,
  ) {
    super()
    this.dbModel = dbModel
    this.context = context
  }

  async create(payload: CreateCareerInput) {
    await this.checkPermissons({ action: Action.Create })
    const model = new this.dbModel(payload)
    model['createdBy'] = this.currentUser
    return model.save()
  }

  async approveCareer({ careerId, schoolId }: ApproveCareerInput) {
    const careerDocument = await this.getById(careerId)
    const career: Career = plainToClass(
      Career,
      (careerDocument as any).toObject(),
    )
    if (career?.approvingSchool) {
      /* Career is already approved by a school
       * TODO: Throw better error
       */
      throw new Error('School is already approved')
    } else {
      /* User must have admin permissons in the approving School
       * For that, the School is added to the record that will be checked by CASL
       */
      const schoolDocument = await this.schoolService.getById(schoolId)
      const school: School = plainToClass(
        School,
        (schoolDocument as any).toObject(),
      )
      career.approvingSchool = school
      await this.checkPermissons({ action: Action.Update, record: career })
      const updatedCareer = await this.update({
        _id: careerId,
        approvingSchool: schoolId,
      })
      return updatedCareer
    }
  }
}
