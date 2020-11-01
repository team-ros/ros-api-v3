import { Client } from "@elastic/elasticsearch"

export const SearchClient = new Client({ node: String(process.env.ELASTIC_URL) })