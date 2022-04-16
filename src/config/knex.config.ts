import knex from "knex"
import knexFile from "../../knexfile"
import {Model} from "objection"

const knexConfig = knex(knexFile["development"])
Model.knex(knexConfig)

export default Model
