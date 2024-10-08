# Commands

## Build

<h5>theory</h5>

```
stellar contract build
```

## Test

<h5>theory</h5>

```
cargo test
```

## Deploy

<h5>theory</h5>

```
stellar contract deploy \
  --wasm {path-to-wasm-file} \
  --source {local-stellar-user} \
  --network {stellar-network}
```

<h5>example</h5>

```
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/voting_contract.wasm \
  --source grill \
  --network testnet
```

<h5>result</h5>

```
{contract-id} (CXXX)
```

## create_vote

<h5>theory</h5>

```
stellar contract invoke \
  --id {contract-id} \
  --source {local-stellar-user} \
  --network {stellar-network} \
  -- \
  create_vote --vote_id {vote-id} --vote_options '[{vote1}, {vote2}, {...}]' --title {vote-title} --description {vote-description}
```

<h5>example</h5>

```
stellar contract invoke \
  --id CAFM6NNXNSR2ST7EANC4R6EJZ6NUMFGP6EA2RRGXLUCYXPRHHTB36WU2 \
  --source grill \
  --network testnet \
  -- \
  create_vote --vote_id testvote --vote_options '["Trump", "Harris"]' --title TestTitle --description Beschreibung
```

<h5>result</h5>

```
nothing
```

## get_vote

<h5>theory</h5>

```
stellar contract invoke \
  --id {contract-id} \
  --source {local-stellar-user} \
  --network {stellar-network} \
  -- \
  get_vote --vote_id {vote-id}
```

<h5>example</h5>

```
stellar contract invoke \
  --id CAFM6NNXNSR2ST7EANC4R6EJZ6NUMFGP6EA2RRGXLUCYXPRHHTB36WU2 \
  --source grill \
  --network testnet \
  -- \
  get_vote --vote_id testvote
```

<h5>result</h5>

```
["TestTitle","Beschreibung"]
```

## get_vote_options

<h5>theory</h5>

```
stellar contract invoke \
  --id {contract-id} \
  --source {local-stellar-user} \
  --network {ßtellar-network} \
  -- \
  get_vote_options --vote_id {vote-id}
```

<h5>result</h5>

```
['option1', 'option2']
```

## check_if_user_voted

<h5>theory</h5>

```
stellar contract invoke \
  --id {contract-id} \
  --source {local-stellar-user} \
  --network {ßtellar-network} \
  -- \
  check_if_user_voted --vote_id {vote-id} --voter {voter-public-key}
```

<h5>result</h5>

```
true | false
```

## cast

<h5>theory</h5>

```
stellar contract invoke \
  --id {contract-id} \
  --source {local-stellar-user} \
  --network {stellar-network} \
  -- \
  cast --vote_id {vote-id} --option {option} --voter {voter-public-key}
```

<h5>example</h5>

```
stellar contract invoke \
  --id CAFM6NNXNSR2ST7EANC4R6EJZ6NUMFGP6EA2RRGXLUCYXPRHHTB36WU2 \
  --source grill \
  --network testnet \
  -- \
  cast --vote_id testvote --option Trump --voter {voter-public-key}
```

<h5>result</h5>

```
nothing
```

## get_vote_result

<h5>theory</h5>

```
stellar contract invoke \
  --id {contract-id} \
  --source {local-stellar-user} \
  --network {ßtellar-network} \
  -- \
  get_vote_result --vote_id {vote-id}
```

<h5>example</h5>

```
stellar contract invoke \
  --id CAFM6NNXNSR2ST7EANC4R6EJZ6NUMFGP6EA2RRGXLUCYXPRHHTB36WU2 \
  --source grill \
  --network testnet \
  -- \
  get_vote_result --vote_id testvote
```

<h5>result</h5>

```
['Op1', 'Op2'] (key)
['3', '5'] (value)
```
