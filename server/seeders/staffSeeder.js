import Staff from "../models/Staff.js";

export const seedStaff = async () => {
  try {
    await Staff.deleteMany();

    const staffData = [];

    // Pickup Agents
    for (let i = 1; i <= 5; i++) {
      staffData.push({
        name: `Pickup Agent ${i}`,
        phone: `900000000${i}`,
        role: "PICKUP_AGENT"
      });
    }

    // Technicians
    for (let i = 1; i <= 5; i++) {
      staffData.push({
        name: `Technician ${i}`,
        phone: `800000000${i}`,
        role: "TECHNICIAN"
      });
    }

    await Staff.insertMany(staffData);

    console.log("✅ Staff seeded successfully");
  } catch (error) {
    console.error("❌ Staff seeding failed:", error.message);
  }
};