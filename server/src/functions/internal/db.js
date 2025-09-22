const { syncAllModels } = require("../../config/database");
const { createResponse } = require("../../utils/lambda");

module.exports.handler = async (event) => {
  try {
    const option = event.queryStringParameters && event.queryStringParameters.option;

    switch (option) {
      case "update-all-table":
        await syncAllModels();
        return createResponse(200, { message: "All tables updated successfully." });
      // Add more cases here as needed
      default:
        return createResponse(400, { error: "Invalid option_key" });
    }
  } catch (error) {
    return createResponse(500, { error: "Failed to process request", details: error.message });
  }
};
