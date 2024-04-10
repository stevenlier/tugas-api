const usersRepository = require('./users-repository');
const { hashPassword } = require('../../../utils/password');
const { errorResponder, errorTypes } = require('../../../core/errors');
 
/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();
 
  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
 
  return results;
}
 
/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);
 
  // User not found
  if (!user) {
    return null;
  }
 
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
 
/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @param {string} confirm_password - Confirm Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);
 
  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }
 
  return true;
}
 
/**
 * Change Password
 * @param {string} id - ID
 * @param {string} old_password - Old password
 * @param {string} new_password - New password
 * @param {string} confirm_password - Confirm new password
 * @return {object}
 */
 
async function changePassword(
  id,
  old_password,
  new_password,
  confirm_password
) {
  try {
    const user = await usersRepository.getUser(id);
    if (!user) {
      return null;
    }
 
    // Check if the old password matches the password stored in the database
    const passwordMatch = await usersRepository.passwordMatched(
      old_password,
      user.password
    );
    if (!passwordMatch) {
      return null;
    }
 
    // Check if the new password and confirm password match
    if (new_password !== confirm_password) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Confirm Password and New Password not match.'
      );
    }
 
    // Hash the new password
    const hashedPassword = await hashPassword(new_password);
 
    // Update user's password in the database
    user.password = hashedPassword;
    await user.save();
 
    return {
      email: user.email,
      id: user.id,
    };
  } catch (error) {
    throw error;
  }
}
 
/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);
 
  // User not found
  if (!user) {
    return null;
  }
 
  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }
}
 
/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);
 
  // User not found
  if (!user) {
    return null;
  }
 
  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }
 
  return true;
}
 
/**
 * Check if email is already existed
 * @param {string} email - Email
 * @returns {boolean}
 */
 
async function emailExist(email) {
  try {
    const emailExist = await usersRepository.isEmailExist(email);
    return emailExist;
  } catch (err) {
    throw err;
  }
}
 
module.exports = {
  getUsers,
  getUser,
  createUser,
  changePassword,
  updateUser,
  deleteUser,
  emailExist,
};
 