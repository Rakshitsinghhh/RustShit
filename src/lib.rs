use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{AccountInfo,next_account_info},
    entrypoint::ProgramResult, 
    entrypoint,
    msg,
    pubkey::Pubkey};

entrypoint!(Count);

#[derive(BorshDeserialize,BorshSerialize,Debug)]
pub struct Counter{
    pub count:u32,
}

fn Count(
    _program_id:&Pubkey,
    account: &[AccountInfo],
    _instruction_data:&[u8],
)->ProgramResult{

    let mut iter = account.iter();
    let data_account = next_account_info(&mut iter)?;

    let mut counter = Counter::try_from_slice(&data_account.data.borrow())?;


    if counter.count==0{
        counter.count=1;

    }

    else{
        counter.count+=1;
    }

    msg!("counter is incresed");

    counter.serialize(&mut &mut data_account.data.borrow_mut()[..])?;

    Ok(())
}