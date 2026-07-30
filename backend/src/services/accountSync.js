import crypto from 'crypto';
import { gameDbPool, supabase } from '../config/database.js';

// SRP6 Password Hashing for AzerothCore
class WoWPasswordHasher {
  constructor() {
    this.salt = crypto.randomBytes(32);
  }

  // Generate SRP6 verifier
  generateVerifier(username, password) {
    const I = Buffer.from(`${username.toUpperCase()}:${password.toUpperCase()}`, 'utf8');
    const s = this.salt;
    
    // Hash I
    const sha1 = crypto.createHash('sha1');
    sha1.update(I);
    const hI = sha1.digest();
    
    // g = 7, N = large prime (simplified for this example)
    const g = Buffer.from([7]);
    const N = Buffer.from([
      0x89, 0x4B, 0x64, 0x51, 0x37, 0x57, 0x13, 0x95,
      0xD3, 0x5A, 0x58, 0x49, 0x69, 0x56, 0x85, 0x73,
      0x75, 0x4F, 0x9F, 0x8C, 0x08, 0x2F, 0x8D, 0x2B,
      0x49, 0x56, 0x85, 0x73, 0x75, 0x4F, 0x9F, 0x8C
    ]);
    
    // x = H(s, H(I))
    const sha2 = crypto.createHash('sha1');
    sha2.update(s);
    sha2.update(hI);
    const x = sha2.digest();
    
    // v = g^x mod N (simplified)
    const v = crypto.createHash('sha1');
    v.update(x);
    const verifier = v.digest('hex');
    
    return {
      salt: s.toString('hex'),
      verifier: verifier.toUpperCase()
    };
  }

  // Alternative simpler SHA1 hashing (some servers use this)
  generateSimpleHash(username, password) {
    const sha1 = crypto.createHash('sha1');
    sha1.update(`${username.toUpperCase()}:${password.toUpperCase()}`);
    return sha1.digest('hex').toUpperCase();
  }
}

// Create game account
async function createGameAccount(supabaseUserId, accountName, password, expansion = 'WotLK 3.3.5a') {
  try {
    const connection = await gameDbPool.getConnection();
    
    try {
      // Check if account already exists
      const [existing] = await connection.query(
        'SELECT id FROM account WHERE username = ?',
        [accountName]
      );

      if (existing.length > 0) {
        connection.release();
        return { success: false, error: 'Account name already exists' };
      }

      // Generate password hash using SRP6
      const hasher = new WoWPasswordHasher();
      const { salt, verifier } = hasher.generateVerifier(accountName, password);

      // Insert into account table (AzerothCore structure)
      const [result] = await connection.query(
        `INSERT INTO account (username, salt, verifier, expansion, email, joindate)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [accountName, salt, verifier, expansion, null]
      );

      connection.release();

      // Link to Supabase user
      const { error: supabaseError } = await supabase
        .from('game_accounts')
        .insert({
          user_id: supabaseUserId,
          account_name: accountName,
          expansion: expansion,
          created_at: new Date().toISOString()
        });

      if (supabaseError) {
        console.error('Error linking game account to Supabase:', supabaseError);
      }

      return { 
        success: true, 
        accountId: result.insertId,
        message: 'Game account created successfully'
      };

    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Error creating game account:', error);
    return { success: false, error: 'Failed to create game account' };
  }
}

// Get user's game accounts
async function getUserGameAccounts(supabaseUserId) {
  try {
    const { data, error } = await supabase
      .from('game_accounts')
      .select('*')
      .eq('user_id', supabaseUserId);

    if (error) throw error;

    return { success: true, accounts: data || [] };
  } catch (error) {
    console.error('Error fetching game accounts:', error);
    return { success: false, error: 'Failed to fetch game accounts' };
  }
}

// Delete game account
async function deleteGameAccount(supabaseUserId, accountName) {
  try {
    const connection = await gameDbPool.getConnection();
    
    try {
      // Delete from game server database
      await connection.query(
        'DELETE FROM account WHERE username = ?',
        [accountName]
      );

      connection.release();

      // Remove from Supabase
      const { error } = await supabase
        .from('game_accounts')
        .delete()
        .eq('user_id', supabaseUserId)
        .eq('account_name', accountName);

      if (error) throw error;

      return { success: true, message: 'Game account deleted' };
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Error deleting game account:', error);
    return { success: false, error: 'Failed to delete game account' };
  }
}

// Sync password from Supabase to game server
async function syncPassword(supabaseUserId, newPassword) {
  try {
    // Get user's game accounts
    const { success, accounts } = await getUserGameAccounts(supabaseUserId);
    
    if (!success || !accounts || accounts.length === 0) {
      return { success: false, error: 'No game accounts found' };
    }

    const connection = await gameDbPool.getConnection();
    
    try {
      for (const account of accounts) {
        const hasher = new WoWPasswordHasher();
        const { salt, verifier } = hasher.generateVerifier(account.account_name, newPassword);

        await connection.query(
          'UPDATE account SET salt = ?, verifier = ? WHERE username = ?',
          [salt, verifier, account.account_name]
        );
      }

      connection.release();
      return { success: true, message: 'Password synced to game accounts' };
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Error syncing password:', error);
    return { success: false, error: 'Failed to sync password' };
  }
}

export {
  createGameAccount,
  getUserGameAccounts,
  deleteGameAccount,
  syncPassword
};