type MailAddress = `${string}@${string}`

export enum AliasMailType {
  Ens = 'ens_mail',
  Bit = 'dot_bit_mail',
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
