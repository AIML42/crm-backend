const express = require("express");
const { check } = require("express-validator");
const { addMember, getMembers, updateMember, deleteMember } = require("../controllers/teamController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// add members
router.post(
    '/add',
    [
        protect,
        admin,
        check('firstName', 'First name is required').not().isEmpty(),
        check('email', 'Please include a valid mail').isEmail(),
        check('role', 'Confirm role is required').exists(),
    ],
    addMember
);

//get members
router.get('/',[protect, admin], getMembers);

// update member
router.patch(
    '/:id',
    [
        check('firstName', 'First name is required').not().isEmpty(),
        check('email', 'Please include a valid mail').isEmail(),
        check('password', 'Password must be 6 or more characters').isLength({min : 6}),
        check('confirmPassword', 'Confirm password is required').exists(),
    ],
    updateMember
);

//delete a  member
router.delete('/:id',[protect, admin], deleteMember);

module.exports = router