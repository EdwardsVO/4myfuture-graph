# 4MyFuture Graph 📡

Project for quering the 4MyFutureDApp Contract

## Query example
`
{
  proposals(first: 5) {
    id
    owner
    status
    image
    percentage_for_reach_goal
  }
  containers(first: 5) {
    id
    title
    description
    goal
    funds
    images
    pensum_link
    institution_link
    init_date
    finish_date
  }
  contributions{
    id
   	from
    to
    proposal_id
    amount
    image
  }
}`

# Links 💻

1. 4MyFuture Contract [here](https://github.com/4myfutureapp/4myfuture-contract)
2. Query the contract [here](https://api.thegraph.com/subgraphs/name/edwardsvo/for-my-future/graphql)
3. Graph [here](https://thegraph.com/hosted-service/subgraph/edwardsvo/for-my-future)

