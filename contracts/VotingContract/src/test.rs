#![cfg(test)]

use super::*;
use soroban_sdk::{symbol_short, testutils::Address, vec, Env};

#[test]
fn initialize() {
    let env = Env::default();
    let contract_id = env.register_contract(None, VotingContract);
    let client = VotingContractClient::new(&env, &contract_id);

    let word = client.create_vote(
        &symbol_short!("ID"),
        &vec![&env, symbol_short!("OP1"), symbol_short!("OP2")],
        &String::from_str(&env, "Title"),
        &String::from_str(&env, "Description"),
        &String::from_str(&env, "0"),
        &String::from_str(&env, "0"),
    );
    assert_eq!(word, ());
}

#[test]
fn get_vote() {
    let env = Env::default();
    let contract_id = env.register_contract(None, VotingContract);
    let client = VotingContractClient::new(&env, &contract_id);

    client.create_vote(
        &symbol_short!("ID"),
        &vec![&env, symbol_short!("OP1"), symbol_short!("OP2")],
        &String::from_str(&env, "Title"),
        &String::from_str(&env, "Desc"),
        &String::from_str(&env, "0"),
        &String::from_str(&env, "0"),
    );

    let vote = client.get_vote(&symbol_short!("ID"));

    assert_eq!(
        vote,
        vec![
            &env,
            String::from_str(&env, "Title"),
            String::from_str(&env, "Desc"),
            String::from_str(&env, "0"),
            String::from_str(&env, "0")
        ]
    )
}

#[test]
fn get_vote_options() {
    let env = Env::default();
    let contract_id = env.register_contract(None, VotingContract);
    let client = VotingContractClient::new(&env, &contract_id);

    client.create_vote(
        &symbol_short!("ID"),
        &vec![&env, symbol_short!("OP1"), symbol_short!("OP2")],
        &String::from_str(&env, "Title"),
        &String::from_str(&env, "Desc"),
        &String::from_str(&env, "0"),
        &String::from_str(&env, "0"),
    );

    let options = client.get_vote_options(&symbol_short!("ID"));

    assert_eq!(
        options,
        vec![&env, symbol_short!("OP1"), symbol_short!("OP2")]
    );
}

#[test]
fn vote() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, VotingContract);
    let client = VotingContractClient::new(&env, &contract_id);

    let user_1 = <soroban_sdk::Address as Address>::generate(&env);

    let user_2 = <soroban_sdk::Address as Address>::generate(&env);

    let user_3 = <soroban_sdk::Address as Address>::generate(&env);

    let user_4 = <soroban_sdk::Address as Address>::generate(&env);

    let user_5 = <soroban_sdk::Address as Address>::generate(&env);

    client.create_vote(
        &symbol_short!("ID"),
        &vec![&env, symbol_short!("OP1"), symbol_short!("OP2")],
        &String::from_str(&env, "Title"),
        &String::from_str(&env, "Description"),
        &String::from_str(&env, "0"),
        &String::from_str(&env, "0"),
    );

    client.cast(&symbol_short!("ID"), &symbol_short!("OP1"), &user_1);
    client.cast(&symbol_short!("ID"), &symbol_short!("OP1"), &user_2);
    client.cast(&symbol_short!("ID"), &symbol_short!("OP2"), &user_3);
    client.cast(&symbol_short!("ID"), &symbol_short!("OP2"), &user_4);
    client.cast(&symbol_short!("ID"), &symbol_short!("OP2"), &user_5);

    let votes = client.get_vote_result(&symbol_short!("ID"));

    assert_eq!(votes.get(symbol_short!("OP1")), Some(2));
    assert_eq!(votes.get(symbol_short!("OP2")), Some(3));
}
