const hre = require("hardhat");

async function main() {
    // The address of the deployed RentAgreement contract
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // Get the signers; the third account is the tenant
    const [,, tenant] = await hre.ethers.getSigners();

    // The amount of rent to be paid, adjust this according to your contract terms
    const rentAmount = hre.ethers.utils.parseEther("1"); // Example: 1 ether

    // Fetch and log the tenant's balance before the rent payment
    let tenantBalance = await hre.ethers.provider.getBalance(tenant.address);
    console.log(`Tenant's balance before paying rent: ${hre.ethers.utils.formatEther(tenantBalance)} ETH`);

    // Get the contract instance, connecting it with the tenant account to perform the transaction
    const RentAgreement = await hre.ethers.getContractFactory("RentAgreement");
    const rentAgreement = new hre.ethers.Contract(contractAddress, RentAgreement.interface, tenant);

    // Execute the payRent function to pay the rent
    const payRentTx = await rentAgreement.payRent({ value: rentAmount });
    const receipt = await payRentTx.wait(); // Wait for the transaction to be mined

    // Fetch and log the tenant's balance after the rent payment
    tenantBalance = await hre.ethers.provider.getBalance(tenant.address);

    console.log(`Rent paid successfully. Transaction Hash: ${receipt.transactionHash}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
