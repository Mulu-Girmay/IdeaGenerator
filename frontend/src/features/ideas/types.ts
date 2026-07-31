export interface Idea {
  _id: string;
  title: string;
  details: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateIdeaPayload {
  title: string;
  details: string;
}

export interface UpdateIdeaPayload {
  id: string;
  title: string;
  details: string;
}

export interface DeleteIdeaPayload {
  id: string;
}
