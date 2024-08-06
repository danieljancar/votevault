#![no_std]

use soroban_sdk::{contract, contractimpl, vec, Address, Env, Map, String, Symbol, Vec};

#[contract]
pub struct VotingContract;

#[contractimpl]
impl VotingContract {
    pub fn create_vote(
        env: Env,
        vote_id: Symbol,
        vote_options: Vec<Symbol>,
        title: String,
        description: String
    ) {
        let mut options_map = Map::new(&env);
        let mut data_map = Map::new(&env);

        data_map.set(String::from_str(&env, "title"), title);
        data_map.set(String::from_str(&env, "description"), description);

        env.storage().persistent().set(&vote_id, &data_map);
        env.storage().instance().set(&vote_id, &options_map);

        if vote_options.len() > 5 {
            panic!("Vote options must be less than 5");
        }

        for option in vote_options.iter() {
            options_map.set(option, 0u32);
        }

        env.storage().persistent().set(&vote_id, &data_map);
        env.storage().instance().set(&vote_id, &options_map);
    }

    pub fn get_vote(env: Env, vote_id: Symbol) -> Vec<String> {
        let data_map: Map<String, String> = env.storage().persistent().get(&vote_id).unwrap();
        let title = data_map.get(String::from_str(&env, "title")).unwrap();
        let description = data_map.get(String::from_str(&env, "description")).unwrap();
        vec![&env, title, description]
    }

    pub fn get_vote_options(env: Env, vote_id: Symbol) -> Vec<Symbol> {
        let options_map: Map<Symbol, u32> = env.storage().instance().get(&vote_id).unwrap();
        options_map.keys()
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
