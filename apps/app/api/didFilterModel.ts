export namespace DidFilterModel {
  export type parameters = Array<string>

  export enum method {
    None = '',
    BalanceOfBatch = 'balanceOfBatch',
    BalanceOf = 'balanceOf',
    OwnerOf = 'ownerOf',
    EthGetBalance = 'eth_getBalance',
    Members = 'members',
  }

  export enum standardContractType {
    None = '',
    ERC20 = 'ERC20',
    ERC721 = 'ERC721',
    ERC1155 = 'ERC1155',
  }
}
