export interface CommunityCollaborator {
  address: string
  is_administrator: boolean
}

export interface CommunityCollaboratorsResp {
  collaborators: Array<CommunityCollaborator>
}
