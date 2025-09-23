const sequelize = require("./config/sequelize");
const { UserTypeLookup } = require("./models");

const seedUserTypes = async () => {
  try {
    // Sync the database
    await sequelize.sync({ force: false });
    
    // Check if user types already exist
    const existingTypes = await UserTypeLookup.findAll();
    if (existingTypes.length > 0) {
      console.log("User types already seeded");
      return;
    }

    // Seed user types
    const userTypes = [
      {
        name: "Owner",
        description: "Organization owner with full administrative privileges",
        isActive: true,
      },
      {
        name: "Member", 
        description: "Organization member with limited privileges",
        isActive: true,
      },
    ];

    await UserTypeLookup.bulkCreate(userTypes);
    console.log("User types seeded successfully");
  } catch (error) {
    console.error("Error seeding user types:", error);
  } finally {
    await sequelize.close();
  }
};

if (require.main === module) {
  seedUserTypes();
}

module.exports = { seedUserTypes };