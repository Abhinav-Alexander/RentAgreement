const hre = require("hardhat");

async function main() {
    // Get the signers provided by Hardhat
    const [deployer, landlord] = await hre.ethers.getSigners();
  
    // Compile the contract and get a contract factory
    const RentAgreement = await hre.ethers.getContractFactory("RentAgreement");
  
    // Deploy the contract with the specified constructor arguments
    const rentAmount = hre.ethers.utils.parseEther("1"); // Example: 1 ether as the rent amount
    const durationMonths = 12; // Example: 12 months duration
  
    // Use the deployer account to deploy the contract
    const rentAgreement = await RentAgreement.deploy(landlord.address, rentAmount, durationMonths);
  
    // Wait for the contract to be deployed
    await rentAgreement.deployed();
  
    console.log("RentAgreement deployed to:", rentAgreement.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
