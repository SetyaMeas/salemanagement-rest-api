import { hashSync } from "bcryptjs";
import { log } from "console";
import { getSaleId } from "./db/service/help";

getSaleId().then((e) => console.log(e));
