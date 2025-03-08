import knex from "../database/connection.js";
import generateRandomColor from "../utils/getUniqueColorHexCode.js";
import getRecentKeyboardUsers from "../utils/getRecentKeyboardUsers.js";

// Validate that userIdentifier is a valid number greater than 0
const validateUserIdentifier = (userIdentifier) => {
  return userIdentifier && !isNaN(userIdentifier) && Number(userIdentifier) > 0;
};

// Generate a unique color that is not already assigned to any user
const generateUniqueColor = async (trx) => {
  let color;
  do {
    color = generateRandomColor();
  } while (await trx("users").where({ color }).first()); // Ensure color uniqueness
  return color;
};

// Fetch enabled keyboard keys along with user details
const getEnabledKeysWithUserDetails = async () => {
  return await knex("keyboard_keys")
    .select([
      "keyboard_keys.id",
      "keyboard_keys.key",
      "keyboard_keys.is_pressed",
      "keyboard_keys.pressed_by_user",
      knex.raw(`
        JSON_OBJECT(
          'id', users.id,
          'name', users.name,
          'color', users.color
        ) AS user
      `),
    ])
    .leftJoin("users", "keyboard_keys.pressed_by_user", "users.id")
    .where("keyboard_keys.is_key_enabled", true);
};

// Get the keyboard view with the current user who has control
const getKeyboard = async (req, res, next) => {
  try {
    const { user: userIdentifier } = req.query;
    if (!validateUserIdentifier(userIdentifier)) {
      return res
        .status(400)
        .json({ error: "Invalid userIdentifier. It must be a number." });
    }

    // Fetch current keyboard controller and enabled keys
    const [existingKeyboardController, enabledKeysWithUserDetails] =
      await Promise.all([
        knex("users")
          .where({ has_keyboard_control: true })
          .select("color", "name")
          .first(),
        getEnabledKeysWithUserDetails(),
      ]);

    return res.status(200).render("index.ejs", {
      currentKeyboardUser: existingKeyboardController || {},
      values: enabledKeysWithUserDetails,
      recentKeyboardUsers: getRecentKeyboardUsers(enabledKeysWithUserDetails),
    });
  } catch (error) {
    next(error);
  }
};

// Acquire keyboard control for a user
const acquireKeyboardControl = async (req, res, next) => {
  const trx = await knex.transaction();
  try {
    const { userIdentifier } = req.body;
    if (!validateUserIdentifier(userIdentifier)) {
      return res
        .status(400)
        .json({ error: "Invalid userIdentifier. It must be a number." });
    }

    // Check if the user already exists
    let user = await trx("users")
      .where({ identifier: userIdentifier })
      .select("id", "identifier", "name", "color", "has_keyboard_control")
      .first();

    if (!user) {
      // If user doesn't exist, create a new one with a unique color
      const color = await generateUniqueColor(trx);
      const [newUserId] = await trx("users").insert({
        color,
        has_keyboard_control: true,
        identifier: userIdentifier,
        name: `User ${userIdentifier}`,
        last_activity: knex.fn.now(),
      });
      user = {
        id: newUserId,
        identifier: userIdentifier,
        name: `User ${userIdentifier}`,
        color,
      };
    } else {
      // If user exists, update last activity and assign keyboard control
      await trx("users")
        .where({ identifier: userIdentifier })
        .update({ last_activity: knex.fn.now(), has_keyboard_control: true });
    }

    // Remove control from any other user
    await trx("users")
      .where({ has_keyboard_control: true })
      .andWhereNot("id", user.id)
      .update({ has_keyboard_control: false });

    await trx.commit();
    return res.status(200).json({ user });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
};

// Get details of a specific user by their identifier
const getKeyboardUserDetails = async (req, res, next) => {
  try {
    const { id: userIdentifier } = req.params;
    if (!validateUserIdentifier(userIdentifier)) {
      return res
        .status(400)
        .json({ error: "Invalid userId. It must be a number." });
    }

    // Fetch user details from the database
    const userDetails = await knex("users")
      .where({ identifier: userIdentifier })
      .select("id", "identifier", "name", "last_activity")
      .first();

    return res.status(200).json(userDetails);
  } catch (error) {
    next(error);
  }
};

// Release keyboard control for a user
const releaseKeyboardControl = async (req, res, next) => {
  try {
    const { userIdentifier } = req.body;
    if (!validateUserIdentifier(userIdentifier)) {
      return res
        .status(400)
        .json({ error: "Invalid userId. It must be a number." });
    }

    // Update the user to remove keyboard control
    await knex("users")
      .where({ identifier: userIdentifier })
      .update({ has_keyboard_control: false });

    return res.status(204).end(); // No content response
  } catch (error) {
    next(error);
  }
};

// Handle key press event and update database
const keyPressed = async (req, res, next) => {
  const trx = await knex.transaction();
  try {
    const { userIdentifier, keyId } = req.body;
    if (
      !validateUserIdentifier(userIdentifier) ||
      !validateUserIdentifier(keyId)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid userId or keyId. Both must be numbers." });
    }

    // Fetch user details to check if they exist
    const user = await trx("users")
      .where({ identifier: userIdentifier })
      .select("id", "name", "color", "has_keyboard_control")
      .first();

    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    // Update user's last activity timestamp
    await trx("users")
      .where({ identifier: userIdentifier })
      .update({ last_activity: knex.fn.now() });

    // Fetch the keyboard key state
    const keyboardKey = await trx("keyboard_keys")
      .where({ id: keyId })
      .select("is_pressed")
      .first();

    if (!keyboardKey) {
      await trx.rollback();
      return res.status(400).json({ error: "Invalid keyId." });
    }

    // Toggle key press state and assign/release it from the user
    await trx("keyboard_keys")
      .where({ id: keyId })
      .update({
        is_pressed: !keyboardKey.is_pressed,
        pressed_by_user: keyboardKey.is_pressed ? null : user.id,
      });

    await trx.commit();

    // Fetch the updated state of all enabled keys
    const enabledKeysWithUserDetails = await getEnabledKeysWithUserDetails();
    return res.status(200).json({ enabledKeysWithUserDetails });
  } catch (error) {
    await trx.rollback();
    next(error);
  }
};

// Export all functions
export default {
  getKeyboard,
  acquireKeyboardControl,
  getKeyboardUserDetails,
  releaseKeyboardControl,
  keyPressed,
};