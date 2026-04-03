import { userModel } from "../database/model/user.model";

export const deletedAccounts = async (req, res, next) => {
  const user = await userModel.findOne({ _id: req.user._id });
  if (!user || user.isDeleted) {
    return res
      .status(403)
      .json({ message: "Account is deleted or user not found" });
  }
  next();
};
