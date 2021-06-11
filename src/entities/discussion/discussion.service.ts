import { Injectable, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CONTEXT } from '@nestjs/graphql'
import { Model, Types } from 'mongoose'
import { plainToClass } from 'class-transformer'

// Auth
import { Action } from '../../casl/casl-ability.factory'

// Discussion
import { Discussion, DiscussionDocument } from './discussion.model'
import {
  CreateDiscussionInput,
  ListDiscussionInput,
  UpdateDiscussionInput,
} from './discussion.inputs'

// Subject
import { Subject, SubjectDocument } from '../subject/subject.model'
import { SubjectService } from '../subject/subject.service'

// Comment
import { CommentInput } from '../comment/comment.inputs'

// Service methods
import { BaseService } from '../../utils/BaseService'

const MODEL_CLASS = Discussion
@Injectable()
export class DiscussionService extends BaseService<Discussion> {
  modelClass = MODEL_CLASS
  dbModel: Model<DiscussionDocument>
  context

  constructor(
    @InjectModel(Discussion.name)
    dbModel: Model<DiscussionDocument>,
    @InjectModel(Subject.name)
    private subjectModel: Model<SubjectDocument>,
    @Inject(CONTEXT) context,
  ) {
    super()
    this.dbModel = dbModel
    this.context = context
  }

  async create(payload: CreateDiscussionInput) {
    const doc: SubjectDocument = await this.subjectModel
      .findById(payload.subject)
      .exec()
    const model: Subject = plainToClass(Subject, doc.toObject())
    const record: Discussion = new Discussion(model)
    await this.checkPermissons({
      action: Action.Create,
      record,
    })
    return await this.dbModel.create(payload)
  }

  async addComment(discussionId: Types.ObjectId, comment: CommentInput) {
    const discussion: DiscussionDocument = await this.dbModel
      .findById(discussionId)
      .exec()

    discussion.comments.push(comment)
    return discussion.save()
  }

  // list(filters: ListEventInput) {
  //   //  return this.model.find({ ...filters }).exec()
  //
}
