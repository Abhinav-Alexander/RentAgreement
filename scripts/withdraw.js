const hre = require("hardhat");

async function main() {
    // The address of the deployed RentAgreement contract
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

 // Get the signers; assuming the first account is the landlord
 const [landlord] = await hre.ethers.getSigners();

 // Fetch and log the landlord's balance before the withdrawal
 let landlordBalance = await hre.ethers.provider.getBalance(landlord.address);
 console.log(`Landlord's balance before withdrawal: ${hre.ethers.utils.formatEther(landlordBalance)} ETH`);

 // Get the contract instance, connecting it with the landlord account to perform the transaction
 const RentAgreement = await hre.ethers.getContractFactory("RentAgreement");
 const rentAgreement = new hre.ethers.Contract(contractAddress, RentAgreement.interface, landlord);

 // Execute the withdrawRent function
 const withdrawRentTx = await rentAgreement.withdrawRent();
 const receipt = await withdrawRentTx.wait(); // Wait for the transaction to be mined

 // Fetch and log the landlord's balance after the withdrawal
 landlordBalance = await hre.ethers.provider.getBalance(landlord.address);
 console.log(`Rent withdrawal successful. Transaction Hash: ${receipt.transactionHash}`);
}

main().catch((error) => {
 console.error(error);
 process.exit(1);
});