import {
  // Root,
  Args,
  Mutation,
  Query,
  Resolver,
  ID,
} from '@nestjs/graphql'
import { Types } from 'mongoose'

// Discussion
import { Discussion } from './discussion.model'
import { DiscussionService } from './discussion.service'
import {
  CreateDiscussionInput,
  UpdateDiscussionInput,
} from './discussion.inputs'

// Comment
import { CommentInput } from '@modules/comment/comment.inputs'

@Resolver(() => Discussion)
export class DiscussionResolver {
  constructor(private service: DiscussionService) {}

  @Query(() => Discussion)
  async discussion(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.getById(_id)
  }

  // @Query(() => [Event])
  // async events(@Args('filters', { nullable: true }) filters?: ListEventInput) {
  //   return this.service.list(filters)
  // }

  @Mutation(() => Discussion)
  async createDiscussion(@Args('payload') payload: CreateDiscussionInput) {
    return this.service.create(payload)
  }

  @Mutation(() => Discussion, { nullable: true })
  async updateDiscussion(@Args('payload') payload: UpdateDiscussionInput) {
    return this.service.update(payload)
  }

  @Mutation(() => Discussion, { nullable: true })
  async addCommentToDiscussion(
    @Args('discussionId', { type: () => ID }) discussionId: Types.ObjectId,
    @Args('comment') comment: CommentInput,
  ) {
    return this.service.addComment(discussionId, comment)
  }

  @Mutation(() => Discussion, { nullable: true })
  async deleteDiscussion(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.service.delete(_id)
  }
}
