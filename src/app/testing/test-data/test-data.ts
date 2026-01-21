import { User } from '../../core/models/user.model';
import { Post } from '../../core/models/post.model';
import { Comment } from '../../core/models/comment.model';
import { Album } from '../../core/models/album.model';
import { Photo } from '../../core/models/photo.model';

export const TEST_USERS: User[] = [
  {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    password: 'password123'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    username: 'janesmith',
    password: 'password456'
  }
];

export const TEST_POSTS: Post[] = [
  {
    id: 1,
    userId: 1,
    title: 'Test Post 1',
    body: 'This is the body of test post 1'
  },
  {
    id: 2,
    userId: 1,
    title: 'Test Post 2',
    body: 'This is the body of test post 2'
  },
  {
    id: 3,
    userId: 2,
    title: 'Test Post 3',
    body: 'This is the body of test post 3'
  }
];

export const TEST_COMMENTS: Comment[] = [
  {
    id: 1,
    postId: 1,
    name: 'Comment Author 1',
    email: 'author1@test.com',
    body: 'This is a test comment'
  },
  {
    id: 2,
    postId: 1,
    name: 'Comment Author 2',
    email: 'author2@test.com',
    body: 'This is another test comment'
  }
];

export const TEST_ALBUMS: Album[] = [
  {
    id: 1,
    userId: 1,
    title: 'Test Album 1'
  },
  {
    id: 2,
    userId: 1,
    title: 'Test Album 2'
  }
];

export const TEST_PHOTOS: Photo[] = [
  {
    id: 1,
    albumId: 1,
    title: 'Test Photo 1',
    url: 'https://via.placeholder.com/600/1',
    thumbnailUrl: 'https://via.placeholder.com/150/1'
  },
  {
    id: 2,
    albumId: 1,
    title: 'Test Photo 2',
    url: 'https://via.placeholder.com/600/2',
    thumbnailUrl: 'https://via.placeholder.com/150/2'
  }
];