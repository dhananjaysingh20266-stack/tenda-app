const { connectToDatabase_RW } = require('../../config/database');
const { User, Organization, Game } = require('../../models');
const { Common } = require('../../helpers/Common');
const { Messages } = require('../../helpers/Messages');
const { Constants } = require('../../helpers/Constants');

/**
 * Internal API to sync all database tables when model changes occur
 * This should be used carefully and only in development/staging environments
 */
const handler = async (event) => {
  try {
    // Only allow this in development/staging environments
    if (process.env.NODE_ENV === 'production' && !event.headers.authorization?.includes('internal-api-key')) {
      return Common.response(false, 'Access denied - production environment', 0, null, Constants.STATUS_FORBIDDEN);
    }

    const sequelize = await connectToDatabase_RW();
    
    // Parse options from query parameters
    const force = event.queryStringParameters?.force === 'true';
    const alter = event.queryStringParameters?.alter === 'true';
    
    console.log(`Starting database sync with options: force=${force}, alter=${alter}`);
    
    // Sync options
    const syncOptions = {
      force: force,  // This will drop and recreate tables
      alter: alter   // This will try to alter existing tables to match models
    };
    
    // Perform the sync
    await sequelize.sync(syncOptions);
    
    // Get table information for verification
    const tables = await sequelize.getQueryInterface().showAllTables();
    
    console.log('Database sync completed successfully');
    console.log('Available tables:', tables);
    
    return Common.response(true, 'Database sync completed successfully', tables.length, {
      options: syncOptions,
      tables: tables,
      timestamp: new Date().toISOString()
    }, Constants.STATUS_SUCCESS);
    
  } catch (error) {
    console.error('Database sync error:', error);
    
    return Common.response(false, 'Database sync failed', 0, 
      process.env.NODE_ENV === 'development' ? { error: error.message } : null, 
      Constants.STATUS_INTERNAL_ERROR);
  }
};

module.exports = { handler };