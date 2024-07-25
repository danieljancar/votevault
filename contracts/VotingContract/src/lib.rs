#![no_std]

use soroban_sdk::{contract, contractimpl, vec, Address, Env, Map, String, Symbol, Vec};

#[contract]
pub struct VotingContract;

#[contractimpl]
impl VotingContract {
    pub fn create_vote(
        env: Env,
        vote_id: Symbol,
        options: Vec<Symbol>,
        title: String,
        description: String,
        start_date: String,
        end_date: String,
    ) {
        let mut options_map = Map::new(&env);
        for option in options.iter() {
            options_map.set(option, 0u32);
        }

        env.storage().persistent().set(&vote_id, &title);
        env.storage().persistent().set(&title, &description);
        env.storage().persistent().set(&description, &start_date);
        env.storage().persistent().set(&start_date, &end_date);
        env.storage().instance().set(&vote_id, &options_map);
    }

    pub fn get_vote(env: Env, vote_id: Symbol) -> Vec<String> {
        let title: String = env.storage().persistent().get(&vote_id).unwrap();
        let description: String = env.storage().persistent().get(&title).unwrap();
        let start_date: String = env.storage().persistent().get(&description).unwrap();
        let end_date: String = env.storage().persistent().get(&start_date).unwrap();
        vec![&env, title, description, start_date, end_date]
    }

    pub fn cast(env: Env, vote_id: Symbol, option: Symbol, voter: Address) {
        let mut options_map: Map<Symbol, u32> = env.storage().instance().get(&vote_id).unwrap();
        let has_casted_key = (vote_id.clone(), voter.clone());
        let has_casted: bool = env.storage().persistent().has(&has_casted_key.clone());

        if has_casted {
            panic!("Voter has already voted");
        }

        let casts = options_map.get(option.clone()).unwrap_or(0);
        options_map.set(option, casts + 1);
        env.storage().persistent().set(&has_casted_key, &true);
        env.storage().instance().set(&vote_id, &options_map);
    }

    pub fn get_vote_result(env: Env, vote_id: Symbol) -> Map<Symbol, u32> {
        env.storage().instance().get(&vote_id).unwrap()
    }
}

mod test;