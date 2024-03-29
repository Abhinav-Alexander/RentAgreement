const hre = require("hardhat");

async function main() {
    // The address of the deployed RentAgreement contract
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // Get the signers - the first account for the landlord and the third account as the tenant
    const [landlord, , tenant] = await hre.ethers.getSigners();

    console.log("Using the following address as the tenant:", tenant.address);

    // Get the contract instance, connecting it with the landlord account to perform operations
    const RentAgreement = await hre.ethers.getContractFactory("RentAgreement");
    const rentAgreement = RentAgreement.attach(contractAddress).connect(landlord);

    // Execute the setTenant function to set the third account as the tenant
    const setTenantTx = await rentAgreement.setTenant(tenant.address);
    await setTenantTx.wait(); // Wait for the transaction to be mined

    console.log(`Tenant set successfully with address ${tenant.address}. Transaction Hash: ${setTenantTx.hash}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});