type MailAddress = `${string}@${string}`

export enum AliasMailType {
  Ens = 'ens_mail',
  Bit = 'dot_bit_mail',
  SubBit = 'dot_bit_sub_domain_email',
  Eth = 'eth_mail',
  Zilliqa = 'zilliqa_mail',
  UD = 'unstoppable_mail',
}

export interface Alias {
  uuid: string
  address: MailAddress
  is_default: boolean
  email_type: AliasMailType
}

export interface GetAliasResponse {
  aliases: Alias[]
}
