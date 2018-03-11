export interface LogParamsConfig {
    rethinkdb : {
      skip : number,
      limit: number
    }
    cratedb: {
      skip: number,
      limit: number
    }
    increment: number
  }