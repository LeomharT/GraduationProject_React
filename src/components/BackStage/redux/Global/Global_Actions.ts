import { IsAsideFoldedEnum, IsAsideFoldedType } from "./Global_Type";

export const FoldAside = (): IsAsideFoldedType => ({ type: IsAsideFoldedEnum.Fold });
export const UnFoldAside = (): IsAsideFoldedType => ({ type: IsAsideFoldedEnum.UnFold });
