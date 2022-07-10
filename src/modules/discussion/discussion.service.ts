import { Injectable, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CONTEXT } from '@nestjs/graphql'
import { Model, Types } from 'mongoose'

// Auth
import { Action } from '@modules/casl/casl-ability.factory'

// Discussion
import { Discussion, DiscussionDocument } from './discussion.model'
import { CreateDiscussionInput } from './discussion.inputs'

// Subject
import { Subject, SubjectDocument } from '@modules/subject/subject.model'

// Comment
import { CommentInput } from '@modules/comment/comment.inputs'

// Service methods
import { BaseService } from '@utils/BaseService'

const MODEL_CLASS = Discussion
@Injectable()
export class DiscussionService extends BaseService<Discussion> {
  modelClass = MODEL_CLASS
  dbModel: Model<DiscussionDocument>
  context

  constructor(
    @InjectModel(Discussion.name)
    private discussionModel: Model<DiscussionDocument>,
    @InjectModel(Subject.name)
    private subjectModel: Model<SubjectDocument>,
    @Inject(CONTEXT) context,
  ) {
    super()
    this.dbModel = this.discussionModel
    this.context = context
  }

  async create(payload: CreateDiscussionInput) {
    const doc: SubjectDocument = await this.subjectModel
      .findById(payload.subject)
      .exec()
    const subject: Subject = new this.subjectModel(doc.toObject())
    const record: Discussion = new Discussion(subject)

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
}
