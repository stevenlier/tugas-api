const { User } = require('../../../models');
 
/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return User.find({});
}
 
/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}
 
/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @param {string} confirm_password - Confirm password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}
 
/**
 * Check if new password matches the stored password hash.
 * @param {string} new_password - The password to check.
 * @param {string} hashedPassword - The hashed password stored in the database.
 * @returns {boolean}
 */
async function passwordMatched(password, hashedPassword) {
  const bcrypt = require('bcrypt');
  return await bcrypt.compare(password, hashedPassword);
}
 
/** Change password
 * @param {string} id - ID
 * @param {string} new_password - New password
 * @return {Promise}
 */
async function changePassword(id, new_password) {
  try {
    const user = await User.findByIdAndUpdate(id, { password: new_password });
 
    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
}
 
/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}
 
/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}
 
/**
 * Check if email is already existed
 * @param {string} email - Email
 * @returns {Promise}
 */
async function isEmailExist(email) {
  const user = await User.findOne({ email });
  return !!user;
}
 
module.exports = {
  getUsers,
  getUser,
  createUser,
  passwordMatched,
  changePassword,
  updateUser,
  deleteUser,
  isEmailExist,
};