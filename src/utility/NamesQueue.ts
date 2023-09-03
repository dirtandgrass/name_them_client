import { NameType } from "../components/Sections/Names/RandomNameList/RandomNameList";
import AwaitedBuffer from "./AwaitedBuffer";

export const GlobalNamesQueue: { names: AwaitedBuffer<NameType> | null } = { names: null };
