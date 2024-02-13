const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

//Generate JWT imamas user id ir pridedama drukytė arba JWT_SECTER is .env failo
// tai daroma kad neitų atkoduoti .env failo
//
//

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

//@description -- register a new user
//@route -- POST /api/users
//@access PUBLIC

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Add all fields!");
  }
  //check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists!");
  }
  //hash password - kiek simboliu papildomai prideti irasyti skaiciu skliaustuose
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create a user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "simple",
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("invalid user data");
  }
});

//@description -- login an user
//@route -- POST /api/users/login
//@access -- PUBLIC

const loginUser = asyncHandler(async (req, res) => {
  //cia ka user suveda login formoje
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  //user.password - is db uzkoduotas pass, lygina ivesta pass su db esanciu uzkoduotu
  if (user && (await bcrypt.compare(password, user.password))) {
    //siunciamas respose json'u, sugeneruoja token loginui, irasomas useriui i LS narsykleje
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      //
      token: generateToken(user._id),
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("invalid information");
  }
});

//description -- get user
//@routes GET /api/users
//@access PRIVATE

//gaunama info apie prisijungusi user'i
const getUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

//@description Get users data
//@route GET /api/users/list
//@route PRIVATE

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.aggregate([
    {
      $lookup: {
        from: "ads",
        localField: "_id",
        foreignField: "user",
        as: "ads",
      },
    },
    {
      //rodys visus users (admins ir simple)
      $match: { role: { $in: ["simple", "admin"] } },
    },
    {
      //cia aprasoma ko nerodyto useriui kai GET'ina
      $unset: [
        "password",
        "createdAt",
        "updatedAt",
        "gaols.createdAt",
        "ads.updatedAt",
        "ads.__v",
        "__v",
      ],
    },
  ]);
  res.status(200).json(users);
});

///----------------
//@description -- Update user
//@route PUT /api/users/:id
//@access PRIVATE

const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    res.status(400);
    throw new Error("user not found");
  }

  user.name = name || user.name;
  user.email = email || user.email;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }
  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    token: generateToken(updatedUser._id),
    role: updatedUser.role,
  });
});

//@description Delete a user
//@route DELETE /api/users/:id
//@access PRIVATE

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findByIdAndDelete;

  if (!user) {
    res.status(400);
    throw new Error("user not found");
  }

  res.json({ message: "user has been removed" });
});

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
};
