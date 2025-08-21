import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { LiteSVM } from "litesvm"


const svm = new LiteSVM();
const payer = new Keypair();
const cpubkey = new Keypair();
const reciever  =  new Keypair();


test("one transfer",()=>{

    svm.airdrop(payer.publicKey,BigInt(1*LAMPORTS_PER_SOL))
    svm.addProgramFromFile(cpubkey.publicKey,"/home/rakshit/projects/sample/client/sample.so")

    const blockhash =  svm.latestBlockhash();

    const txn = [
        SystemProgram.createAccount({
            fromPubkey:payer.publicKey,
            newAccountPubkey: reciever.publicKey,
            lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))),
            space:4,
            programId: cpubkey.publicKey,
        }),
    ]

    const tx = new Transaction();
    tx.recentBlockhash=blockhash;
    tx.add(...txn)
    tx.sign(payer,reciever)
    svm.sendTransaction(tx)
    svm.expireBlockhash();

    const balanceafter = svm.getBalance(reciever.publicKey);
    
    expect(balanceafter).toBe(svm.minimumBalanceForRentExemption(BigInt(4)));

})

test("two",()=>{

    function txt(){
        const txn2= new TransactionInstruction({
            keys:[
            {pubkey: reciever.publicKey, isSigner:false,isWritable:true},
            ],
            programId:cpubkey.publicKey,
            data:Buffer.from("")
        })

        const tx2 = new Transaction();
        const blockhash2=svm.latestBlockhash();
        tx2.recentBlockhash=blockhash2;
        tx2.add(txn2);
        tx2.sign(payer),
        svm.sendTransaction(tx2);
        svm.expireBlockhash();
    }

    txt();
    txt();
    txt();
    txt();

    const newData=svm.getAccount(reciever.publicKey);
    console.log(newData?.data);
})


