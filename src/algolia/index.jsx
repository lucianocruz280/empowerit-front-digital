import algoliasearch from 'algoliasearch/lite'

const searchClient = algoliasearch(
  '3843H2LR41',
  'c336f30a60ef02ccfee9c495fdbbac09'
)

export const usersIndex = searchClient.initIndex("users_index");

export default searchClient