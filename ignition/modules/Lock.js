const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

// Example parameters - these can be adjusted as needed.
const RENT_AMOUNT = 1_000_000_000n; // Example rent amount in wei.
const DURATION_MONTHS = 12; // Duration of the rent agreement in months.

module.exports = buildModule("RentAgreementModule", (m) => {
  // The landlord's address, rent amount, and duration are parameters that can be provided during deployment.
  const landlordAddress = m.getParameter("landlordAddress", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"); // Ensure you replace this with a valid address.
  const rentAmount = m.getParameter("rentAmount", RENT_AMOUNT);
  const durationMonths = m.getParameter("durationMonths", DURATION_MONTHS);

  // Deploy the RentAgreement contract with the provided parameters.
  const rentAgreement = m.contract("RentAgreement", [landlordAddress, rentAmount, durationMonths]);

  return { rentAgreement };
});
