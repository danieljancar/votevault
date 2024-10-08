#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address, vec, Env};

#[test]
fn initialize() {
    let env = Env::default();
    let contract_id = env.register_contract(None, VotingContract);
    let client = VotingContractClient::new(&env, &contract_id);

    let word = client.create_vote(
        &String::from_str(&env, "ID"),
        &vec![
            &env,
            String::from_str(&env, "OP1"),
            String::from_str(&env, "OP2"),
        ],
        &String::from_str(&env, "Title"),
        &String::from_str(&env, "Description"),
    );
    assert_eq!(word, ());
}

#[test]
#[should_panic]
fn initialize_more_than_5() {
    let env = Env::default();
    let contract_id = env.register_contract(None, VotingContract);
    let client = VotingContractClient::new(&env, &contract_id);

    client.create_vote(
        &String::from_str(&env, "ID"),
        &vec![
            &env,
            String::from_str(&env, "OP1"),
            String::from_str(&env, "OP2"),
            String::from_str(&env, "OP3"),
            String::from_str(&env, "OP4"),
            String::from_str(&env, "OP5"),
            String::from_str(&env, "OP6"),
        ],
        &String::from_str(&env, "Title"),
        &String::from_str(&env, "Description"),
    );
}

#[test]
fn get_vote() {
    let env = Env::default();
    let contract_id = env.register_contract(None, VotingContract);
    let client = VotingContractClient::new(&env, &contract_id);

    client.create_vote(
        &String::from_str(&env, "ID"),
        &vec![
            &env,
            String::from_str(&env, "OP1"),
            String::from_str(&env, "OP2"),
        ],
        &String::from_str(&env, "Title"),
        &String::from_str(&env, "Desc"),
    );

    let vote = client.get_vote(&String::from_str(&env, "ID"));

    assert_eq!(
        vote,
        vec![
            &env,
            String::from_str(&env, "Title"),
            String::from_str(&env, "Desc")
        ]
    )
}

#[test]
fn get_vote_options() {
    let env = Env::default();
    let contract_id = env.register_contract(None, VotingContract);
    let client = VotingContractClient::new(&env, &contract_id);

    client.create_vote(
        &String::from_str(&env, "ID"),
        &vec![
            &env,
            String::from_str(&env, "OP1"),
            String::from_str(&env, "OP2"),
        ],
        &String::from_str(&env, "Title"),
        &String::from_str(&env, "Desc"),
    );

    let options = client.get_vote_options(&String::from_str(&env, "ID"));

    assert_eq!(
        options,
        vec![
            &env,
            String::from_str(&env, "OP1"),
            String::from_str(&env, "OP2")
        ]
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
        &String::from_str(&env, "ID"),
        &vec![
            &env,
            String::from_str(&env, "OP1"),
            String::from_str(&env, "OP2"),
        ],
        &String::from_str(&env, "Title"),
        &String::from_str(&env, "Description"),
    );

    client.cast(
        &String::from_str(&env, "ID"),
        &String::from_str(&env, "OP1"),
        &user_1,
    );
    client.cast(
        &String::from_str(&env, "ID"),
        &String::from_str(&env, "OP1"),
        &user_2,
    );
    client.cast(
        &String::from_str(&env, "ID"),
        &String::from_str(&env, "OP2"),
        &user_3,
    );
    client.cast(
        &String::from_str(&env, "ID"),
        &String::from_str(&env, "OP2"),
        &user_4,
    );
    client.cast(
        &String::from_str(&env, "ID"),
        &String::from_str(&env, "OP2"),
        &user_5,
    );

    let votes = client.get_vote_result(&String::from_str(&env, "ID"));

    assert_eq!(votes.get(String::from_str(&env, "OP1")), Some(2));
    assert_eq!(votes.get(String::from_str(&env, "OP2")), Some(3));
}

#[test]
fn check_if_user_voted() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, VotingContract);
    let client = VotingContractClient::new(&env, &contract_id);

    let user = <soroban_sdk::Address as Address>::generate(&env);

    client.create_vote(
        &String::from_str(&env, "ID"),
        &vec![
            &env,
            String::from_str(&env, "OP1"),
            String::from_str(&env, "OP2"),
        ],
        &String::from_str(&env, "Title"),
        &String::from_str(&env, "Description"),
    );

    let has_voted = client.check_if_user_voted(&String::from_str(&env, "ID"), &user);

    assert_eq!(has_voted, false);

    client.cast(
        &String::from_str(&env, "ID"),
        &String::from_str(&env, "OP2"),
        &user,
    );

    let has_voted = client.check_if_user_voted(&String::from_str(&env, "ID"), &user);

    assert_eq!(has_voted, true);
}
